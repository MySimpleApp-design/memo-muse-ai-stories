
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Folder, 
  ImageIcon,
  Video, 
  AudioLines,
  BookUser
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SharedUser {
  id: string;
  name: string;
  email: string;
}

interface SharedRoom {
  id: string;
  userId: string;
  name: string;
  description: string;
  coverImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface SharedMemory {
  id: string;
  roomId: string;
  userId: string;
  title: string;
  description: string;
  mediaType: "text" | "image" | "video" | "audio";
  mediaUrl?: string;
  content?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ShareView() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  
  const [sharedUser, setSharedUser] = useState<SharedUser | null>(null);
  const [rooms, setRooms] = useState<SharedRoom[]>([]);
  const [memories, setMemories] = useState<SharedMemory[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulating loading data from shared user
    const loadSharedData = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be an API call to get the shared user's data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Load from localStorage
        const storedUsers = localStorage.getItem("museum_user");
        const storedRooms = localStorage.getItem("museum_rooms");
        const storedMemories = localStorage.getItem("museum_memories");
        
        if (!storedUsers || !storedRooms || !storedMemories) {
          throw new Error("Shared data not found");
        }
        
        // Find the user
        const allUsers = JSON.parse(storedUsers);
        const user = typeof allUsers === 'object' && !Array.isArray(allUsers) 
          ? allUsers.id === userId ? allUsers : null 
          : null;
        
        if (!user) {
          throw new Error("Shared user not found");
        }
        
        setSharedUser(user);
        
        // Get rooms
        const allRooms = JSON.parse(storedRooms);
        const userRooms = Array.isArray(allRooms) 
          ? allRooms.filter((r: SharedRoom) => r.userId === userId)
          : [];
        
        setRooms(userRooms);
        
        // Get memories
        const allMemories = JSON.parse(storedMemories);
        const userMemories = Array.isArray(allMemories)
          ? allMemories.filter((m: SharedMemory) => m.userId === userId)
          : [];
        
        setMemories(userMemories);
        
        // Select first room if available
        if (userRooms.length > 0) {
          setSelectedRoom(userRooms[0].id);
        }
      } catch (error) {
        console.error("Error loading shared data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSharedData();
  }, [userId]);

  const filteredMemories = selectedRoom 
    ? memories.filter(m => m.roomId === selectedRoom)
    : memories;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="mr-4"
                onClick={() => navigate("/")}
              >
                <ArrowLeft size={16} className="mr-2" />
                Voltar
              </Button>
              <Skeleton className="h-8 w-40" />
            </div>
          </div>
          
          <div className="museum-card p-6">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div>
                <Skeleton className="h-6 w-32 mb-1" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <div className="museum-card">
                <div className="p-4 border-b">
                  <Skeleton className="h-6 w-24" />
                </div>
                <div className="p-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-10 w-full my-1" />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="md:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="memory-item">
                    <Skeleton className="h-40 w-full" />
                    <div className="p-3">
                      <Skeleton className="h-5 w-3/4 mb-1" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!sharedUser || rooms.length === 0) {
    return (
      <div className="min-h-screen bg-secondary p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="mr-4"
                onClick={() => navigate("/")}
              >
                <ArrowLeft size={16} className="mr-2" />
                Voltar
              </Button>
              <h1 className="text-3xl font-bold">Museu Compartilhado</h1>
            </div>
          </div>
          
          <div className="museum-card p-10 text-center">
            <div className="flex flex-col items-center justify-center mb-6">
              <BookUser size={64} className="text-primary mb-4" />
              <h2 className="text-xl font-semibold">Museu não encontrado</h2>
              <p className="text-gray-500 mt-2">
                O museu que você está procurando não existe ou não está disponível para compartilhamento
              </p>
            </div>
            <Button 
              className="highlight-btn"
              onClick={() => navigate("/")}
            >
              Voltar para a página inicial
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/">
              <Button 
                variant="ghost" 
                size="sm" 
                className="mr-4"
              >
                <ArrowLeft size={16} className="mr-2" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Museu Compartilhado</h1>
          </div>
        </div>
        
        <div className="museum-card p-6">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-lg font-semibold">
              {sharedUser.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{sharedUser.name}</h2>
              <p className="text-gray-500">Museu pessoal compartilhado</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <div className="museum-card sticky top-6">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Salas</h3>
              </div>
              <div>
                <button
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center ${
                    !selectedRoom ? "bg-primary/10 text-primary-dark font-medium" : ""
                  }`}
                  onClick={() => setSelectedRoom(null)}
                >
                  <BookUser size={16} className="mr-2" />
                  Todas as memórias
                </button>
                
                {rooms.map((room) => (
                  <button
                    key={room.id}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center ${
                      selectedRoom === room.id ? "bg-primary/10 text-primary-dark font-medium" : ""
                    }`}
                    onClick={() => setSelectedRoom(room.id)}
                  >
                    <Folder size={16} className="mr-2" />
                    {room.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="md:col-span-3">
            {selectedRoom && (
              <div className="mb-6">
                <div className="museum-card p-5">
                  <h2 className="text-xl font-semibold mb-2">
                    {rooms.find(r => r.id === selectedRoom)?.name}
                  </h2>
                  <p className="text-gray-600">
                    {rooms.find(r => r.id === selectedRoom)?.description}
                  </p>
                </div>
              </div>
            )}
            
            <Tabs defaultValue="all" className="w-full mb-6">
              <TabsList>
                <TabsTrigger value="all">Todas ({filteredMemories.length})</TabsTrigger>
                <TabsTrigger value="image">Imagens ({filteredMemories.filter(m => m.mediaType === "image").length})</TabsTrigger>
                <TabsTrigger value="video">Vídeos ({filteredMemories.filter(m => m.mediaType === "video").length})</TabsTrigger>
                <TabsTrigger value="audio">Áudios ({filteredMemories.filter(m => m.mediaType === "audio").length})</TabsTrigger>
                <TabsTrigger value="text">Textos ({filteredMemories.filter(m => m.mediaType === "text").length})</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {filteredMemories.length === 0 ? (
              <div className="museum-card p-8 text-center">
                <div className="flex flex-col items-center justify-center mb-2">
                  <BookUser size={48} className="text-primary mb-4" />
                  <h2 className="text-lg font-semibold">Nenhuma memória encontrada</h2>
                  <p className="text-gray-500 mt-2">Não há memórias para exibir nesta sala</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMemories
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((memory) => (
                    <div key={memory.id} className="memory-item">
                      <div className="h-40 bg-secondary-light relative">
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
                        
                        {/* Room label if showing all memories */}
                        {!selectedRoom && (
                          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            {rooms.find(r => r.id === memory.roomId)?.name}
                          </div>
                        )}
                        
                        {/* Media type indicator */}
                        <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center">
                          {memory.mediaType === "image" && <ImageIcon size={12} className="mr-1" />}
                          {memory.mediaType === "video" && <Video size={12} className="mr-1" />}
                          {memory.mediaType === "audio" && <AudioLines size={12} className="mr-1" />}
                          {memory.mediaType === "text" && <span className="mr-1">T</span>}
                          {memory.mediaType.charAt(0).toUpperCase() + memory.mediaType.slice(1)}
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold line-clamp-1">{memory.title}</h3>
                        {memory.description && (
                          <p className="text-gray-500 text-xs line-clamp-2 mt-1">{memory.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
