
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";

export type PlanType = "basic" | "premium";

interface PlanLimits {
  maxRooms: number;
  maxMemoriesPerRoom: number;
}

interface PlanContextType {
  currentPlan: PlanType;
  planLimits: PlanLimits;
  isWithinLimits: (roomCount: number, memoryCount?: number) => boolean;
  upgradeToPremium: () => void;
  isPremium: boolean;
}

const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  basic: {
    maxRooms: 1,
    maxMemoriesPerRoom: 3,
  },
  premium: {
    maxRooms: Infinity,
    maxMemoriesPerRoom: Infinity,
  },
};

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export function usePlan() {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error("usePlan must be used within a PlanProvider");
  }
  return context;
}

interface PlanProviderProps {
  children: ReactNode;
}

export function PlanProvider({ children }: PlanProviderProps) {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<PlanType>("basic");

  // Load user's plan from localStorage on initialization
  useEffect(() => {
    if (user) {
      const storedPlan = localStorage.getItem(`museum_plan_${user.id}`);
      if (storedPlan && (storedPlan === "basic" || storedPlan === "premium")) {
        setCurrentPlan(storedPlan as PlanType);
      } else {
        // Default to basic plan if no plan is stored
        setCurrentPlan("basic");
        localStorage.setItem(`museum_plan_${user.id}`, "basic");
      }
    }
  }, [user]);

  const planLimits = PLAN_LIMITS[currentPlan];
  
  const isPremium = currentPlan === "premium";

  // Check if user is within plan limits
  const isWithinLimits = (roomCount: number, memoryCount?: number) => {
    const withinRoomLimit = roomCount < planLimits.maxRooms;
    
    // If memory count is provided, check if it's within limits
    if (memoryCount !== undefined) {
      return withinRoomLimit && memoryCount < planLimits.maxMemoriesPerRoom;
    }
    
    return withinRoomLimit;
  };

  // Upgrade user to premium plan
  const upgradeToPremium = () => {
    if (user) {
      setCurrentPlan("premium");
      localStorage.setItem(`museum_plan_${user.id}`, "premium");
    }
  };

  const value = {
    currentPlan,
    planLimits,
    isWithinLimits,
    upgradeToPremium,
    isPremium,
  };

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}
