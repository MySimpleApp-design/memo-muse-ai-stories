
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { 
  LogOut, 
  Book, 
  User, 
  Plus, 
  Folder 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function AppSidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <Sidebar>
      <SidebarHeader className="py-6">
        <h1 className="text-xl font-bold text-center">Meu Museu</h1>
      </SidebarHeader>
      <SidebarContent>
        <div className="space-y-1 px-3">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`
            }
          >
            <Book size={18} />
            <span>Meu Museu</span>
          </NavLink>
          
          <NavLink 
            to="/rooms" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`
            }
          >
            <Folder size={18} />
            <span>Minhas Salas</span>
          </NavLink>
          
          <NavLink 
            to="/profile" 
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`
            }
          >
            <User size={18} />
            <span>Perfil</span>
          </NavLink>
        </div>
        
        <div className="mt-6 px-3">
          <Button
            variant="outline"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50 border border-sidebar-border"
            onClick={() => navigate("/rooms/new")}
          >
            <Plus size={18} className="mr-2" />
            Nova Sala
          </Button>
        </div>
      </SidebarContent>
      <SidebarFooter>
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50"
          onClick={handleLogout}
        >
          <LogOut size={18} className="mr-2" />
          Sair
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
