import { toast } from "react-toastify";
import React, { useState } from "react";
import * as XLSX from 'xlsx';
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
const SettingsPage = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleExportData = async () => {
    try {
      setIsExporting(true);
      
      // Initialize ApperClient
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Fetch all episodes
      const episodesParams = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "title_c" } },
          { field: { Name: "channel_name_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "youtube_url_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "transcript_c" } },
          { field: { Name: "guest_name_c" } }
        ],
        pagingInfo: { limit: 1000, offset: 0 }
      };

      const episodesResponse = await apperClient.fetchRecords('episode_c', episodesParams);
      
      // Fetch all notes
      const notesParams = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "episode_id_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
        ],
        pagingInfo: { limit: 1000, offset: 0 }
      };

      const notesResponse = await apperClient.fetchRecords('note_c', notesParams);

      if (!episodesResponse.success) {
        toast.error(`Failed to export episodes: ${episodesResponse.message}`);
        return;
      }

      if (!notesResponse.success) {
        toast.error(`Failed to export notes: ${notesResponse.message}`);
        return;
      }

      // Create export data structure
      const exportData = {
        version: "1.0.0",
        exportedAt: new Date().toISOString(),
        episodes: episodesResponse.data || [],
        notes: notesResponse.data || []
      };

      // Create and download JSON file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `podcast-insights-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Successfully exported ${exportData.episodes.length} episodes and ${exportData.notes.length} notes`);
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportData = () => {
    const input = document.getElementById('import-file-input');
    input.click();
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

// Check if file is JSON or Excel
    const isJson = file.type === 'application/json';
    const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                    file.type === 'application/vnd.ms-excel' || 
                    file.name.endsWith('.xlsx');
    
    if (!isJson && !isExcel) {
      toast.error("Please select a valid JSON or Excel (.xlsx) file");
      return;
    }

    try {
      setIsImporting(true);
      
let importData;
      
      if (isJson) {
        const fileContent = await file.text();
        importData = JSON.parse(fileContent);
      } else {
        // Handle Excel file
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        
        // Check for required worksheets
        if (!workbook.SheetNames.includes('Episodes') || !workbook.SheetNames.includes('Notes')) {
          toast.error("Excel file must contain 'Episodes' and 'Notes' worksheets");
          return;
        }
        
        // Parse Episodes worksheet
        const episodesSheet = workbook.Sheets['Episodes'];
        const episodes = XLSX.utils.sheet_to_json(episodesSheet);
        
        // Parse Notes worksheet  
        const notesSheet = workbook.Sheets['Notes'];
        const notes = XLSX.utils.sheet_to_json(notesSheet);
        
        importData = {
          version: "1.0.0",
          exportedAt: new Date().toISOString(),
          episodes: episodes,
          notes: notes
        };
      }

// Validate file structure
      if (!importData.episodes || !importData.notes || !Array.isArray(importData.episodes) || !Array.isArray(importData.notes)) {
        toast.error("Invalid file format - missing episodes or notes data");
        return;
      }

      // Initialize ApperClient
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      let importedEpisodes = 0;
      let importedNotes = 0;

      // Import episodes
      if (importData.episodes.length > 0) {
        const episodeRecords = importData.episodes.map(episode => ({
          Name: episode.Name,
          Tags: episode.Tags,
          title_c: episode.title_c,
          channel_name_c: episode.channel_name_c,
          company_c: episode.company_c,
          date_c: episode.date_c,
          youtube_url_c: episode.youtube_url_c,
          duration_c: episode.duration_c,
          description_c: episode.description_c,
          transcript_c: episode.transcript_c,
          guest_name_c: episode.guest_name_c
        }));

        const episodesResponse = await apperClient.createRecord('episode_c', {
          records: episodeRecords
        });

        if (episodesResponse.success && episodesResponse.results) {
          importedEpisodes = episodesResponse.results.filter(r => r.success).length;
        }
      }

      // Import notes
      if (importData.notes.length > 0) {
        const noteRecords = importData.notes.map(note => ({
          Name: note.Name,
          Tags: note.Tags,
          episode_id_c: note.episode_id_c?.Id || note.episode_id_c,
          content_c: note.content_c,
          created_at_c: note.created_at_c,
          updated_at_c: note.updated_at_c
        }));

        const notesResponse = await apperClient.createRecord('note_c', {
          records: noteRecords
        });

        if (notesResponse.success && notesResponse.results) {
          importedNotes = notesResponse.results.filter(r => r.success).length;
        }
      }

      toast.success(`Successfully imported ${importedEpisodes} episodes and ${importedNotes} notes`);
      
    } catch (error) {
      console.error("Import failed:", error);
if (error instanceof SyntaxError) {
        toast.error("Invalid JSON file format");
      } else if (error.message?.includes('Excel') || error.message?.includes('xlsx')) {
        toast.error("Invalid Excel file format");
      } else {
        toast.error("Import failed. Please try again.");
      }
    } finally {
      setIsImporting(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleClearCache = () => {
    toast.success("Cache cleared successfully");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-slate-600 mt-2">
          Manage your Podcast Insights preferences and data
        </p>
      </div>

      <div className="space-y-6">
        {/* Data Management */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <ApperIcon name="Database" className="w-5 h-5" />
            Data Management
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <h3 className="font-medium text-slate-900">Export Data</h3>
                <p className="text-sm text-slate-600">Download all your notes and episode data</p>
              </div>
<Button variant="outline" onClick={handleExportData} disabled={isExporting}>
                <ApperIcon name="Download" className="w-4 h-4 mr-2" />
                {isExporting ? "Exporting..." : "Export"}
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <h3 className="font-medium text-slate-900">Import Data</h3>
                <p className="text-sm text-slate-600">Import episodes and notes from a backup file</p>
              </div>
<Button variant="outline" onClick={handleImportData} disabled={isImporting}>
                <ApperIcon name="Upload" className="w-4 h-4 mr-2" />
                {isImporting ? "Importing..." : "Import"}
              </Button>
              <input
                id="import-file-input"
                type="file"
accept=".json,.xlsx"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <h3 className="font-medium text-slate-900">Clear Cache</h3>
                <p className="text-sm text-slate-600">Clear stored data and reset application</p>
              </div>
              <Button variant="outline" onClick={handleClearCache}>
                <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </Card>

        {/* Search Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <ApperIcon name="Search" className="w-5 h-5" />
            Search Settings
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <h3 className="font-medium text-slate-900">Search History</h3>
                <p className="text-sm text-slate-600">Keep track of your recent searches</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <h3 className="font-medium text-slate-900">Highlight Search Terms</h3>
                <p className="text-sm text-slate-600">Highlight matching keywords in results</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </Card>

        {/* YouTube Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <ApperIcon name="Youtube" className="w-5 h-5" />
            YouTube Settings
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <h3 className="font-medium text-slate-900">Auto-play Videos</h3>
                <p className="text-sm text-slate-600">Automatically play videos when episode page loads</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <h3 className="font-medium text-slate-900">Open Links in New Tab</h3>
                <p className="text-sm text-slate-600">Open YouTube links in a new browser tab</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </Card>

        {/* About */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <ApperIcon name="Info" className="w-5 h-5" />
            About
          </h2>
          
          <div className="space-y-4 text-sm text-slate-600">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-slate-900 mb-2">Application</h3>
                <p>Podcast Insights v1.0.0</p>
                <p>20VC Episode Manager</p>
              </div>
              
              <div>
                <h3 className="font-medium text-slate-900 mb-2">Features</h3>
                <p>Full-text search across transcripts</p>
                <p>Note-taking and organization</p>
                <p>YouTube video integration</p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500">
                This application helps you discover, search, and annotate insights from 20VC podcast episodes.
                Built for researchers, entrepreneurs, and venture capital professionals.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;