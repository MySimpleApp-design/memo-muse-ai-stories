
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-4 px-6 bg-white border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary">Meu Museu</h1>
          </div>
          <div>
            <Button 
              variant="outline" 
              className="mr-2"
              onClick={() => navigate("/login")}
            >
              Entrar
            </Button>
            <Button 
              className="highlight-btn"
              onClick={() => navigate("/register")}
            >
              Criar conta
            </Button>
          </div>
        </div>
      </header>
      
      <main>
        {/* Hero Section */}
        <section className="py-20 px-6 bg-gradient-to-b from-primary/10 to-white">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Seu espaço pessoal para guardar memórias
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Organize suas memórias em salas temáticas, faça upload de fotos, vídeos e áudios,
              e crie uma narrativa rica com títulos gerados por IA.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="highlight-btn py-6 px-8 text-lg"
                onClick={() => navigate("/register")}
              >
                Comece agora
              </Button>
              <Button 
                variant="outline" 
                className="py-6 px-8 text-lg"
                onClick={() => navigate("/login")}
              >
                Já tenho uma conta
              </Button>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Como funciona</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-secondary p-6 rounded-lg text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Crie Salas Temáticas</h3>
                <p className="text-gray-600">
                  Organize suas memórias em salas personalizadas como "Infância", "Viagens" ou "Família".
                </p>
              </div>
              
              <div className="bg-secondary p-6 rounded-lg text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Adicione Suas Memórias</h3>
                <p className="text-gray-600">
                  Faça upload de fotos, vídeos, áudios ou textos que representam momentos especiais.
                </p>
              </div>
              
              <div className="bg-secondary p-6 rounded-lg text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Gere Títulos com IA</h3>
                <p className="text-gray-600">
                  Nossa inteligência artificial cria títulos criativos para suas memórias baseados em sua descrição.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 px-6 bg-primary/10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Comece a Preservar Suas Memórias Hoje</h2>
            <p className="text-xl text-gray-600 mb-8">
              Não deixe suas memórias se perderem. Crie seu museu pessoal agora mesmo!
            </p>
            <Button 
              className="highlight-btn py-6 px-8 text-lg"
              onClick={() => navigate("/register")}
            >
              Criar meu museu gratuitamente
            </Button>
          </div>
        </section>
      </main>
      
      <footer className="py-8 px-6 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-primary">Meu Museu</h1>
              <p className="text-gray-500 mt-1">Suas memórias, seu espaço, sua história.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-gray-500">© 2025 Meu Museu. Todos os direitos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
