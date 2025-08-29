import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "@/components/molecules/SearchBar";
import SearchResult from "@/components/molecules/SearchResult";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import EpisodesService from "@/services/api/EpisodesService";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");

  useEffect(() => {
    loadEpisodes();
  }, []);

  useEffect(() => {
    const query = searchParams.get("q");
    if (query && query !== searchQuery) {
      setSearchQuery(query);
      setSearchPerformed(true);
    }
  }, [searchParams]);

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

  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || !searchPerformed) return [];

    const query = searchQuery.toLowerCase();
    const results = [];

    episodes.forEach(episode => {
      const matches = [];
      let relevanceScore = 0;

      // Search in title (higher weight)
      if (episode.title.toLowerCase().includes(query)) {
        relevanceScore += 10;
        const sentences = episode.title.match(/[^\.!?]+[\.!?]+/g) || [episode.title];
        matches.push(...sentences.filter(s => s.toLowerCase().includes(query)));
      }

      // Search in guest name (high weight)
      if (episode.guestName.toLowerCase().includes(query)) {
        relevanceScore += 8;
        matches.push(`Guest: ${episode.guestName}`);
      }

      // Search in company (high weight)
      if (episode.company && episode.company.toLowerCase().includes(query)) {
        relevanceScore += 8;
        matches.push(`Company: ${episode.company}`);
      }

      // Search in description (medium weight)
      if (episode.description.toLowerCase().includes(query)) {
        relevanceScore += 5;
        const sentences = episode.description.match(/[^\.!?]+[\.!?]+/g) || [episode.description];
        matches.push(...sentences.filter(s => s.toLowerCase().includes(query)).slice(0, 2));
      }

      // Search in transcript (lower weight but more matches)
      if (episode.transcript.toLowerCase().includes(query)) {
        relevanceScore += 2;
        const sentences = episode.transcript.match(/[^\.!?]+[\.!?]+/g) || [];
        const transcriptMatches = sentences
          .filter(s => s.toLowerCase().includes(query))
          .slice(0, 5)
          .map(s => s.trim());
        matches.push(...transcriptMatches);
      }

      if (matches.length > 0) {
        results.push({
          episode,
          matches: [...new Set(matches)], // Remove duplicates
          relevanceScore
        });
      }
    });

    // Sort results
    return results.sort((a, b) => {
      if (sortBy === "relevance") {
        return b.relevanceScore - a.relevanceScore;
      } else if (sortBy === "date") {
        return new Date(b.episode.date) - new Date(a.episode.date);
      } else if (sortBy === "title") {
        return a.episode.title.localeCompare(b.episode.title);
      }
      return 0;
    });
  }, [episodes, searchQuery, searchPerformed, sortBy]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSearchPerformed(true);
    
    const params = new URLSearchParams(searchParams);
    if (query.trim()) {
      params.set("q", query.trim());
    } else {
      params.delete("q");
    }
    setSearchParams(params);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchPerformed(false);
    setSearchParams({});
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadEpisodes} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
          Search Episodes
        </h1>
        <p className="text-slate-600">
          Search through episode titles, transcripts, guest names, and companies
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
          placeholder="Search episodes, guests, companies, or transcript content..."
          className="max-w-2xl mx-auto"
        />
      </div>

      {!searchPerformed ? (
        // Search suggestions/tips
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 text-center">
            <ApperIcon name="Search" className="w-16 h-16 text-slate-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              Start searching to find episodes
            </h3>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Use the search bar above to find episodes by guest names, companies, topics, or any content from the transcript.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="text-left">
                <h4 className="font-medium text-slate-900 mb-2">Search Tips:</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Search by guest name or company</li>
                  <li>• Look for specific topics or keywords</li>
                  <li>• Search within transcript content</li>
                  <li>• Use quotes for exact phrases</li>
                </ul>
              </div>
              
              <div className="text-left">
                <h4 className="font-medium text-slate-900 mb-2">Example Searches:</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• "artificial intelligence"</li>
                  <li>• startup funding</li>
                  <li>• venture capital</li>
                  <li>• company names</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      ) : searchResults.length === 0 ? (
        <Empty
          title="No results found"
          description={`No episodes match your search for "${searchQuery}". Try different keywords or check your spelling.`}
          action={clearSearch}
          actionLabel="Clear search"
          icon="Search"
        />
      ) : (
        <>
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <p className="text-slate-600">
                Found <span className="font-semibold text-slate-900">{searchResults.length}</span> 
                {searchResults.length === 1 ? " result" : " results"} for 
                <span className="font-semibold text-slate-900"> "{searchQuery}"</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="relevance">Relevance</option>
                <option value="date">Date (newest first)</option>
                <option value="title">Title (A-Z)</option>
              </select>

              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
              >
                <ApperIcon name="X" className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>

          {/* Search Results */}
          <div className="space-y-6">
            {searchResults.map((result, index) => (
              <SearchResult
                key={result.episode.Id}
                episode={result.episode}
                matches={result.matches}
                searchQuery={searchQuery}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchPage;