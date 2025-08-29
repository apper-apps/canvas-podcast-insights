import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import NotesService from "@/services/api/NotesService";
import { format } from "date-fns";

const NotesEditor = ({ episodeId, existingNote = null, onSave, onCancel }) => {
const [content, setContent] = useState(existingNote?.content_c || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
setContent(existingNote?.content_c || "");
  }, [existingNote]);

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error("Note content cannot be empty");
      return;
    }

    setSaving(true);
    try {
      let savedNote;
      if (existingNote) {
savedNote = await NotesService.update(existingNote.Id, {
          content_c: content.trim(),
          updated_at_c: new Date().toISOString()
        });
        toast.success("Note updated successfully");
      } else {
savedNote = await NotesService.create({
          episode_id_c: episodeId,
          content_c: content.trim(),
          created_at_c: new Date().toISOString(),
          updated_at_c: new Date().toISOString()
        });
        toast.success("Note saved successfully");
      }
      
      onSave(savedNote);
      setContent("");
    } catch (error) {
      toast.error("Failed to save note");
      console.error("Error saving note:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setContent(existingNote?.content || "");
    onCancel();
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <ApperIcon name="Edit3" className="w-5 h-5" />
          {existingNote ? "Edit Note" : "Add Note"}
        </h3>
        
        {existingNote && (
<div className="text-sm text-slate-500">
            Created {format(new Date(existingNote.created_at_c), "MMM dd, yyyy 'at' h:mm a")}
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Note Content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add your thoughts, insights, or key takeaways from this episode..."
          className="w-full h-40 px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder:text-slate-400"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">
          {content.length} characters
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !content.trim()}
          >
            {saving ? (
              <>
                <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                {existingNote ? "Update Note" : "Save Note"}
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default NotesEditor;