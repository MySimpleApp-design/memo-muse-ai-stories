
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
  canAddMemoryToRoom: (roomId: string) => boolean;
  upgradeToPremium: () => void;
  isPremium: boolean;
  usagePercentage: number;
  getUsageDetails: (roomId: string) => { current: number; max: number; percentage: number };
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
  const [usagePercentage, setUsagePercentage] = useState(0);

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

  // New function: Check if user can add memory to specific room
  const canAddMemoryToRoom = (roomId: string) => {
    if (isPremium) return true;
    
    const usage = getUsageDetails(roomId);
    return usage.current < usage.max;
  };

  // Get detailed usage information for a specific room
  const getUsageDetails = (roomId: string) => {
    // This function would normally fetch data from the API
    // For now, we'll use localStorage to simulate API behavior
    const memoriesString = localStorage.getItem("museum_memories");
    let current = 0;
    
    if (memoriesString && user) {
      const memories = JSON.parse(memoriesString);
      current = memories.filter(
        (m: any) => m.roomId === roomId && m.userId === user.id
      ).length;
    }
    
    const max = planLimits.maxMemoriesPerRoom;
    const percentage = max === Infinity ? 0 : Math.min(100, (current / max) * 100);
    
    return { current, max, percentage };
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
    canAddMemoryToRoom,
    upgradeToPremium,
    isPremium,
    usagePercentage,
    getUsageDetails,
  };

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}
