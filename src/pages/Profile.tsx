
import { useState, useRef, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save, User, Upload, X } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useMuseum } from "@/context/MuseumContext";
import { usePlan } from "@/context/PlanContext";
import { Link } from "react-router-dom";

export default function Profile() {
  const { user } = useAuth();
  const { rooms, memories } = useMuseum();
  const { currentPlan, isPremium } = usePlan();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Load avatar from localStorage on initialization
  useEffect(() => {
    if (user) {
      const storedAvatar = localStorage.getItem(`museum_avatar_${user.id}`);
      if (storedAvatar) {
        setAvatar(storedAvatar);
      }
    }
  }, [user]);
  
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Simple validation
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, envie apenas imagens");
      return;
    }
    
    // Convert to base64 for storage
    const reader = new FileReader();
    reader.onload = () => {
      if (user && reader.result) {
        const base64String = reader.result.toString();
        setAvatar(base64String);
        localStorage.setItem(`museum_avatar_${user.id}`, base64String);
        toast.success("Foto de perfil atualizada com sucesso");
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleRemoveAvatar = () => {
    if (user) {
      setAvatar(null);
      localStorage.removeItem(`museum_avatar_${user.id}`);
      toast.success("Foto de perfil removida com sucesso");
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would update the user profile via API
      // For now, just show a success message
      toast.success("Perfil atualizado com sucesso");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Erro ao atualizar perfil");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtro para pegar apenas as salas e memórias do usuário atual
  const userRooms = rooms.filter(room => room.userId === user?.id);
  const userMemories = memories.filter(memory => memory.userId === user?.id);

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Meu Perfil</h1>
        
        <div className="museum-card p-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <div className="relative">
                {avatar ? (
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={avatar} alt={user?.name || ""} />
                    <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="h-32 w-32 rounded-full bg-primary-light flex items-center justify-center text-primary-dark text-4xl font-medium">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                )}
                
                <div className="absolute bottom-0 right-0 flex gap-2">
                  <Button 
                    type="button" 
                    size="icon" 
                    variant="secondary" 
                    className="rounded-full h-8 w-8"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={14} />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                  </Button>
                  
                  {avatar && (
                    <Button 
                      type="button" 
                      size="icon" 
                      variant="destructive" 
                      className="rounded-full h-8 w-8"
                      onClick={handleRemoveAvatar}
                    >
                      <X size={14} />
                    </Button>
                  )}
                </div>
              </div>
              
              <p className="mt-4 text-lg font-semibold">{user?.name}</p>
              <p className="text-gray-500">{user?.email}</p>
              
              <div className="mt-4 w-full">
                <div className="bg-muted/20 p-4 rounded-md">
                  <p className="font-semibold">Plano atual:</p>
                  <p className={`text-lg font-bold ${isPremium ? 'text-highlight' : 'text-primary'}`}>
                    {isPremium ? 'Premium' : 'Básico'}
                  </p>
                  
                  {!isPremium && (
                    <Link to="/plans">
                      <Button className="w-full mt-2 bg-highlight hover:bg-highlight/80">
                        Fazer Upgrade
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-2/3">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="highlight-btn mt-4" 
                  disabled={isSubmitting}
                >
                  <Save size={16} className="mr-2" />
                  {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="museum-card p-6">
          <h2 className="text-xl font-semibold mb-4">Estatísticas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-primary/10 rounded-lg p-4">
              <p className="text-sm text-gray-500">Salas</p>
              <p className="text-2xl font-semibold">{userRooms.length}</p>
            </div>
            <div className="bg-highlight/10 rounded-lg p-4">
              <p className="text-sm text-gray-500">Memórias</p>
              <p className="text-2xl font-semibold">{userMemories.length}</p>
            </div>
            <div className="bg-primary/10 rounded-lg p-4">
              <p className="text-sm text-gray-500">Plano</p>
              <p className="text-lg font-semibold">{currentPlan === 'premium' ? 'Premium' : 'Básico'}</p>
            </div>
            <div className="bg-highlight/10 rounded-lg p-4">
              <p className="text-sm text-gray-500">Data de criação</p>
              <p className="text-lg font-semibold">10/05/2025</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
