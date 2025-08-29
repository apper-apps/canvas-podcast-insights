import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import EpisodeTable from "@/components/organisms/EpisodeTable";
import EpisodeFilters from "@/components/organisms/EpisodeFilters";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import EpisodesService from "@/services/api/EpisodesService";

const EpisodesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [filters, setFilters] = useState({});
  const [viewMode, setViewMode] = useState("table");

  useEffect(() => {
    loadEpisodes();
  }, []);

  const loadEpisodes = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await EpisodesService.getAll();
      setEpisodes(data);
    } catch (err) {
      setError("Failed to load episodes. Please try again.");
      console.error("Error loading episodes:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEpisodes = useMemo(() => {
    let filtered = [...episodes];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
const filtered = episodes.filter(episode =>
        episode.title_c.toLowerCase().includes(query) ||
        episode.channel_name_c.toLowerCase().includes(query) ||
        (episode.company_c && episode.company_c.toLowerCase().includes(query)) ||
        episode.transcript_c.toLowerCase().includes(query) ||
        episode.description_c.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.guest) {
filtered = filtered.filter(ep => ep.guest_name_c === filters.guest);
    }

    if (filters.company) {
filtered = filtered.filter(ep => ep.company_c === filters.company);
    }

    if (filters.startDate) {
filtered = filtered.filter(ep => new Date(ep.date_c) >= new Date(filters.startDate));
    }

    if (filters.endDate) {
filtered = filtered.filter(ep => new Date(ep.date_c) <= new Date(filters.endDate));
    }

    if (filters.duration) {
      filtered = filtered.filter(ep => {
        if (!ep.duration) return false;
        const minutes = parseInt(ep.duration);
        switch (filters.duration) {
          case "short": return minutes < 30;
          case "medium": return minutes >= 30 && minutes <= 60;
          case "long": return minutes > 60;
          default: return true;
        }
      });
    }

    return filtered;
  }, [episodes, searchQuery, filters]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const params = new URLSearchParams(searchParams);
    if (query.trim()) {
      params.set("q", query.trim());
    } else {
      params.delete("q");
    }
    setSearchParams(params);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Podcast Episodes
          </h1>
          <p className="text-slate-600 mt-2">
            Browse and search through 20VC podcast episodes
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={viewMode === "table" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("table")}
          >
            <ApperIcon name="Table" className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <ApperIcon name="Grid3X3" className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
          placeholder="Search episodes, guests, companies, or transcript content..."
          showButton={false}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-4">
          <div className="text-2xl font-bold text-primary-900">
            {episodes.length}
          </div>
          <div className="text-primary-700 text-sm">Total Episodes</div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
          <div className="text-2xl font-bold text-green-900">
            {filteredEpisodes.length}
          </div>
          <div className="text-green-700 text-sm">Filtered Results</div>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4">
          <div className="text-2xl font-bold text-purple-900">
{new Set(episodes.map(ep => ep.guest_name_c)).size}
          </div>
          <div className="text-purple-700 text-sm">Unique Guests</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <EpisodeFilters
            episodes={episodes}
            onFiltersChange={handleFiltersChange}
          />
        </div>

        {/* Episodes Content */}
        <div className="lg:col-span-3">
          <EpisodeTable
            episodes={filteredEpisodes}
            loading={loading}
            error={error}
            onRetry={loadEpisodes}
            searchQuery={searchQuery}
          />
        </div>
      </div>
    </div>
  );
};

export default EpisodesPage;