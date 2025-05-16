
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useMuseum } from "@/context/MuseumContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Plus, TrashIcon, BookOpenText, CreditCard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePlan } from "@/context/PlanContext";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

export default function RoomDetail() {
  const { roomId } = useParams<{ roomId: string }>();
  const { rooms, memories, deleteRoom, isLoading, getRoomMemoryCount } = useMuseum();
  const { user } = useAuth();
  const { isPremium, getUsageDetails } = usePlan();
  const navigate = useNavigate();
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  if (!roomId) {
    return <div>ID da sala não encontrado</div>;
  }
  
  const room = rooms.find(r => r.id === roomId);
  const roomMemories = memories.filter(m => m.roomId === roomId);
  
  // Get usage details for this room
  const usage = getUsageDetails(roomId);
  const isLimitReached = !isPremium && usage.current >= usage.max;
  
  const handleDeleteRoom = async () => {
    try {
      await deleteRoom(roomId);
      navigate("/rooms");
      toast.success("Sala excluída com sucesso");
    } catch (error) {
      console.error("Error deleting room:", error);
      toast.error("Erro ao excluir sala");
    }
  };
  
  const handleAddMemory = () => {
    if (isLimitReached) {
      toast.error("Limite de memórias atingido no plano gratuito. Torne-se Premium para liberar uso ilimitado.");
      return;
    }
    navigate(`/rooms/${roomId}/memory/new`);
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
            <p className="text-muted-foreground mb-4">A sala que você está procurando não existe ou foi removida</p>
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
        <div className="flex items-center justify-between mb-6">
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
          
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsDeleteDialogOpen(true)}
              variant="outline"
              size="sm"
            >
              <TrashIcon size={16} className="mr-2" />
              Excluir Sala
            </Button>
            
            <Button 
              onClick={handleAddMemory}
              className="highlight-btn"
              disabled={isLimitReached && !isPremium}
            >
              <Plus size={16} className="mr-2" />
              Nova Memória
            </Button>
          </div>
        </div>
        
        {room.description && (
          <p className="text-muted-foreground">{room.description}</p>
        )}
        
        {/* Usage indicator for basic plan */}
        {!isPremium && (
          <div className="museum-card p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">
                Uso da sala: {usage.current}/{usage.max} memórias
              </span>
              <Link to="/plans">
                <Button size="sm" className="bg-highlight hover:bg-highlight/80">
                  <CreditCard size={16} className="mr-1" /> 
                  Torne-se Premium
                </Button>
              </Link>
            </div>
            <Progress value={usage.percentage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              O plano gratuito permite até {usage.max} memórias por sala. 
              <Link to="/plans" className="text-highlight hover:text-highlight/80 ml-1">
                Faça upgrade para Premium
              </Link>
            </p>
          </div>
        )}
        
        {roomMemories.length === 0 ? (
          <div className="museum-card p-10 text-center">
            <BookOpenText size={48} className="text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Nenhuma memória ainda</h2>
            <p className="text-muted-foreground mb-6">
              Comece a adicionar suas memórias nesta sala para construir seu acervo pessoal.
            </p>
            
            <Button 
              onClick={handleAddMemory} 
              className="highlight-btn"
              disabled={isLimitReached && !isPremium}
            >
              <Plus size={16} className="mr-2" />
              Adicionar Primeira Memória
            </Button>
            
            {isLimitReached && !isPremium && (
              <div className="mt-4 p-4 border border-highlight/30 rounded-md bg-highlight/5">
                <p className="text-sm font-medium text-highlight">
                  Limite de memórias atingido no plano gratuito. Torne-se Premium para liberar uso ilimitado.
                </p>
                <Link to="/plans" className="mt-2 inline-block">
                  <Button size="sm" variant="outline" className="border-highlight text-highlight">
                    <CreditCard size={16} className="mr-2" />
                    Upgrade para Premium
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {roomMemories.map((memory) => (
              <div 
                key={memory.id} 
                className="museum-card p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/rooms/${roomId}/memories/${memory.id}`)}
              >
                <div className="aspect-video mb-3">
                  {memory.mediaType === "image" && memory.mediaUrl && (
                    <img 
                      src={memory.mediaUrl} 
                      alt={memory.title} 
                      className="w-full h-full object-cover rounded-md"
                    />
                  )}
                  {memory.mediaType === "video" && memory.mediaUrl && (
                    <video 
                      src={memory.mediaUrl}
                      className="w-full h-full object-cover rounded-md" 
                      controls={false}
                    />
                  )}
                  {memory.mediaType === "audio" && (
                    <div className="w-full h-full flex items-center justify-center bg-muted rounded-md">
                      <div className="text-4xl">🎵</div>
                    </div>
                  )}
                  {memory.mediaType === "text" && (
                    <div className="w-full h-full flex items-center justify-center bg-muted/30 rounded-md overflow-hidden">
                      <div className="p-4 text-sm line-clamp-6 overflow-hidden">
                        {memory.content}
                      </div>
                    </div>
                  )}
                </div>
                
                <h3 className="font-medium truncate">{memory.title}</h3>
                {memory.description && (
                  <p className="text-sm text-muted-foreground truncate">
                    {memory.description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(memory.createdAt).toLocaleDateString('pt-BR', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            ))}
            
            {/* Add memory card */}
            {(!isLimitReached || isPremium) && (
              <div 
                className="museum-card p-4 cursor-pointer hover:shadow-md transition-shadow border-2 border-dashed border-muted flex flex-col items-center justify-center"
                onClick={handleAddMemory}
              >
                <div className="aspect-video flex items-center justify-center mb-3">
                  <Plus size={32} className="text-muted-foreground" />
                </div>
                <h3 className="font-medium">Adicionar nova memória</h3>
              </div>
            )}
          </div>
        )}
        
        {/* Delete Room Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Excluir Sala</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir esta sala? Esta ação não pode ser desfeita e todas as memórias nesta sala serão permanentemente excluídas.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteRoom} disabled={isLoading}>
                {isLoading ? "Excluindo..." : "Excluir Permanentemente"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
