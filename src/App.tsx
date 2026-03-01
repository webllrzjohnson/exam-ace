import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import QuizCatalog from "./pages/QuizCatalog";
import QuizDetail from "./pages/QuizDetail";
import QuizPlayer from "./pages/QuizPlayer";
import ResultsPage from "./pages/ResultsPage";
import ReviewPage from "./pages/ReviewPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import DashboardPage from "./pages/DashboardPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quizzes" element={<QuizCatalog />} />
            <Route path="/quiz/:id" element={<QuizDetail />} />
            <Route path="/quiz/:id/play" element={<QuizPlayer />} />
            <Route path="/quiz/:id/results" element={<ResultsPage />} />
            <Route path="/quiz/:id/review" element={<ReviewPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
