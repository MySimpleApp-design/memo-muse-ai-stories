
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { useMuseum, Room } from "@/context/MuseumContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, X, Save } from "lucide-react";
import { toast } from "sonner";

export default function RoomForm() {
  const { roomId } = useParams<{ roomId: string }>();
  const { rooms, createRoom, updateRoom, isLoading } = useMuseum();
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isEditMode = !!roomId;
  
  useEffect(() => {
    if (isEditMode) {
      const room = rooms.find(r => r.id === roomId);
      if (room) {
        setName(room.name);
        setDescription(room.description);
        setCoverImageUrl(room.coverImageUrl || "");
        setImagePreview(room.coverImageUrl || null);
      }
    }
  }, [roomId, rooms, isEditMode]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Simple validation
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, envie apenas imagens");
      return;
    }
    
    // Create URL for preview
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
    
    // Convert image to base64 for storage
    const reader = new FileReader();
    reader.onload = () => {
      setCoverImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setCoverImageUrl("");
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Por favor, informe um nome para a sala");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const roomData: Omit<Room, "id" | "userId" | "createdAt" | "updatedAt"> = {
        name: name.trim(),
        description: description.trim(),
        ...(coverImageUrl && { coverImageUrl }),
      };
      
      if (isEditMode && roomId) {
        await updateRoom(roomId, roomData);
        toast.success("Sala atualizada com sucesso");
        navigate(`/rooms/${roomId}`);
      } else {
        const newRoom = await createRoom(roomData);
        toast.success("Sala criada com sucesso");
        navigate(`/rooms/${newRoom.id}`);
      }
    } catch (error) {
      console.error("Error submitting room:", error);
      toast.error("Ocorreu um erro ao salvar a sala");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-4"
            onClick={() => navigate(isEditMode ? `/rooms/${roomId}` : "/rooms")}
          >
            <ArrowLeft size={16} className="mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">
            {isEditMode ? "Editar Sala" : "Criar Nova Sala"}
          </h1>
        </div>
        
        <div className="museum-card p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Sala</Label>
                  <Input
                    id="name"
                    placeholder="Digite o nome da sala"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading || isSubmitting}
                    maxLength={50}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva o que esta sala representa para você"
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isLoading || isSubmitting}
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 text-right">
                    {description.length}/500
                  </p>
                </div>
              </div>
              
              <div>
                <Label>Imagem de Capa</Label>
                <div className="mt-2 border border-dashed border-gray-300 rounded-lg">
                  {imagePreview ? (
                    <div className="relative h-64 bg-gray-50">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover rounded-lg" 
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={clearImage}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-64 cursor-pointer bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <Upload size={32} className="text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Clique para enviar uma imagem</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload}
                        disabled={isLoading || isSubmitting}
                      />
                    </label>
                  )}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Recomendado: Imagem com boa resolução e formato 3:2
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(isEditMode ? `/rooms/${roomId}` : "/rooms")}
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
                  : (isEditMode ? "Salvar Alterações" : "Criar Sala")
                }
              </Button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
