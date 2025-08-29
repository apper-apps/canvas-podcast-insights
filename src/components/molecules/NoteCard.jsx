import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const NoteCard = ({ note, episode, onEdit, onDelete, searchQuery = "" }) => {
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

  return (
    <Card className="p-5">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="font-medium text-slate-900 text-sm mb-1">
            {highlightText(episode?.title || "Unknown Episode", searchQuery)}
          </h4>
          <p className="text-xs text-slate-500">
            {format(new Date(note.createdAt), "MMM dd, yyyy 'at' h:mm a")}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(note)}
            className="p-2"
          >
            <ApperIcon name="Edit2" className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(note.Id)}
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="text-sm text-slate-700 leading-relaxed">
        {highlightText(note.content, searchQuery)}
      </div>
    </Card>
  );
};

export default NoteCard;