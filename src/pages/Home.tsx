
import { Button } from "@/components/ui/button";
import { BookOpenText } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-12 text-center">
          <div className="animate-fade-in">
            <BookOpenText size={76} className="text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-2">Meu Museu</h1>
          </div>
          
          <div className="max-w-2xl animate-fade-in [animation-delay:200ms]">
            <p className="text-xl md:text-2xl text-muted-foreground italic">
              "Bem-vindo ao Meu Museu – Partilhe suas experiências e emoções por trás 
              das memórias que marcaram a sua jornada."
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8 animate-fade-in [animation-delay:400ms]">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="text-lg px-8">
                  Entrar no Museu
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button size="lg" className="text-lg px-8">
                    Entrar
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    Criar Conta
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8 animate-fade-in [animation-delay:600ms]">
            <div className="bg-card p-6 rounded-lg shadow-md border border-border">
              <h2 className="text-xl font-semibold mb-3">Crie Salas</h2>
              <p className="text-muted-foreground">
                Organize suas memórias em salas temáticas personalizadas.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-md border border-border">
              <h2 className="text-xl font-semibold mb-3">Guarde Memórias</h2>
              <p className="text-muted-foreground">
                Salve suas lembranças mais importantes com fotos e descrições.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-md border border-border">
              <h2 className="text-xl font-semibold mb-3">Compartilhe</h2>
              <p className="text-muted-foreground">
                Compartilhe seu museu pessoal com amigos e familiares.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
