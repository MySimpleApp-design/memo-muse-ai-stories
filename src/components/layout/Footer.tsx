
import React from "react";

export function Footer() {
  return (
    <footer className="bg-background py-6 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-4">
          <h2 className="text-lg font-medium">Meu Museu</h2>
          
          <p className="text-muted-foreground text-sm text-center mt-2 italic">
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
