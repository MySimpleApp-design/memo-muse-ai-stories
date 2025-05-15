
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Share2, CreditCard } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { usePlan } from "@/context/PlanContext";

export function Header() {
  const { user } = useAuth();
  const { isPremium } = usePlan();
  const location = useLocation();
  const [isShareOpen, setIsShareOpen] = useState(false);
  
  // Generate a shareable link based on the current user ID
  const shareableLink = `${window.location.origin}/share/${user?.id}`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink);
    toast.success("Link copiado para a área de transferência");
    setIsShareOpen(false);
  };
  
  const showShareButton = location.pathname === "/dashboard" || location.pathname === "/rooms";
  
  // Get user avatar from localStorage
  const userAvatar = user ? localStorage.getItem(`museum_avatar_${user.id}`) : null;
  
  return (
    <header className="border-b border-border bg-background px-4 py-3 flex items-center justify-between">
      <SidebarTrigger />
      
      <div className="flex items-center gap-2">
        {!isPremium && location.pathname !== "/plans" && (
          <Link to="/plans">
            <Button variant="outline" size="sm" className="mr-2">
              <CreditCard size={16} className="mr-2" />
              Plano Premium
            </Button>
          </Link>
        )}
        
        {showShareButton && (
          <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="mr-4">
                <Share2 size={16} className="mr-2" />
                Compartilhar Museu
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Compartilhar seu Museu</DialogTitle>
                <DialogDescription>
                  Compartilhe esse link para que outras pessoas possam visualizar seu museu pessoal.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2 mt-4">
                <Input readOnly value={shareableLink} />
                <Button onClick={copyToClipboard} className="highlight-btn">Copiar</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
        
        <div className="flex items-center">
          {userAvatar ? (
            <Avatar className="h-8 w-8">
              <AvatarImage src={userAvatar} alt={user?.name || ""} />
              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
              {user?.name?.charAt(0) || "U"}
            </div>
          )}
          <span className="ml-2 hidden sm:inline-block">{user?.name || "Usuário"}</span>
        </div>
      </div>
    </header>
  );
}
