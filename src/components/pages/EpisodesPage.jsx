import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import EpisodeFilters from "@/components/organisms/EpisodeFilters";
import EpisodeTable from "@/components/organisms/EpisodeTable";
import EpisodesService from "@/services/api/EpisodesService";

const EpisodesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
const [filters, setFilters] = useState({});
  const [viewMode, setViewMode] = useState("table");
  const [showImportModal, setShowImportModal] = useState(false);
  const [importData, setImportData] = useState("");
  const [importing, setImporting] = useState(false);

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

  const handleImport = async () => {
    if (!importData.trim()) {
      toast.error("Please provide data to import");
      return;
    }

    setImporting(true);
    try {
      // Parse the import data (support both CSV and JSON formats)
      let records = [];
      
      if (importData.trim().startsWith('[') || importData.trim().startsWith('{')) {
        // JSON format
        const parsed = JSON.parse(importData);
        records = Array.isArray(parsed) ? parsed : [parsed];
      } else {
        // CSV format
        const lines = importData.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
          const record = {};
          headers.forEach((header, index) => {
            record[header] = values[index] || '';
          });
          records.push(record);
        }
      }

      // Process each record
      let successCount = 0;
      let errorCount = 0;

      for (const record of records) {
        try {
          // Map common field variations to database field names
          const mappedRecord = {
            Name: record.Name || record.title || record.Title || '',
            title_c: record.title_c || record.title || record.Title || '',
            channel_name_c: record.channel_name_c || record.channel_name || record.channel || record.Channel || '',
            company_c: record.company_c || record.company || record.Company || '',
            date_c: record.date_c || record.date || record.Date || new Date().toISOString().split('T')[0],
            youtube_url_c: record.youtube_url_c || record.youtube_url || record.url || record.URL || '',
            duration_c: record.duration_c || record.duration || record.Duration || '',
            description_c: record.description_c || record.description || record.Description || '',
            transcript_c: record.transcript_c || record.transcript || record.Transcript || '',
            guest_name_c: record.guest_name_c || record.guest_name || record.guest || record.Guest || ''
          };

          await EpisodesService.create(mappedRecord);
          successCount++;
        } catch (error) {
          console.error('Error importing record:', error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully imported ${successCount} episodes`);
        loadEpisodes(); // Refresh the episodes list
      }
      
      if (errorCount > 0) {
        toast.error(`Failed to import ${errorCount} episodes`);
      }

      setShowImportModal(false);
      setImportData("");
    } catch (error) {
      toast.error("Failed to parse import data. Please check the format.");
      console.error("Import error:", error);
    } finally {
      setImporting(false);
    }
  };

  const filteredEpisodes = useMemo(() => {
    let filtered = [...episodes];

// Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = episodes.filter(episode =>
        (episode.title_c || '').toLowerCase().includes(query) ||
        (episode.channel_name_c || '').toLowerCase().includes(query) ||
        (episode.company_c && episode.company_c.toLowerCase().includes(query)) ||
        (episode.transcript_c || '').toLowerCase().includes(query) ||
        (episode.description_c || '').toLowerCase().includes(query)
      );
    }

    // Apply filters
// Apply filters
if (filters.guest) {
      filtered = filtered.filter(ep => (ep.guest_name_c || '') === filters.guest);
    }

    if (filters.company) {
      filtered = filtered.filter(ep => (ep.company_c || '') === filters.company);
    }

    if (filters.startDate) {
      filtered = filtered.filter(ep => ep.date_c && new Date(ep.date_c) >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      filtered = filtered.filter(ep => ep.date_c && new Date(ep.date_c) <= new Date(filters.endDate));
    }

    if (filters.duration) {
      filtered = filtered.filter(ep => {
        if (!ep.duration_c) return false;
        const minutes = parseInt(ep.duration_c);
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
            variant="secondary"
            size="sm"
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Upload" className="w-4 h-4" />
            Import Episodes
          </Button>
          
          <div className="w-px h-6 bg-slate-300"></div>
          
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

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">Import Episodes</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowImportModal(false)}
                >
                  <ApperIcon name="X" className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <p className="text-slate-600 mb-2">
                  Paste your data in CSV or JSON format. Supported field names:
                </p>
                <div className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg">
                  <strong>CSV Headers:</strong> title, channel_name, company, date, youtube_url, duration, description, transcript, guest_name<br/>
                  <strong>JSON Keys:</strong> Same as CSV headers or with _c suffix (title_c, channel_name_c, etc.)
                </div>
              </div>
              
              <textarea
                className="w-full h-64 p-3 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={`CSV Example:
title,channel_name,company,date,guest_name
"Episode Title","20VC","Company Name","2024-01-15","John Doe"

JSON Example:
[{"title": "Episode Title", "channel_name": "20VC", "company": "Company Name", "date": "2024-01-15", "guest_name": "John Doe"}]`}
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
              />
              
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="secondary"
                  onClick={() => setShowImportModal(false)}
                  disabled={importing}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleImport}
                  disabled={importing || !importData.trim()}
                >
                  {importing ? (
                    <>
                      <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Upload" className="w-4 h-4 mr-2" />
                      Import Episodes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
)}
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
            {new Set(episodes.map(ep => ep.guest_name_c).filter(Boolean)).size}
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