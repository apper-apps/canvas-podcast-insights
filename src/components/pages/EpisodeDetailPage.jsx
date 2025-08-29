import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import YoutubePlayer from "@/components/organisms/YoutubePlayer";
import NotesEditor from "@/components/organisms/NotesEditor";
import NoteCard from "@/components/molecules/NoteCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import EpisodesService from "@/services/api/EpisodesService";
import NotesService from "@/services/api/NotesService";

const EpisodeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [episode, setEpisode] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setError(null);
      setLoading(true);
      const [episodeData, notesData] = await Promise.all([
        EpisodesService.getById(parseInt(id)),
        NotesService.getAll()
      ]);
      
      setEpisode(episodeData);
setNotes(notesData.filter(note => note.episode_id_c?.Id === parseInt(id) || note.episode_id_c === parseInt(id)));
    } catch (err) {
      setError("Failed to load episode. Please try again.");
      console.error("Error loading episode:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNoteSave = (savedNote) => {
    if (editingNote) {
      setNotes(prev => prev.map(note => 
        note.Id === savedNote.Id ? savedNote : note
      ));
    } else {
      setNotes(prev => [...prev, savedNote]);
    }
    setShowNoteEditor(false);
    setEditingNote(null);
  };

  const handleNoteEdit = (note) => {
    setEditingNote(note);
    setShowNoteEditor(true);
  };

  const handleNoteDelete = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      await NotesService.delete(noteId);
      setNotes(prev => prev.filter(note => note.Id !== noteId));
      toast.success("Note deleted successfully");
    } catch (error) {
      toast.error("Failed to delete note");
      console.error("Error deleting note:", error);
    }
  };

  const handleCancel = () => {
    setShowNoteEditor(false);
    setEditingNote(null);
  };

  const highlightText = (text, query) => {
    if (!query || !text) return text;
    
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="search-highlight">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (!episode) return <Error message="Episode not found" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Navigation */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/episodes")}
          className="flex items-center gap-2"
        >
          <ApperIcon name="ArrowLeft" className="w-4 h-4" />
          Back to Episodes
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Episode Header */}
          <Card className="p-6">
            <div className="flex justify-between items-start mb-4">
              <Badge variant="primary">Episode</Badge>
              <Button
                variant="ghost"
                size="sm"
onClick={() => window.open(episode.youtube_url_c, "_blank")}
              >
                <ApperIcon name="ExternalLink" className="w-4 h-4" />
              </Button>
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-4 leading-tight">
{episode.title_c}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
<div className="flex items-center gap-2 text-slate-600">
                <ApperIcon name="User" className="w-4 h-4" />
                <span className="font-medium">Channel:</span>
<span>{episode.channel_name_c}</span>
              </div>

{episode.company_c && (
                <div className="flex items-center gap-2 text-slate-600">
                  <ApperIcon name="Building" className="w-4 h-4" />
                  <span className="font-medium">Company:</span>
                  <span>{episode.company_c}</span>
                </div>
              )}

<div className="flex items-center gap-2 text-slate-600">
                <ApperIcon name="Calendar" className="w-4 h-4" />
                <span className="font-medium">Published:</span>
<span>{format(new Date(episode.publishdate_c), "MMM dd, yyyy")}</span>
              </div>
            </div>

{episode.duration_c && (
              <div className="mt-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <ApperIcon name="Clock" className="w-4 h-4" />
                  <span className="font-medium">Duration:</span>
                  <span>{episode.duration_c}</span>
                </div>
              </div>
            )}
          </Card>

          {/* YouTube Player */}
<YoutubePlayer url={episode.youtube_url_c} title={episode.title_c} />

          {/* Transcript Search */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                <ApperIcon name="FileText" className="w-5 h-5" />
                Full Transcript
              </h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <ApperIcon 
                    name="Search" 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" 
                  />
                  <input
                    type="text"
                    placeholder="Search transcript..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
                  />
                </div>
              </div>
            </div>

            <div className="prose prose-slate max-w-none">
              <div className="text-slate-700 leading-relaxed whitespace-pre-wrap text-sm">
{highlightText(episode.transcript_c, searchQuery)}
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Notes Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <ApperIcon name="BookMarked" className="w-5 h-5" />
                Notes ({notes.length})
              </h3>
              
              {!showNoteEditor && (
                <Button
                  size="sm"
                  onClick={() => setShowNoteEditor(true)}
                >
                  <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                  Add Note
                </Button>
              )}
            </div>

            {showNoteEditor && (
              <div className="mb-6">
                <NotesEditor
                  episodeId={parseInt(id)}
                  existingNote={editingNote}
                  onSave={handleNoteSave}
                  onCancel={handleCancel}
                />
              </div>
            )}

            <div className="space-y-4">
              {notes.length === 0 ? (
                <div className="text-center text-slate-500 py-8">
                  <ApperIcon name="BookOpen" className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm">No notes yet</p>
                  <p className="text-xs">Add your first note to this episode</p>
                </div>
              ) : (
                notes.map((note) => (
                  <NoteCard
                    key={note.Id}
                    note={note}
                    episode={episode}
                    onEdit={handleNoteEdit}
                    onDelete={handleNoteDelete}
                  />
                ))
              )}
            </div>
          </Card>

          {/* Episode Info */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <ApperIcon name="Info" className="w-5 h-5" />
              Episode Info
            </h3>

            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-slate-700">Episode ID:</span>
                <span className="ml-2 text-slate-600">{episode.Id}</span>
              </div>

              <div>
<span className="font-medium text-slate-700">Transcript Length:</span>
                <span className="text-slate-600">
                  {episode.transcript_c ? `${episode.transcript_c.length.toLocaleString()} characters` : "No transcript"}
                </span>
              </div>

              <div>
<span className="font-medium text-slate-700">Word Count:</span>
                <span className="ml-2 text-slate-600">
                  {episode.transcript_c ? `~${Math.round(episode.transcript_c.split(" ").length).toLocaleString()} words` : "No transcript"}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <Button
                  variant="outline"
                  size="sm"
onClick={() => window.open(episode.youtube_url_c, "_blank")}
                  className="w-full"
                >
                  <ApperIcon name="Youtube" className="w-4 h-4 mr-2" />
                  Watch on YouTube
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EpisodeDetailPage;