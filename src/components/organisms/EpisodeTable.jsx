import { useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const EpisodeTable = ({ 
  episodes = [], 
  loading = false, 
  error = null, 
  onRetry,
  searchQuery = ""
}) => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={onRetry} />;
  if (!episodes || episodes.length === 0) {
    return (
      <Empty 
        title="No episodes found"
        description="There are no episodes to display. Try adjusting your search or filters."
      />
    );
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedEpisodes = [...episodes].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    // Handle date sorting
    if (sortField === "date") {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }

    // Handle string sorting
    if (typeof aVal === "string") {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (sortDirection === "asc") {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

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

  const SortHeader = ({ field, children }) => (
    <th className="px-6 py-3 text-left">
      <button
        onClick={() => handleSort(field)}
        className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider hover:text-slate-700 transition-colors"
      >
        {children}
        <ApperIcon
          name={
            sortField === field
              ? sortDirection === "asc"
                ? "ChevronUp"
                : "ChevronDown"
              : "ChevronsUpDown"
          }
          className="w-4 h-4"
        />
      </button>
    </th>
  );

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <SortHeader field="title">Title</SortHeader>
              <SortHeader field="guestName">Guest</SortHeader>
<SortHeader field="channelName">Channel</SortHeader>
              <SortHeader field="date">Date</SortHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
</thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {sortedEpisodes.map((episode) => (
              <tr 
                key={episode.Id} 
                className="hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/episodes/${episode.Id}`)}
              >
                <td className="px-6 py-4">
                  <div className="max-w-md">
                    <div className="text-sm font-medium text-slate-900 line-clamp-2">
                      {highlightText(episode.title, searchQuery)}
                    </div>
                    <div className="text-sm text-slate-500 line-clamp-2 mt-1">
                      {highlightText(episode.description, searchQuery)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">
                    {highlightText(episode.guestName, searchQuery)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">
                    {episode.company ? highlightText(episode.company, searchQuery) : "-"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">
                    {format(new Date(episode.date), "MMM dd, yyyy")}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">
                    {episode.duration || "-"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/episodes/${episode.Id}`);
                    }}
                  >
                    <ApperIcon name="Eye" className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default EpisodeTable;