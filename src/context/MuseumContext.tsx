
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

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
  aiGenerated?: boolean;
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
  // AI operations
  generateCaption: (description: string) => Promise<string>;
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
    // Get all rooms including those from other users
    const storedRooms = localStorage.getItem("museum_rooms");
    const allRooms = storedRooms ? JSON.parse(storedRooms) as Room[] : [];
    
    // Filter out current user's rooms and add the updated ones
    const otherUserRooms = allRooms.filter(r => r.userId !== user?.id);
    const newRooms = [...otherUserRooms, ...updatedRooms];
    
    localStorage.setItem("museum_rooms", JSON.stringify(newRooms));
    setRooms(updatedRooms);
  };

  const saveMemories = (updatedMemories: Memory[]) => {
    // Get all memories including those from other users
    const storedMemories = localStorage.getItem("museum_memories");
    const allMemories = storedMemories ? JSON.parse(storedMemories) as Memory[] : [];
    
    // Filter out current user's memories and add the updated ones
    const otherUserMemories = allMemories.filter(m => m.userId !== user?.id);
    const newMemories = [...otherUserMemories, ...updatedMemories];
    
    localStorage.setItem("museum_memories", JSON.stringify(newMemories));
    setMemories(updatedMemories);
  };

  // Room operations
  const createRoom = async (data: Omit<Room, "id" | "userId" | "createdAt" | "updatedAt">) => {
    if (!user) throw new Error("User not authenticated");
    
    try {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const now = new Date().toISOString();
      const newRoom: Room = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      
      const updatedRooms = [...rooms, newRoom];
      saveRooms(updatedRooms);
      
      toast.success("Sala criada com sucesso");
      return newRoom;
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error("Erro ao criar sala");
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const now = new Date().toISOString();
      const newMemory: Memory = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      
      const updatedMemories = [...memories, newMemory];
      saveMemories(updatedMemories);
      
      toast.success("Memória criada com sucesso");
      return newMemory;
    } catch (error) {
      console.error("Error creating memory:", error);
      toast.error("Erro ao criar memória");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateMemory = async (id: string, data: Partial<Omit<Memory, "id" | "userId" | "createdAt" | "updatedAt">>) => {
    if (!user) throw new Error("User not authenticated");
    
    try {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const memoryIndex = memories.findIndex(m => m.id === id && m.userId === user.id);
      if (memoryIndex === -1) throw new Error("Memory not found");
      
      const updatedMemory: Memory = {
        ...memories[memoryIndex],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      
      const updatedMemories = [...memories];
      updatedMemories[memoryIndex] = updatedMemory;
      saveMemories(updatedMemories);
      
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

  // AI operations
  const generateCaption = async (description: string) => {
    try {
      // This is a mock AI caption generation function
      // In a real application, this would call an OpenAI API or similar
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simple function to generate a creative title based on the description
      const generateTitle = (desc: string) => {
        const phrases = [
          "Memórias que Ecoam: ",
          "Instantes Capturados: ",
          "Fragmentos do Tempo: ",
          "Cores da Lembrança: ",
          "Ecos do Passado: ",
          "Página da Vida: ",
          "Impressões Eternas: ",
          "Momentos Guardados: ",
        ];
        
        // Get keywords from description
        const words = desc.split(" ")
          .filter(word => word.length > 4)
          .filter(word => !["sobre", "entre", "quando", "ainda", "depois", "antes"].includes(word));
        
        // Choose 1-2 keywords from the description
        const keywordCount = Math.min(2, words.length);
        const selectedWords = [];
        
        for (let i = 0; i < keywordCount; i++) {
          if (words.length > 0) {
            const randomIndex = Math.floor(Math.random() * words.length);
            selectedWords.push(words[randomIndex]);
            words.splice(randomIndex, 1);
          }
        }
        
        // Generate the title
        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        return randomPhrase + selectedWords.join(" ");
      };
      
      return generateTitle(description);
      
    } catch (error) {
      console.error("Error generating caption:", error);
      toast.error("Erro ao gerar legenda");
      return "Memória Especial";
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
    generateCaption,
  };

  return <MuseumContext.Provider value={value}>{children}</MuseumContext.Provider>;
}
