import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import SearchBar from "@/components/molecules/SearchBar";
import NoteCard from "@/components/molecules/NoteCard";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import NotesService from "@/services/api/NotesService";
import EpisodesService from "@/services/api/EpisodesService";

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError(null);
      setLoading(true);
      const [notesData, episodesData] = await Promise.all([
        NotesService.getAll(),
        EpisodesService.getAll()
      ]);
      
      setNotes(notesData);
      setEpisodes(episodesData);
    } catch (err) {
      setError("Failed to load notes. Please try again.");
      console.error("Error loading notes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNoteEdit = (note) => {
    // For now, we'll just show a toast. In a real app, you might open an edit modal
    toast.info("Edit functionality would open a modal or navigate to edit page");
  };

  const handleNoteDelete = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      const success = await NotesService.delete(noteId);
      if (success) {
        setNotes(prev => prev.filter(note => note.Id !== noteId));
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const episodeMap = useMemo(() => {
    const map = {};
    episodes.forEach(episode => {
      map[episode.Id] = episode;
    });
    return map;
  }, [episodes]);

  const filteredAndSortedNotes = useMemo(() => {
    let filtered = notes;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = notes.filter(note => {
        // Handle lookup field - episode_id_c might be an object or number
        const episodeId = note.episode_id_c?.Id || note.episode_id_c;
        const episode = episodeMap[episodeId];
        return (
          note.content_c?.toLowerCase().includes(query) ||
          (episode && episode.title_c?.toLowerCase().includes(query)) ||
          (episode && episode.guest_name_c?.toLowerCase().includes(query)) ||
          (episode && episode.company_c?.toLowerCase().includes(query))
        );
      });
    }

    // Sort notes
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.created_at_c) - new Date(a.created_at_c);
        case "oldest":
          return new Date(a.created_at_c) - new Date(b.created_at_c);
        case "updated":
          return new Date(b.updated_at_c) - new Date(a.updated_at_c);
        case "episode":
          const episodeIdA = a.episode_id_c?.Id || a.episode_id_c;
          const episodeIdB = b.episode_id_c?.Id || b.episode_id_c;
          const episodeA = episodeMap[episodeIdA];
          const episodeB = episodeMap[episodeIdB];
          return episodeA?.title_c?.localeCompare(episodeB?.title_c) || 0;
        default:
          return 0;
      }
    });
  }, [notes, episodeMap, searchQuery, sortBy]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            My Notes
          </h1>
          <p className="text-slate-600 mt-2">
            All your saved notes and insights from podcast episodes
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => window.location.href = "/episodes"}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            Add Note to Episode
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={setSearchQuery}
            placeholder="Search notes, episodes, guests, or companies..."
            showButton={false}
          />
        </div>
        
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-slate-700 whitespace-nowrap">
            Sort by:
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest First</option>
            <option value="updated">Last Updated</option>
            <option value="episode">Episode Title</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      {notes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-4">
            <div className="text-2xl font-bold text-primary-900">
              {notes.length}
            </div>
            <div className="text-primary-700 text-sm">Total Notes</div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
            <div className="text-2xl font-bold text-green-900">
              {filteredAndSortedNotes.length}
            </div>
            <div className="text-green-700 text-sm">Filtered Results</div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4">
            <div className="text-2xl font-bold text-purple-900">
              {new Set(notes.map(note => note.episode_id_c?.Id || note.episode_id_c)).size}
            </div>
            <div className="text-purple-700 text-sm">Episodes with Notes</div>
          </div>
        </div>
      )}

      {/* Notes List */}
      {notes.length === 0 ? (
        <Empty
          title="No notes yet"
          description="Start adding notes to your favorite episodes to keep track of insights and key takeaways."
          action={() => window.location.href = "/episodes"}
          actionLabel="Browse Episodes"
          icon="BookMarked"
        />
      ) : filteredAndSortedNotes.length === 0 ? (
        <Empty
          title="No matching notes"
          description={`No notes match your search for "${searchQuery}". Try different keywords.`}
          action={() => setSearchQuery("")}
          actionLabel="Clear search"
          icon="Search"
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedNotes.map((note) => {
            const episodeId = note.episode_id_c?.Id || note.episode_id_c;
            return (
              <NoteCard
                key={note.Id}
                note={note}
                episode={episodeMap[episodeId]}
                onEdit={handleNoteEdit}
                onDelete={handleNoteDelete}
                searchQuery={searchQuery}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotesPage;