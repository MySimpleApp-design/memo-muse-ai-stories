
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save, User } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Meu Perfil</h1>
        
        <div className="museum-card p-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <div className="h-32 w-32 rounded-full bg-primary-light flex items-center justify-center text-primary-dark text-4xl font-medium">
                {user?.name?.charAt(0) || "U"}
              </div>
              <p className="mt-4 text-lg font-semibold">{user?.name}</p>
              <p className="text-gray-500">{user?.email}</p>
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
              <p className="text-2xl font-semibold">4</p>
            </div>
            <div className="bg-highlight/10 rounded-lg p-4">
              <p className="text-sm text-gray-500">Memórias</p>
              <p className="text-2xl font-semibold">16</p>
            </div>
            <div className="bg-primary/10 rounded-lg p-4">
              <p className="text-sm text-gray-500">Imagens</p>
              <p className="text-2xl font-semibold">8</p>
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
