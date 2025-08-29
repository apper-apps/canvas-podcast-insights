import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const EpisodeCard = ({ episode, searchQuery = "", className }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/episodes/${episode.Id}`);
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

  return (
    <Card 
      className={cn(
        "p-6 cursor-pointer hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200",
        className
      )}
      onClick={handleClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">
            {highlightText(episode.title, searchQuery)}
          </h3>
          
<div className="flex flex-wrap items-center gap-2 text-sm text-slate-600 mb-3">
            <div className="flex items-center gap-1">
              <ApperIcon name="User" className="w-4 h-4" />
              <span>{highlightText(episode.channelName, searchQuery)}</span>
            </div>
            
            {episode.company && (
              <div className="flex items-center gap-1">
                <ApperIcon name="Building" className="w-4 h-4" />
                <span>{highlightText(episode.company, searchQuery)}</span>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <ApperIcon name="Calendar" className="w-4 h-4" />
              <span>{format(new Date(episode.date), "MMM dd, yyyy")}</span>
            </div>
            
            {episode.duration && (
              <div className="flex items-center gap-1">
                <ApperIcon name="Clock" className="w-4 h-4" />
                <span>{episode.duration}</span>
              </div>
            )}
          </div>
        </div>
        
        <Badge variant="primary" className="ml-4">
          Episode
        </Badge>
      </div>

      <div className="text-sm text-slate-700 leading-relaxed line-clamp-3">
        {highlightText(episode.description, searchQuery)}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span>Click to view full transcript</span>
        </div>
        
        <ApperIcon name="ChevronRight" className="w-4 h-4 text-slate-400" />
      </div>
    </Card>
  );
};

export default EpisodeCard;