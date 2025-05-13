
import { MainLayout } from "@/components/layout/MainLayout";
import { useMuseum } from "@/context/MuseumContext";
import { Button } from "@/components/ui/button";
import { Folder, ImageIcon, Video, AudioLines, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { rooms, memories, isLoading } = useMuseum();
  const navigate = useNavigate();
  
  // Statistics
  const totalRooms = rooms.length;
  const totalMemories = memories.length;
  const imageMemories = memories.filter(m => m.mediaType === "image").length;
  const videoMemories = memories.filter(m => m.mediaType === "video").length;
  const audioMemories = memories.filter(m => m.mediaType === "audio").length;
  const textMemories = memories.filter(m => m.mediaType === "text").length;

  // Recent rooms
  const recentRooms = [...rooms]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  // Recent memories
  const recentMemories = [...memories]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Meu Museu</h1>
          <Button 
            className="highlight-btn"
            onClick={() => navigate("/rooms/new")}
          >
            <Plus size={18} className="mr-2" />
            Nova Sala
          </Button>
        </div>
        
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="museum-card p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Salas</p>
              <h3 className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-16" /> : totalRooms}</h3>
            </div>
            <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
              <Folder size={20} className="text-primary-dark" />
            </div>
          </div>
          
          <div className="museum-card p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Memórias</p>
              <h3 className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-16" /> : totalMemories}</h3>
            </div>
            <div className="h-12 w-12 bg-highlight/20 rounded-full flex items-center justify-center">
              <ImageIcon size={20} className="text-highlight" />
            </div>
          </div>
          
          <div className="museum-card p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Vídeos</p>
              <h3 className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-16" /> : videoMemories}</h3>
            </div>
            <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
              <Video size={20} className="text-primary-dark" />
            </div>
          </div>
          
          <div className="museum-card p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Áudios</p>
              <h3 className="text-2xl font-bold">{isLoading ? <Skeleton className="h-8 w-16" /> : audioMemories}</h3>
            </div>
            <div className="h-12 w-12 bg-highlight/20 rounded-full flex items-center justify-center">
              <AudioLines size={20} className="text-highlight" />
            </div>
          </div>
        </div>
        
        {/* Recent Rooms */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Salas Recentes</h2>
            <Button 
              variant="ghost" 
              className="text-highlight hover:text-highlight-dark"
              onClick={() => navigate("/rooms")}
            >
              Ver todas
            </Button>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="museum-card">
                  <Skeleton className="h-40 w-full" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : totalRooms === 0 ? (
            <div className="museum-card p-8 text-center">
              <p className="text-gray-500 mb-4">Você ainda não criou nenhuma sala</p>
              <Button 
                className="highlight-btn"
                onClick={() => navigate("/rooms/new")}
              >
                <Plus size={18} className="mr-2" />
                Criar Primeira Sala
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentRooms.map((room) => (
                <div 
                  key={room.id} 
                  className="museum-card cursor-pointer"
                  onClick={() => navigate(`/rooms/${room.id}`)}
                >
                  <div className="h-40 bg-primary-light flex items-center justify-center">
                    {room.coverImageUrl ? (
                      <img 
                        src={room.coverImageUrl} 
                        alt={room.name} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <Folder size={48} className="text-primary" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{room.name}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2">{room.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Recent Memories */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Memórias Recentes</h2>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="memory-item">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-3">
                    <Skeleton className="h-5 w-3/4 mb-1" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : totalMemories === 0 ? (
            <div className="museum-card p-8 text-center">
              <p className="text-gray-500 mb-4">Você ainda não criou nenhuma memória</p>
              {totalRooms > 0 && (
                <Button 
                  className="highlight-btn"
                  onClick={() => navigate(`/rooms/${rooms[0].id}/memories/new`)}
                >
                  <Plus size={18} className="mr-2" />
                  Criar Primeira Memória
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentMemories.map((memory) => {
                const room = rooms.find(r => r.id === memory.roomId);
                
                return (
                  <div 
                    key={memory.id} 
                    className="memory-item cursor-pointer"
                    onClick={() => navigate(`/rooms/${memory.roomId}/memories/${memory.id}`)}
                  >
                    <div className="h-48 bg-secondary-light flex items-center justify-center relative">
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
                        <div className="flex flex-col items-center justify-center h-full bg-secondary-light p-4 text-center">
                          {memory.content ? (
                            <p className="text-sm line-clamp-6">{memory.content}</p>
                          ) : (
                            <span className="text-sm text-gray-400">Texto</span>
                          )}
                        </div>
                      )}
                      
                      {room && (
                        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                          {room.name}
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold line-clamp-1">{memory.title}</h3>
                      <p className="text-gray-500 text-xs line-clamp-1">{memory.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
