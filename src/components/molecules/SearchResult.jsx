import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const SearchResult = ({ episode, matches = [], searchQuery }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/episodes/${episode.Id}`);
  };

const highlightText = (text, query) => {
    if (!query || !text) return text;
    
    // Escape special regex characters and limit query length for security
    const escapedQuery = query.slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, "gi");
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
    <Card className="p-6 cursor-pointer hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
{highlightText(episode.title_c, searchQuery)}
          </h3>
          
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600 mb-3">
<div className="flex items-center gap-1">
              <ApperIcon name="User" className="w-4 h-4" />
<span>{highlightText(episode.channel_name_c, searchQuery)}</span>
            </div>
{episode.company_c && (
              <div className="flex items-center gap-1">
                <ApperIcon name="Building" className="w-4 h-4" />
                <span>{highlightText(episode.company_c, searchQuery)}</span>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <ApperIcon name="Calendar" className="w-4 h-4" />
<span>{format(new Date(episode.date_c), "MMM dd, yyyy")}</span>
            </div>
          </div>
        </div>
        
        <Badge variant="success">
          {matches.length} {matches.length === 1 ? "match" : "matches"}
        </Badge>
      </div>

      {matches.length > 0 && (
        <div className="space-y-3 mb-4">
          <h4 className="text-sm font-medium text-slate-700">Matching excerpts:</h4>
          {matches.slice(0, 3).map((match, index) => (
            <div key={index} className="bg-slate-50 rounded-lg p-3">
              <p className="text-sm text-slate-700 leading-relaxed">
                "{highlightText(match, searchQuery)}"
              </p>
            </div>
          ))}
          {matches.length > 3 && (
            <p className="text-xs text-slate-500 italic">
              +{matches.length - 3} more matches
            </p>
          )}
        </div>
      )}

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <button
          onClick={handleClick}
          className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          <ApperIcon name="FileText" className="w-4 h-4" />
          View full transcript
        </button>
        
        <ApperIcon name="ChevronRight" className="w-4 h-4 text-slate-400" />
      </div>
    </Card>
  );
};

export default SearchResult;