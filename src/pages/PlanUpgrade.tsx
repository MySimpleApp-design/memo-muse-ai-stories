
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { usePlan } from "@/context/PlanContext";
import { useNavigate } from "react-router-dom";
import { Check, CreditCard } from "lucide-react";
import { toast } from "sonner";

export default function PlanUpgrade() {
  const { currentPlan, planLimits, upgradeToPremium, isPremium } = usePlan();
  const navigate = useNavigate();
  
  const handleUpgrade = () => {
    // Redirect to PayPal payment link
    window.open("https://www.paypal.com/ncp/payment/BBVKEKFJCKWNJ", "_blank");
    
    // For demo purposes, simulate a successful payment
    setTimeout(() => {
      upgradeToPremium();
      toast.success("Parabéns! Seu plano foi atualizado para Premium!");
      navigate("/dashboard");
    }, 1000);
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Planos de Utilização</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Plan */}
          <div className={`museum-card p-6 ${currentPlan === "basic" ? "border-2 border-primary" : ""}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Plano Básico</h2>
              <span className="text-xl font-bold text-primary">Grátis</span>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <Check size={20} className="text-primary mr-2" />
                <span>Crie até {planLimits.maxRooms} sala</span>
              </div>
              <div className="flex items-center">
                <Check size={20} className="text-primary mr-2" />
                <span>Publique até {planLimits.maxMemoriesPerRoom} memórias por sala</span>
              </div>
              <div className="flex items-center">
                <Check size={20} className="text-primary mr-2" />
                <span>Funções básicas do aplicativo</span>
              </div>
            </div>
            
            <Button 
              disabled={true}
              className="w-full"
            >
              Plano Atual
            </Button>
          </div>
          
          {/* Premium Plan */}
          <div className={`museum-card p-6 ${currentPlan === "premium" ? "border-2 border-highlight" : ""}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Plano Premium</h2>
              <span className="text-xl font-bold text-highlight">2,50 USD/mês</span>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <Check size={20} className="text-highlight mr-2" />
                <span>Salas ilimitadas</span>
              </div>
              <div className="flex items-center">
                <Check size={20} className="text-highlight mr-2" />
                <span>Memórias ilimitadas</span>
              </div>
              <div className="flex items-center">
                <Check size={20} className="text-highlight mr-2" />
                <span>Todas as funcionalidades multimídia</span>
              </div>
              <div className="flex items-center">
                <Check size={20} className="text-highlight mr-2" />
                <span>Suporte prioritário</span>
              </div>
            </div>
            
            {isPremium ? (
              <Button 
                className="w-full bg-highlight hover:bg-highlight/80"
                disabled={true}
              >
                Plano Atual
              </Button>
            ) : (
              <Button 
                className="w-full bg-highlight hover:bg-highlight/80"
                onClick={handleUpgrade}
              >
                <CreditCard size={16} className="mr-2" />
                Fazer Upgrade Agora
              </Button>
            )}
            
            {!isPremium && (
              <p className="text-xs text-center mt-2 text-muted-foreground">
                Plano Premium: 2,50 USD/mês. Libera uso ilimitado de salas, memórias e funcionalidades multimídia.
              </p>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
