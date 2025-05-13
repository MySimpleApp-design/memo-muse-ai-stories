
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { useMuseum, Memory } from "@/context/MuseumContext";
import { Button } from "@/components/ui/button";
import { 
  Folder, 
  Plus, 
  Edit, 
  ArrowLeft, 
  ImageIcon, 
  Video, 
  AudioLines,
  Trash2
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export default function RoomDetail() {
  const { roomId } = useParams<{ roomId: string }>();
  const { rooms, memories, isLoading, deleteMemory } = useMuseum();
  const navigate = useNavigate();
  
  const [room, setRoom] = useState(rooms.find(r => r.id === roomId));
  const [roomMemories, setRoomMemories] = useState<Memory[]>([]);
  const [memoryToDelete, setMemoryToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    // Find the room
    const foundRoom = rooms.find(r => r.id === roomId);
    setRoom(foundRoom);
    
    // Find memories for this room
    if (roomId) {
      const foundMemories = memories.filter(m => m.roomId === roomId);
      setRoomMemories(foundMemories);
    }
  }, [roomId, rooms, memories]);

  const handleDeleteMemory = async () => {
    if (!memoryToDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteMemory(memoryToDelete);
      setMemoryToDelete(null);
    } catch (error) {
      console.error("Error deleting memory:", error);
    } finally {
      setIsDeleting(false);
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
              onClick={() => navigate("/rooms")}
            >
              <ArrowLeft size={16} className="mr-2" />
              Voltar
            </Button>
            <Skeleton className="h-8 w-40" />
          </div>
          
          <Skeleton className="h-48 w-full mb-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="memory-item">
                <Skeleton className="h-40 w-full" />
                <div className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

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
            <div className="flex flex-col items-center justify-center mb-6">
              <Folder size={64} className="text-primary mb-4" />
              <h2 className="text-xl font-semibold">Sala não encontrada</h2>
              <p className="text-gray-500 mt-2">A sala que você está procurando não existe ou foi removida</p>
            </div>
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

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-4"
              onClick={() => navigate("/rooms")}
            >
              <ArrowLeft size={16} className="mr-2" />
              Voltar
            </Button>
            <h1 className="text-3xl font-bold">{room.name}</h1>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              onClick={() => navigate(`/rooms/${room.id}/edit`)}
            >
              <Edit size={16} className="mr-2" />
              Editar Sala
            </Button>
            <Button 
              className="highlight-btn"
              onClick={() => navigate(`/rooms/${room.id}/memories/new`)}
            >
              <Plus size={16} className="mr-2" />
              Nova Memória
            </Button>
          </div>
        </div>
        
        <div className="museum-card p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 lg:w-1/4 h-48 bg-primary-light rounded-md">
              {room.coverImageUrl ? (
                <img 
                  src={room.coverImageUrl} 
                  alt={room.name} 
                  className="w-full h-full object-cover rounded-md" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Folder size={64} className="text-primary" />
                </div>
              )}
            </div>
            
            <div className="w-full md:w-2/3 lg:w-3/4">
              <h2 className="text-2xl font-semibold mb-2">{room.name}</h2>
              <p className="text-gray-600 mb-4">{room.description}</p>
              
              <div className="flex flex-wrap gap-4">
                <div className="bg-primary/10 px-4 py-2 rounded">
                  <p className="text-sm text-gray-500">Criada em</p>
                  <p className="font-medium">{new Date(room.createdAt).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="bg-primary/10 px-4 py-2 rounded">
                  <p className="text-sm text-gray-500">Memórias</p>
                  <p className="font-medium">{roomMemories.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Todas ({roomMemories.length})</TabsTrigger>
            <TabsTrigger value="image">Imagens ({roomMemories.filter(m => m.mediaType === "image").length})</TabsTrigger>
            <TabsTrigger value="video">Vídeos ({roomMemories.filter(m => m.mediaType === "video").length})</TabsTrigger>
            <TabsTrigger value="audio">Áudios ({roomMemories.filter(m => m.mediaType === "audio").length})</TabsTrigger>
            <TabsTrigger value="text">Textos ({roomMemories.filter(m => m.mediaType === "text").length})</TabsTrigger>
          </TabsList>
          
          {['all', 'image', 'video', 'audio', 'text'].map((tab) => (
            <TabsContent key={tab} value={tab}>
              {roomMemories.length === 0 ? (
                <div className="museum-card p-8 text-center">
                  <div className="flex flex-col items-center justify-center mb-6">
                    <Folder size={48} className="text-primary mb-4" />
                    <h2 className="text-lg font-semibold">Nenhuma memória encontrada</h2>
                    <p className="text-gray-500 mt-2">Adicione sua primeira memória nesta sala</p>
                  </div>
                  <Button 
                    className="highlight-btn"
                    onClick={() => navigate(`/rooms/${room.id}/memories/new`)}
                  >
                    <Plus size={16} className="mr-2" />
                    Adicionar Memória
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {roomMemories
                    .filter(m => tab === 'all' || m.mediaType === tab)
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((memory) => (
                      <div key={memory.id} className="memory-item relative group">
                        <div 
                          className="h-40 bg-secondary-light relative cursor-pointer"
                          onClick={() => navigate(`/rooms/${room.id}/memories/${memory.id}`)}
                        >
                          {memory.mediaType === "image" && memory.mediaUrl && (
                            <img 
                              src={memory.mediaUrl} 
                              alt={memory.title} 
                              className="w-full h-full object-cover" 
                            />
                          )}
                          
                          {memory.mediaType === "video" && (
                            <div className="flex flex-col items-center justify-center h-full bg-primary/10">
                              <Video size={32} className="text-primary-dark mb-2" />
                              <span className="text-sm">Vídeo</span>
                            </div>
                          )}
                          
                          {memory.mediaType === "audio" && (
                            <div className="flex flex-col items-center justify-center h-full bg-highlight/10">
                              <AudioLines size={32} className="text-highlight mb-2" />
                              <span className="text-sm">Áudio</span>
                            </div>
                          )}
                          
                          {memory.mediaType === "text" && (
                            <div className="flex items-center justify-center h-full bg-secondary-light p-4 text-center">
                              {memory.content ? (
                                <p className="text-sm line-clamp-5">{memory.content}</p>
                              ) : (
                                <span className="text-sm text-gray-400">Texto</span>
                              )}
                            </div>
                          )}
                          
                          {/* Action buttons */}
                          <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-7 w-7 bg-white/80 hover:bg-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/rooms/${room.id}/memories/${memory.id}/edit`);
                              }}
                            >
                              <Edit size={14} />
                            </Button>
                            <Button
                              size="icon"
                              variant="destructive"
                              className="h-7 w-7 bg-white/80 hover:bg-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                setMemoryToDelete(memory.id);
                              }}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                          
                          {/* Media type indicator */}
                          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center">
                            {memory.mediaType === "image" && <ImageIcon size={12} className="mr-1" />}
                            {memory.mediaType === "video" && <Video size={12} className="mr-1" />}
                            {memory.mediaType === "audio" && <AudioLines size={12} className="mr-1" />}
                            {memory.mediaType === "text" && <span className="mr-1">T</span>}
                            {memory.mediaType.charAt(0).toUpperCase() + memory.mediaType.slice(1)}
                          </div>
                        </div>
                        <div className="p-3 cursor-pointer" onClick={() => navigate(`/rooms/${room.id}/memories/${memory.id}`)}>
                          <h3 className="font-semibold line-clamp-1">{memory.title}</h3>
                          {memory.description && (
                            <p className="text-gray-500 text-xs line-clamp-2 mt-1">{memory.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      {/* Delete memory confirmation */}
      <AlertDialog open={!!memoryToDelete} onOpenChange={(open) => !open && setMemoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir memória?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente esta memória
              do seu museu pessoal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMemory}
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
