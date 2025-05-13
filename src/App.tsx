
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { MuseumProvider } from "./context/MuseumContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";
import RoomDetail from "./pages/RoomDetail";
import RoomForm from "./pages/RoomForm";
import MemoryForm from "./pages/MemoryForm";
import MemoryDetail from "./pages/MemoryDetail";
import Profile from "./pages/Profile";
import ShareView from "./pages/ShareView";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <MuseumProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/share/:userId" element={<ShareView />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/rooms" element={
                <ProtectedRoute>
                  <Rooms />
                </ProtectedRoute>
              } />
              <Route path="/rooms/new" element={
                <ProtectedRoute>
                  <RoomForm />
                </ProtectedRoute>
              } />
              <Route path="/rooms/:roomId" element={
                <ProtectedRoute>
                  <RoomDetail />
                </ProtectedRoute>
              } />
              <Route path="/rooms/:roomId/edit" element={
                <ProtectedRoute>
                  <RoomForm />
                </ProtectedRoute>
              } />
              <Route path="/rooms/:roomId/memories/new" element={
                <ProtectedRoute>
                  <MemoryForm />
                </ProtectedRoute>
              } />
              <Route path="/rooms/:roomId/memories/:memoryId" element={
                <ProtectedRoute>
                  <MemoryDetail />
                </ProtectedRoute>
              } />
              <Route path="/rooms/:roomId/memories/:memoryId/edit" element={
                <ProtectedRoute>
                  <MemoryForm />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </MuseumProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
