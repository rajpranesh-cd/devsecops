
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Pages
import Dashboard from "./pages/Dashboard";
import Secrets from "./pages/Secrets";
import SAST from "./pages/SAST";
import SCA from "./pages/SCA";
import Container from "./pages/Container";
import SBOM from "./pages/SBOM";
import SupplyChain from "./pages/SupplyChain";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/secrets" element={<Secrets />} />
            <Route path="/sast" element={<SAST />} />
            <Route path="/sca" element={<SCA />} />
            <Route path="/container" element={<Container />} />
            <Route path="/sbom" element={<SBOM />} />
            <Route path="/supply-chain" element={<SupplyChain />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
