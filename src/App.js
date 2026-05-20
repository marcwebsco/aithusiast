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
import ComparePage from "@/pages/ComparePage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import PrivacyPage from "@/pages/PrivacyPage";
import TermsPage from "@/pages/TermsPage";
import CookiesPage from "@/pages/CookiesPage";
import SiteShell from "@/components/site/SiteShell";
import { CompareProvider } from "@/lib/compare";

function App() {
  useEffect(() => {
    document.title = "AIthusiast — Discover the best AI for anything.";
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <CompareProvider>
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
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/cookies" element={<CookiesPage />} />
            </Routes>
          </SiteShell>
        </CompareProvider>
        <Toaster position="bottom-right" theme="dark" />
      </BrowserRouter>
    </div>
  );
}

export default App;
