
import { MainLayout } from "@/components/layout/MainLayout";
import { useMuseum } from "@/context/MuseumContext";
import { Button } from "@/components/ui/button";
import { Folder, Plus, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
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

export default function Rooms() {
  const { rooms, isLoading, deleteRoom } = useMuseum();
  const navigate = useNavigate();
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Sort rooms by updated date (newest first)
  const sortedRooms = [...rooms].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const handleDeleteRoom = async () => {
    if (!roomToDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteRoom(roomToDelete);
      setRoomToDelete(null);
    } catch (error) {
      console.error("Error deleting room:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Minhas Salas</h1>
          <Button 
            className="highlight-btn"
            onClick={() => navigate("/rooms/new")}
          >
            <Plus size={18} className="mr-2" />
            Nova Sala
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="museum-card">
                <Skeleton className="h-48 w-full" />
                <div className="p-5">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <div className="museum-card p-10 text-center">
            <div className="flex flex-col items-center justify-center mb-6">
              <Folder size={64} className="text-primary mb-4" />
              <h2 className="text-xl font-semibold">Nenhuma sala encontrada</h2>
              <p className="text-gray-500 mt-2">Crie sua primeira sala para começar a organizar suas memórias</p>
            </div>
            <Button 
              className="highlight-btn"
              onClick={() => navigate("/rooms/new")}
            >
              <Plus size={18} className="mr-2" />
              Criar Primeira Sala
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedRooms.map((room) => (
              <div key={room.id} className="museum-card relative group">
                <div 
                  className="h-48 bg-primary-light cursor-pointer"
                  onClick={() => navigate(`/rooms/${room.id}`)}
                >
                  {room.coverImageUrl ? (
                    <img 
                      src={room.coverImageUrl} 
                      alt={room.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Folder size={64} className="text-primary" />
                    </div>
                  )}
                  
                  {/* Action buttons */}
                  <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 bg-white/80 hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/rooms/${room.id}/edit`);
                      }}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8 bg-white/80 hover:bg-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRoomToDelete(room.id);
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                <div className="p-5 cursor-pointer" onClick={() => navigate(`/rooms/${room.id}`)}>
                  <h3 className="font-semibold text-lg">{room.name}</h3>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">{room.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-gray-400">
                      {new Date(room.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-highlight hover:text-highlight-dark"
                    >
                      Visualizar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Delete room confirmation */}
      <AlertDialog open={!!roomToDelete} onOpenChange={(open) => !open && setRoomToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a sala
              e todas as memórias dentro dela.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRoom}
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
