
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { usePlan } from "./PlanContext";

// Define types for our data
export interface Room {
  id: string;
  userId: string;
  name: string;
  description: string;
  coverImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Memory {
  id: string;
  roomId: string;
  userId: string;
  title: string;
  description: string;
  mediaType: "text" | "image" | "video" | "audio";
  mediaUrl?: string;
  content?: string;
  createdAt: string;
  updatedAt: string;
}

interface MuseumContextType {
  rooms: Room[];
  memories: Memory[];
  isLoading: boolean;
  // Room operations
  createRoom: (data: Omit<Room, "id" | "userId" | "createdAt" | "updatedAt">) => Promise<Room>;
  updateRoom: (id: string, data: Partial<Omit<Room, "id" | "userId" | "createdAt" | "updatedAt">>) => Promise<Room>;
  deleteRoom: (id: string) => Promise<void>;
  // Memory operations
  createMemory: (data: Omit<Memory, "id" | "userId" | "createdAt" | "updatedAt">) => Promise<Memory>;
  updateMemory: (id: string, data: Partial<Omit<Memory, "id" | "userId" | "createdAt" | "updatedAt">>) => Promise<Memory>;
  deleteMemory: (id: string) => Promise<void>;
  // Plan helpers
  getRoomMemoryCount: (roomId: string) => number;
}

const MuseumContext = createContext<MuseumContextType | undefined>(undefined);

export function useMuseum() {
  const context = useContext(MuseumContext);
  if (context === undefined) {
    throw new Error("useMuseum must be used within an MuseumProvider");
  }
  return context;
}

interface MuseumProviderProps {
  children: ReactNode;
}

export function MuseumProvider({ children }: MuseumProviderProps) {
  const { user } = useAuth();
  const { canAddMemoryToRoom, planLimits } = usePlan();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from local storage on initialization
  useEffect(() => {
    if (user) {
      loadData();
    } else {
      setRooms([]);
      setMemories([]);
      setIsLoading(false);
    }
  }, [user]);

  const loadData = () => {
    try {
      setIsLoading(true);
      
      // Load rooms
      const storedRooms = localStorage.getItem("museum_rooms");
      if (storedRooms) {
        const parsedRooms = JSON.parse(storedRooms) as Room[];
        // Filter rooms by current user
        setRooms(parsedRooms.filter(room => room.userId === user?.id));
      }
      
      // Load memories
      const storedMemories = localStorage.getItem("museum_memories");
      if (storedMemories) {
        const parsedMemories = JSON.parse(storedMemories) as Memory[];
        // Filter memories by current user
        setMemories(parsedMemories.filter(memory => memory.userId === user?.id));
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Erro ao carregar dados");
    } finally {
      setIsLoading(false);
    }
  };

  // Save the updated data to localStorage
  const saveRooms = (updatedRooms: Room[]) => {
    try {
      // Get all rooms including those from other users
      const storedRooms = localStorage.getItem("museum_rooms");
      const allRooms = storedRooms ? JSON.parse(storedRooms) as Room[] : [];
      
      // Filter out current user's rooms and add the updated ones
      const otherUserRooms = allRooms.filter(r => r.userId !== user?.id);
      const newRooms = [...otherUserRooms, ...updatedRooms];
      
      localStorage.setItem("museum_rooms", JSON.stringify(newRooms));
      setRooms(updatedRooms);
      return true;
    } catch (error) {
      console.error("Error saving rooms:", error);
      return false;
    }
  };

  const saveMemories = (updatedMemories: Memory[]) => {
    try {
      // Get all memories including those from other users
      const storedMemories = localStorage.getItem("museum_memories");
      const allMemories = storedMemories ? JSON.parse(storedMemories) as Memory[] : [];
      
      // Filter out current user's memories and add the updated ones
      const otherUserMemories = allMemories.filter(m => m.userId !== user?.id);
      const newMemories = [...otherUserMemories, ...updatedMemories];
      
      localStorage.setItem("museum_memories", JSON.stringify(newMemories));
      setMemories(updatedMemories);
      return true;
    } catch (error) {
      console.error("Error saving memories:", error);
      return false;
    }
  };

  // Helper function to get memory count for a specific room
  const getRoomMemoryCount = (roomId: string): number => {
    return memories.filter(m => m.roomId === roomId).length;
  };

  // Room operations
  const createRoom = async (data: Omit<Room, "id" | "userId" | "createdAt" | "updatedAt">) => {
    if (!user) throw new Error("User not authenticated");
    
    try {
      setIsLoading(true);

      // Check if user is within room limit
      if (rooms.length >= planLimits.maxRooms) {
        toast.error(`Limite de salas atingido (${planLimits.maxRooms}). Faça upgrade para o plano Premium.`);
        throw new Error("Room limit reached");
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const now = new Date().toISOString();
      const newRoom: Room = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      
      const updatedRooms = [...rooms, newRoom];
      const saved = saveRooms(updatedRooms);
      
      if (!saved) {
        throw new Error("Failed to save room");
      }
      
      toast.success("Sala criada com sucesso");
      return newRoom;
    } catch (error) {
      console.error("Error creating room:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateRoom = async (id: string, data: Partial<Omit<Room, "id" | "userId" | "createdAt" | "updatedAt">>) => {
    if (!user) throw new Error("User not authenticated");
    
    try {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const roomIndex = rooms.findIndex(r => r.id === id && r.userId === user.id);
      if (roomIndex === -1) throw new Error("Room not found");
      
      const updatedRoom: Room = {
        ...rooms[roomIndex],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      
      const updatedRooms = [...rooms];
      updatedRooms[roomIndex] = updatedRoom;
      saveRooms(updatedRooms);
      
      toast.success("Sala atualizada com sucesso");
      return updatedRoom;
    } catch (error) {
      console.error("Error updating room:", error);
      toast.error("Erro ao atualizar sala");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRoom = async (id: string) => {
    if (!user) throw new Error("User not authenticated");
    
    try {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Delete the room
      const updatedRooms = rooms.filter(r => !(r.id === id && r.userId === user.id));
      saveRooms(updatedRooms);
      
      // Delete all memories associated with the room
      const updatedMemories = memories.filter(m => !(m.roomId === id && m.userId === user.id));
      saveMemories(updatedMemories);
      
      toast.success("Sala excluída com sucesso");
    } catch (error) {
      console.error("Error deleting room:", error);
      toast.error("Erro ao excluir sala");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Memory operations
  const createMemory = async (data: Omit<Memory, "id" | "userId" | "createdAt" | "updatedAt">) => {
    if (!user) throw new Error("User not authenticated");
    
    try {
      setIsLoading(true);
      
      // Check if user can add memory to this room
      if (!canAddMemoryToRoom(data.roomId)) {
        toast.error(`Limite de memórias atingido (${planLimits.maxMemoriesPerRoom} por sala). Faça upgrade para o plano Premium.`);
        throw new Error("Memory limit reached");
      }

      // Simulate API delay - reduced for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const now = new Date().toISOString();
      const newMemory: Memory = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      
      const updatedMemories = [...memories, newMemory];
      const saved = saveMemories(updatedMemories);
      
      if (!saved) {
        throw new Error("Failed to save memory");
      }
      
      toast.success("Memória criada com sucesso");
      return newMemory;
    } catch (error) {
      console.error("Error creating memory:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateMemory = async (id: string, data: Partial<Omit<Memory, "id" | "userId" | "createdAt" | "updatedAt">>) => {
    if (!user) throw new Error("User not authenticated");
    
    try {
      setIsLoading(true);
      // Simulate API delay - reduced for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const memoryIndex = memories.findIndex(m => m.id === id && m.userId === user.id);
      if (memoryIndex === -1) throw new Error("Memory not found");
      
      const updatedMemory: Memory = {
        ...memories[memoryIndex],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      
      const updatedMemories = [...memories];
      updatedMemories[memoryIndex] = updatedMemory;
      const saved = saveMemories(updatedMemories);
      
      if (!saved) {
        throw new Error("Failed to update memory");
      }
      
      toast.success("Memória atualizada com sucesso");
      return updatedMemory;
    } catch (error) {
      console.error("Error updating memory:", error);
      toast.error("Erro ao atualizar memória");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMemory = async (id: string) => {
    if (!user) throw new Error("User not authenticated");
    
    try {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedMemories = memories.filter(m => !(m.id === id && m.userId === user.id));
      saveMemories(updatedMemories);
      
      toast.success("Memória excluída com sucesso");
    } catch (error) {
      console.error("Error deleting memory:", error);
      toast.error("Erro ao excluir memória");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    rooms,
    memories,
    isLoading,
    createRoom,
    updateRoom,
    deleteRoom,
    createMemory,
    updateMemory,
    deleteMemory,
    getRoomMemoryCount,
  };

  return <MuseumContext.Provider value={value}>{children}</MuseumContext.Provider>;
}
