
import React from "react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-background py-6 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
            <Link 
              to="/termos" 
              className="text-muted-foreground hover:text-primary-dark transition-colors"
            >
              Termos de Uso
            </Link>
            <Separator orientation="vertical" className="h-4 my-auto" />
            <Link 
              to="/privacidade" 
              className="text-muted-foreground hover:text-primary-dark transition-colors"
            >
              Política de Privacidade
            </Link>
            <Separator orientation="vertical" className="h-4 my-auto" />
            <Link 
              to="/sobre" 
              className="text-muted-foreground hover:text-primary-dark transition-colors"
            >
              Sobre o App
            </Link>
          </div>
          
          <p className="text-muted-foreground text-sm text-center mt-4 italic">
            "Cada memória tem um lugar. Obrigado por confiar no Meu Museu para guardar as suas."
          </p>
          
          <div className="text-xs text-muted-foreground mt-2">
            © {new Date().getFullYear()} Meu Museu
          </div>
        </div>
      </div>
    </footer>
  );
}
