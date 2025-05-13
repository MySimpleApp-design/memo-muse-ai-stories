
import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  authType: "login" | "register";
}

export function AuthLayout({ children, title, subtitle, authType }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 bg-primary p-8 flex flex-col justify-center items-center">
        <div className="max-w-md w-full space-y-8 animate-fade-in">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary-foreground mb-2">Meu Museu</h1>
            <p className="text-lg text-primary-foreground/80">Suas memórias, seu espaço, sua história.</p>
          </div>
          <div className="hidden md:block bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-lg">
            <p className="text-primary-foreground/90 text-lg italic">
              "Lembranças são como obras de arte em nosso museu pessoal, contando histórias que o tempo não pode apagar."
            </p>
          </div>
        </div>
      </div>
      
      <div className="w-full md:w-1/2 bg-secondary p-8 flex flex-col justify-center items-center">
        <div className="max-w-md w-full space-y-8 animate-slide-up">
          <div>
            <h2 className="text-3xl font-bold text-center mb-2">{title}</h2>
            <p className="text-center text-gray-600 mb-8">{subtitle}</p>
          </div>
          
          {children}
          
          <div className="text-center mt-4">
            {authType === "login" ? (
              <p>
                Não tem uma conta?{" "}
                <Link to="/register" className="text-highlight font-semibold hover:underline">
                  Registre-se
                </Link>
              </p>
            ) : (
              <p>
                Já possui uma conta?{" "}
                <Link to="/login" className="text-highlight font-semibold hover:underline">
                  Faça login
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
