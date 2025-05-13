
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { useMuseum, Memory, Room } from "@/context/MuseumContext";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar, 
  ImageIcon, 
  Video, 
  AudioLines,
  BookUser
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function MemoryDetail() {
  const { roomId, memoryId } = useParams<{ roomId: string; memoryId: string }>();
  const { rooms, memories, isLoading, deleteMemory } = useMuseum();
  const navigate = useNavigate();
  
  const [memory, setMemory] = useState<Memory | undefined>();
  const [room, setRoom] = useState<Room | undefined>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    // Find the memory and room
    if (roomId && memoryId) {
      const foundMemory = memories.find(m => m.id === memoryId && m.roomId === roomId);
      setMemory(foundMemory);
      
      if (foundMemory) {
        const foundRoom = rooms.find(r => r.id === foundMemory.roomId);
        setRoom(foundRoom);
      }
    }
  }, [roomId, memoryId, memories, rooms]);

  const handleDelete = async () => {
    if (!memoryId) return;
    
    try {
      setIsDeleting(true);
      await deleteMemory(memoryId);
      navigate(`/rooms/${roomId}`);
    } catch (error) {
      console.error("Error deleting memory:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  if (isLoading) {
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
            <Skeleton className="h-8 w-40" />
          </div>
          
          <div className="museum-card">
            <Skeleton className="h-96 w-full" />
            <div className="p-6">
              <Skeleton className="h-8 w-2/3 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!memory || !room) {
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
            <h1 className="text-3xl font-bold">Memória não encontrada</h1>
          </div>
          
          <div className="museum-card p-10 text-center">
            <div className="flex flex-col items-center justify-center mb-6">
              <BookUser size={64} className="text-primary mb-4" />
              <h2 className="text-xl font-semibold">Memória não encontrada</h2>
              <p className="text-gray-500 mt-2">A memória que você está procurando não existe ou foi removida</p>
            </div>
            <Button 
              className="highlight-btn"
              onClick={() => navigate(`/rooms/${roomId}`)}
            >
              Voltar para a sala
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
            <h1 className="text-3xl font-bold truncate max-w-md">{memory.title}</h1>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              onClick={() => navigate(`/rooms/${roomId}/memories/${memoryId}/edit`)}
            >
              <Edit size={16} className="mr-2" />
              Editar
            </Button>
            <Button 
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 size={16} className="mr-2" />
              Excluir
            </Button>
          </div>
        </div>
        
        <div className="museum-card overflow-hidden">
          {/* Memory content */}
          <div className="bg-gray-50">
            {memory.mediaType === "image" && memory.mediaUrl && (
              <div className="flex justify-center bg-black">
                <img 
                  src={memory.mediaUrl} 
                  alt={memory.title} 
                  className="max-h-[70vh] object-contain" 
                />
              </div>
            )}
            
            {memory.mediaType === "video" && memory.mediaUrl && (
              <div className="flex justify-center bg-black p-4">
                <video 
                  src={memory.mediaUrl} 
                  controls 
                  className="max-h-[70vh] max-w-full" 
                />
              </div>
            )}
            
            {memory.mediaType === "audio" && memory.mediaUrl && (
              <div className="flex justify-center items-center bg-gray-50 p-8">
                <div className="w-full max-w-2xl">
                  <audio 
                    src={memory.mediaUrl} 
                    controls 
                    className="w-full" 
                  />
                </div>
              </div>
            )}
            
            {memory.mediaType === "text" && (
              <div className="max-w-3xl mx-auto p-8">
                <div className="prose prose-slate max-w-none">
                  {memory.content?.split('\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="p-6">
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">{memory.title}</h2>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar size={14} className="mr-1" />
                  {new Date(memory.createdAt).toLocaleDateString('pt-BR')}
                </div>
              </div>
              
              {memory.description && (
                <p className="text-gray-600">{memory.description}</p>
              )}
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="flex items-center mr-4">
                      <span className="mr-1">Sala:</span>
                      <span 
                        className="font-medium text-primary hover:underline cursor-pointer"
                        onClick={() => navigate(`/rooms/${room.id}`)}
                      >
                        {room.name}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="mr-1">Tipo:</span>
                      <div className="flex items-center">
                        {memory.mediaType === "image" && <ImageIcon size={14} className="mr-1" />}
                        {memory.mediaType === "video" && <Video size={14} className="mr-1" />}
                        {memory.mediaType === "audio" && <AudioLines size={14} className="mr-1" />}
                        {memory.mediaType === "text" && <span className="mr-1">T</span>}
                        <span className="capitalize">{memory.mediaType}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {memory.aiGenerated && (
                  <div className="text-xs bg-highlight/10 text-highlight px-2 py-1 rounded flex items-center">
                    <Wand2 size={12} className="mr-1" />
                    Título gerado com IA
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isto excluirá permanentemente esta memória
              do seu museu pessoal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
