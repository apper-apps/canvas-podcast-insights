import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import EpisodesPage from "@/components/pages/EpisodesPage";
import EpisodeDetailPage from "@/components/pages/EpisodeDetailPage";
import SearchPage from "@/components/pages/SearchPage";
import NotesPage from "@/components/pages/NotesPage";
import SettingsPage from "@/components/pages/SettingsPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<EpisodesPage />} />
            <Route path="episodes" element={<EpisodesPage />} />
            <Route path="episodes/:id" element={<EpisodeDetailPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="notes" element={<NotesPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="z-50"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;