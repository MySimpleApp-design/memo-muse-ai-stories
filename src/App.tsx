
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { MuseumProvider } from "./context/MuseumContext";
import { PlanProvider } from "./context/PlanContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// Pages
import Home from "./pages/Home";
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
import PlanUpgrade from "./pages/PlanUpgrade";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <PlanProvider>
          <MuseumProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/welcome" element={<LandingPage />} />
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
                <Route path="/plans" element={
                  <ProtectedRoute>
                    <PlanUpgrade />
                  </ProtectedRoute>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </MuseumProvider>
        </PlanProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
