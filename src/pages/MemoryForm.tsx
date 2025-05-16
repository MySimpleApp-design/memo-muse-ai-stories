
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { useMuseum, Memory } from "@/context/MuseumContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, X, Save, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { usePlan } from "@/context/PlanContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MemoryForm() {
  const { roomId, memoryId } = useParams<{ roomId: string; memoryId: string }>();
  const { rooms, memories, createMemory, updateMemory, isLoading, getRoomMemoryCount } = useMuseum();
  const navigate = useNavigate();
  const { isPremium, getUsageDetails, planLimits } = usePlan();
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaType, setMediaType] = useState<"text" | "image" | "video" | "audio">("text");
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLimitReached, setIsLimitReached] = useState(false);
  
  // Refs for file inputs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  
  const isEditMode = !!memoryId;
  
  // Get the room
  const room = rooms.find(r => r.id === roomId);
  
  useEffect(() => {
    // Check if the user has reached the memory limit
    if (roomId && !isPremium && !isEditMode) {
      const usage = getUsageDetails(roomId);
      setIsLimitReached(usage.current >= planLimits.maxMemoriesPerRoom);
    }
    
    if (isEditMode && memoryId) {
      const memory = memories.find(m => m.id === memoryId);
      if (memory) {
        setTitle(memory.title);
        setDescription(memory.description);
        setMediaType(memory.mediaType);
        setContent(memory.content || "");
        setMediaUrl(memory.mediaUrl || "");
        setMediaPreview(memory.mediaUrl || null);
      }
    }
  }, [memoryId, memories, isEditMode, roomId, isPremium, getUsageDetails, planLimits]);

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video" | "audio") => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Simple validation
    if (type === "image" && !file.type.startsWith("image/")) {
      toast.error("Por favor, envie apenas imagens");
      return;
    }
    
    if (type === "video" && !file.type.startsWith("video/")) {
      toast.error("Por favor, envie apenas vídeos");
      return;
    }
    
    if (type === "audio" && !file.type.startsWith("audio/")) {
      toast.error("Por favor, envie apenas áudios");
      return;
    }
    
    // Create URL for preview
    const objectUrl = URL.createObjectURL(file);
    setMediaPreview(objectUrl);
    
    // Convert to base64 for storage
    const reader = new FileReader();
    reader.onload = () => {
      setMediaUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearMedia = () => {
    setMediaUrl("");
    setMediaPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user has reached plan limits
    if (!isPremium && !isEditMode && isLimitReached) {
      toast.error("Limite de memórias atingido no plano gratuito. Torne-se Premium para liberar uso ilimitado.");
      return;
    }
    
    if (!title.trim()) {
      toast.error("Por favor, informe um título para a memória");
      return;
    }
    
    if (mediaType === "text" && !content.trim()) {
      toast.error("Por favor, adicione um texto para sua memória");
      return;
    }
    
    if ((mediaType === "image" || mediaType === "video" || mediaType === "audio") && !mediaUrl) {
      toast.error(`Por favor, faça upload de um arquivo de ${mediaType}`);
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const memoryData: Omit<Memory, "id" | "userId" | "createdAt" | "updatedAt"> = {
        roomId: roomId as string,
        title: title.trim(),
        description: description.trim(),
        mediaType,
        ...(content && { content }),
        ...(mediaUrl && { mediaUrl }),
      };
      
      if (isEditMode && memoryId) {
        await updateMemory(memoryId, memoryData);
        toast.success("Memória atualizada com sucesso");
        navigate(`/rooms/${roomId}/memories/${memoryId}`);
      } else {
        const newMemory = await createMemory(memoryData);
        toast.success("Memória criada com sucesso");
        navigate(`/rooms/${roomId}/memories/${newMemory.id}`);
      }
    } catch (error) {
      console.error("Error submitting memory:", error);
      toast.error("Ocorreu um erro ao salvar a memória");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!room) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-4"
              onClick={() => navigate("/rooms")}
            >
              <ArrowLeft size={16} className="mr-2" />
              Voltar
            </Button>
            <h1 className="text-3xl font-bold">Sala não encontrada</h1>
          </div>
          
          <div className="museum-card p-10 text-center">
            <p className="text-gray-500 mb-4">A sala que você está procurando não existe ou foi removida</p>
            <Button 
              className="highlight-btn"
              onClick={() => navigate("/rooms")}
            >
              Ver todas as salas
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (isLimitReached && !isPremium && !isEditMode) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-4"
              onClick={() => navigate(`/rooms/${roomId}`)}
            >
              <ArrowLeft size={16} className="mr-2" />
              Voltar
            </Button>
            <h1 className="text-3xl font-bold">Limite de memórias atingido</h1>
          </div>
          
          <div className="museum-card p-10 text-center">
            <h2 className="text-2xl font-bold mb-4 text-highlight">Limite de Plano Atingido</h2>
            <p className="text-gray-500 mb-6">
              Você atingiu o limite de {planLimits.maxMemoriesPerRoom} memórias por sala no plano gratuito.
            </p>
            <p className="text-gray-500 mb-10">
              Faça upgrade para o plano Premium e obtenha memórias ilimitadas em todas as suas salas.
            </p>
            
            <div className="mb-6 p-6 bg-highlight/5 border border-highlight/20 rounded-lg">
              <h3 className="text-xl font-semibold mb-2 text-highlight">Plano Premium</h3>
              <p className="mb-4">2,50 USD/mês. Libera uso ilimitado de salas, memórias e funcionalidades multimídia.</p>
              <Link to="/plans">
                <Button className="bg-highlight hover:bg-highlight/80">
                  <CreditCard size={16} className="mr-2" />
                  Fazer Upgrade para Premium
                </Button>
              </Link>
            </div>
            
            <Button 
              variant="outline"
              onClick={() => navigate(`/rooms/${roomId}`)}
            >
              <ArrowLeft size={16} className="mr-2" />
              Voltar para a Sala
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-4"
              onClick={() => navigate(`/rooms/${roomId}`)}
            >
              <ArrowLeft size={16} className="mr-2" />
              Voltar
            </Button>
            <h1 className="text-3xl font-bold">
              {isEditMode ? "Editar Memória" : "Criar Nova Memória"}
            </h1>
          </div>
          <div>
            <p className="text-sm text-gray-500">Sala: <span className="font-medium">{room.name}</span></p>
          </div>
        </div>
        
        <div className="museum-card p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title and Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="title">Título</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/rooms/${roomId}`)}
                    disabled={isLoading || isSubmitting}
                    className="text-highlight hover:text-highlight-dark"
                  >
                    <ArrowLeft size={16} className="mr-1" />
                    Voltar
                  </Button>
                </div>
                <Input
                  id="title"
                  placeholder="Título da sua memória"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isLoading || isSubmitting}
                  maxLength={100}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva esta memória (opcional)"
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isLoading || isSubmitting}
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 text-right">
                  {description.length}/200
                </p>
              </div>
            </div>
            
            {/* Media Type Selection */}
            <div className="space-y-2">
              <Label>Tipo de Memória</Label>
              <Select
                value={mediaType}
                onValueChange={(value) => setMediaType(value as "text" | "image" | "video" | "audio")}
                disabled={isLoading || isSubmitting || isEditMode}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de memória" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Texto</SelectItem>
                  <SelectItem value="image">Imagem</SelectItem>
                  <SelectItem value="video">Vídeo</SelectItem>
                  <SelectItem value="audio">Áudio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Media Content */}
            <div className="space-y-4">
              {mediaType === "text" && (
                <div className="space-y-2">
                  <Label htmlFor="content">Texto da Memória</Label>
                  <Textarea
                    id="content"
                    placeholder="Escreva sua memória aqui..."
                    rows={8}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={isLoading || isSubmitting}
                    maxLength={5000}
                  />
                  <p className="text-xs text-gray-500 text-right">
                    {content.length}/5000
                  </p>
                </div>
              )}
              
              {mediaType === "image" && (
                <div className="space-y-2">
                  <Label>Imagem</Label>
                  <div className="border border-dashed border-gray-300 rounded-lg">
                    {mediaPreview ? (
                      <div className="relative">
                        <img 
                          src={mediaPreview} 
                          alt="Preview" 
                          className="w-full max-h-96 object-contain rounded-lg" 
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute top-2 right-2 h-8 w-8"
                          onClick={clearMedia}
                          disabled={isLoading || isSubmitting}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-64 cursor-pointer bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <Upload size={32} className="text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Clique para enviar uma imagem</span>
                        <input 
                          ref={imageInputRef}
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => handleMediaUpload(e, "image")}
                          disabled={isLoading || isSubmitting}
                        />
                      </label>
                    )}
                  </div>
                </div>
              )}
              
              {mediaType === "video" && (
                <div className="space-y-2">
                  <Label>Vídeo</Label>
                  <div className="border border-dashed border-gray-300 rounded-lg">
                    {mediaPreview ? (
                      <div className="relative">
                        <video 
                          src={mediaPreview} 
                          controls 
                          className="w-full max-h-96 rounded-lg" 
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute top-2 right-2 h-8 w-8"
                          onClick={clearMedia}
                          disabled={isLoading || isSubmitting}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-64 cursor-pointer bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <Upload size={32} className="text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Clique para enviar um vídeo</span>
                        <span className="text-xs text-gray-400 mt-1">Tamanho máximo: 100MB</span>
                        <input 
                          ref={videoInputRef}
                          type="file" 
                          accept="video/*" 
                          className="hidden" 
                          onChange={(e) => handleMediaUpload(e, "video")}
                          disabled={isLoading || isSubmitting}
                        />
                      </label>
                    )}
                  </div>
                </div>
              )}
              
              {mediaType === "audio" && (
                <div className="space-y-2">
                  <Label>Áudio</Label>
                  <div className="border border-dashed border-gray-300 rounded-lg">
                    {mediaPreview ? (
                      <div className="relative p-6 bg-gray-50 rounded-lg">
                        <audio 
                          src={mediaPreview} 
                          controls 
                          className="w-full" 
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute top-2 right-2 h-8 w-8"
                          onClick={clearMedia}
                          disabled={isLoading || isSubmitting}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-40 cursor-pointer bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <Upload size={32} className="text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Clique para enviar um áudio</span>
                        <span className="text-xs text-gray-400 mt-1">Tamanho máximo: 20MB</span>
                        <input 
                          ref={audioInputRef}
                          type="file" 
                          accept="audio/*" 
                          className="hidden" 
                          onChange={(e) => handleMediaUpload(e, "audio")}
                          disabled={isLoading || isSubmitting}
                        />
                      </label>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/rooms/${roomId}`)}
                disabled={isLoading || isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="highlight-btn" 
                disabled={isLoading || isSubmitting}
              >
                <Save size={16} className="mr-2" />
                {isSubmitting 
                  ? (isEditMode ? "Salvando..." : "Criando...") 
                  : (isEditMode ? "Salvar Alterações" : "Salvar Memória")
                }
              </Button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
