import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

import HomePage from "@/pages/HomePage";
import ToolsPage from "@/pages/ToolsPage";
import ToolDetailPage from "@/pages/ToolDetailPage";
import ArticlesPage from "@/pages/ArticlesPage";
import ArticleDetailPage from "@/pages/ArticleDetailPage";
import SearchPage from "@/pages/SearchPage";
import StacksPage from "@/pages/StacksPage";
import StackDetailPage from "@/pages/StackDetailPage";
import SiteShell from "@/components/site/SiteShell";

function App() {
  useEffect(() => {
    document.title = "AIthusiast — Discover the best AI for anything.";
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <SiteShell>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/tools/:id" element={<ToolDetailPage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/articles/:slug" element={<ArticleDetailPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/stacks" element={<StacksPage />} />
            <Route path="/stacks/:slug" element={<StackDetailPage />} />
          </Routes>
        </SiteShell>
        <Toaster position="bottom-right" theme="dark" />
      </BrowserRouter>
    </div>
  );
}

export default App;
