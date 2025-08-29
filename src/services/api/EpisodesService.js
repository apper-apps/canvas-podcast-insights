import { toast } from "react-toastify";
// Sample data for testing - comprehensive podcast episodes with all required fields
const SAMPLE_EPISODES = [
  {
    Id: 11,
    Name: "E-commerce Evolution and Social Commerce",
    title_c: "E-commerce Evolution and Social Commerce with Rachel Martinez",
    channel_name_c: "20VC",
    channelid_c: "UC20VC_ECOMMERCE",
    videoid_c: "yZa890BcD456",
    company_c: "SocialShop Analytics",
    publishdate_c: "2024-02-12",
    youtube_url_c: "https://www.youtube.com/watch?v=yZa890BcD456",
    duration_c: "46",
    description_c: "Rachel Martinez explores the convergence of social media and e-commerce, discussing live shopping trends, influencer marketing, and how brands are adapting to social commerce platforms.",
    transcript_c: "Today we're exploring social commerce with Rachel Martinez, who has been tracking e-commerce trends for over a decade. Rachel, how is social media changing the shopping experience?...",
    guest_name_c: "Rachel Martinez",
    likes_c: 1654,
    view_c: 32178,
    thumbnail_c: "https://img.youtube.com/vi/yZa890BcD456/maxresdefault.jpg",
    Tags: "E-commerce,Social Commerce,Digital Marketing"
  },
  {
    Id: 12,
    Name: "Quantum Computing and Its Business Applications",
    title_c: "Quantum Computing and Its Business Applications with Dr. Thomas Lee",
    channel_name_c: "20VC",
    channelid_c: "UC20VC_QUANTUM",
    videoid_c: "eFg123HiJ789",
    company_c: "Quantum Solutions Inc",
    publishdate_c: "2024-02-08",
    youtube_url_c: "https://www.youtube.com/watch?v=eFg123HiJ789",
    duration_c: "51",
    description_c: "Dr. Thomas Lee demystifies quantum computing, discussing practical applications in cryptography, optimization, and machine learning, and when businesses should start preparing for quantum technologies.",
    transcript_c: "We're joined by Dr. Thomas Lee, a quantum computing researcher and entrepreneur. Thomas, quantum computing sounds like science fiction to many people. How close are we to practical applications?...",
    guest_name_c: "Dr. Thomas Lee",
    likes_c: 2891,
    view_c: 54326,
    thumbnail_c: "https://img.youtube.com/vi/eFg123HiJ789/maxresdefault.jpg",
Tags: "Quantum Computing,Technology,Innovation"
  },
  {
    Id: 13,
    Name: "20VC with Harry Stebbings",
    title_c: "20VC with Harry Stebbings",
    channel_name_c: "20VC with Harry Stebbings",
    channelid_c: "UC20VC_HARRY_STEBBINGS",
    videoid_c: "4lFDEWFzHVk",
    company_c: "20VC",
    publishdate_c: "2024-07-24",
    youtube_url_c: "https://www.youtube.com/watch?v=4lFDEWFzHVk",
    duration_c: "45",
    description_c: "This idea that oh wo is me I can't raise a third fund I've never returned any capital toughing luck right almost everything about a big fund is good for...",
    transcript_c: "This idea that oh wo is me I can't raise a third fund I've never returned any capital toughing luck right almost everything about a big fund is good for...",
    guest_name_c: "Harry Stebbings",
    likes_c: 57,
    view_c: 2149,
    thumbnail_c: "https://i9.ytimg.com/vi/4lFDEWFzHVk/hqdefault_custom_2.jpg?sqp=CNC9isQG-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLD3oBbUWm1_oksnfz1HSR7sftFHJw",
    Tags: "Venture Capital,Funding,Startups"
  }
];
class EpisodesService {
  static apperClient = null;

  static initializeClient() {
    if (!this.apperClient) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
    return this.apperClient;
  }

  static async getAll() {
    try {
      const client = this.initializeClient();
      
      const params = {
fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "title_c" } },
          { field: { Name: "channel_name_c" } },
          { field: { Name: "channelid_c" } },
          { field: { Name: "videoid_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "publishdate_c" } },
          { field: { Name: "youtube_url_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "transcript_c" } },
          { field: { Name: "guest_name_c" } },
          { field: { Name: "likes_c" } },
          { field: { Name: "view_c" } },
          { field: { Name: "thumbnail_c" } }
        ],
        orderBy: [
          {
fieldName: "publishdate_c",
            sorttype: "DESC"
          }
        ]
      };

      const response = await client.fetchRecords("episode_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching episodes:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error fetching episodes:", error);
        toast.error("Failed to load episodes");
      }
      return [];
    }
  }

  static async getById(id) {
    try {
      const client = this.initializeClient();
      
      const params = {
fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "title_c" } },
          { field: { Name: "channel_name_c" } },
          { field: { Name: "channelid_c" } },
          { field: { Name: "videoid_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "publishdate_c" } },
          { field: { Name: "youtube_url_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "transcript_c" } },
          { field: { Name: "guest_name_c" } },
          { field: { Name: "likes_c" } },
          { field: { Name: "view_c" } },
          { field: { Name: "thumbnail_c" } }
        ]
      };

      const response = await client.getRecordById("episode_c", id, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching episode with ID ${id}:`, error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error fetching episode:", error);
        toast.error("Failed to load episode");
      }
      return null;
    }
  }

// Helper function to validate URL format
  static isValidUrl(urlString) {
    if (!urlString || typeof urlString !== 'string' || urlString.trim() === '') {
      return false;
    }
    
    try {
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (error) {
      return false;
    }
  }

static async create(episodeData) {
    try {
      const client = this.initializeClient();
      
      // Support both single record and array of records for bulk import
      const recordsArray = Array.isArray(episodeData) ? episodeData : [episodeData];
      
      // Only include Updateable fields for each record
const params = {
        records: recordsArray.map(data => {
const record = {
            Name: data.Name || data.title_c || data.title || data.Title || "",
            Tags: data.Tags || "",
            title_c: data.title_c || data.title || data.Title || "",
            channel_name_c: data.channel_name_c || data.channel_name || data.channel || data.Channel || "",
            channelid_c: data.channelid_c || data.channelid || data.ChannelID || "",
            videoid_c: data.videoid_c || data.videoid || data.VideoID || "",
            company_c: data.company_c || data.company || data.Company || "",
            publishdate_c: data.publishdate_c || data.publishdate || data.PublishDate || data.date_c || data.date || data.Date || new Date().toISOString().split('T')[0],
            duration_c: data.duration_c || data.duration || data.Duration || "",
            description_c: data.description_c || data.description || data.Description || "",
            transcript_c: data.transcript_c || data.transcript || data.Transcript || "",
            guest_name_c: data.guest_name_c || data.guest_name || data.guest || data.Guest || "",
            likes_c: parseInt(data.likes_c || data.likes || data.Likes || 0) || 0,
            view_c: parseInt(data.view_c || data.view || data.View || data.views || data.Views || 0) || 0,
thumbnail_c: data.thumbnail_c || data.thumbnail || data.Thumbnail || ""
          };
          
          // Only include youtube_url_c if it's a valid URL with proper null checks
          const urlValue = data.youtube_url_c || data.youtube_url || data.url || data.URL || "";
          if (urlValue && typeof urlValue === 'string' && urlValue.trim() !== '') {
            try {
              if (this.isValidUrl(urlValue)) {
                record.youtube_url_c = urlValue;
              }
            } catch (error) {
              console.error('Error validating URL:', error);
              // Don't include invalid URLs
            }
          }
          
          return record;
        })
      };

      const response = await client.createRecord("episode_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
if (failedRecords.length > 0) {
          console.error(`Failed to create episodes ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          // For bulk imports, show summary instead of individual errors
          if (recordsArray.length > 1) {
            toast.error(`Failed to import ${failedRecords.length} out of ${recordsArray.length} episodes`);
          } else {
            failedRecords.forEach(record => {
              record.errors?.forEach(error => {
                toast.error(`${error.fieldLabel}: ${error}`);
              });
              if (record.message) toast.error(record.message);
            });
          }
        }
        
        if (successfulRecords.length > 0) {
          // Show appropriate success message based on single vs bulk import
          if (recordsArray.length > 1) {
            toast.success(`Successfully imported ${successfulRecords.length} episodes`);
          } else {
            toast.success("Episode created successfully");
          }
          
          // Return single record for single import, array for bulk import
          return recordsArray.length === 1 ? successfulRecords[0].data : successfulRecords.map(r => r.data);
        }
      }

      return recordsArray.length === 1 ? null : [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating episode:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error creating episode:", error);
        toast.error("Failed to create episode");
      }
      return null;
    }
  }

  static async update(id, updateData) {
    try {
      const client = this.initializeClient();
      
      // Only include Updateable fields plus Id
      const params = {
        records: [{
Id: id,
Name: updateData.Name,
          Tags: updateData.Tags,
          title_c: updateData.title_c,
          channel_name_c: updateData.channel_name_c,
          channelid_c: updateData.channelid_c,
          videoid_c: updateData.videoid_c,
          company_c: updateData.company_c,
          publishdate_c: updateData.publishdate_c,
          duration_c: updateData.duration_c,
          description_c: updateData.description_c,
          transcript_c: updateData.transcript_c,
          guest_name_c: updateData.guest_name_c,
          likes_c: updateData.likes_c,
          view_c: updateData.view_c,
          thumbnail_c: updateData.thumbnail_c
        }]
      };

      const response = await client.updateRecord("episode_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update episodes ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success("Episode updated successfully");
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating episode:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error updating episode:", error);
        toast.error("Failed to update episode");
      }
      return null;
    }
  }

  static async delete(id) {
    try {
      const client = this.initializeClient();
      
      const params = {
        RecordIds: [id]
      };

      const response = await client.deleteRecord("episode_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete episodes ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success("Episode deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting episode:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error deleting episode:", error);
        toast.error("Failed to delete episode");
      }
      return false;
    }
  }
// Initialize with sample data if no episodes exist
  static async initializeSampleData() {
    try {
      const existingData = await this.getAll();
      
      // Only add sample data if table is empty
      if (!existingData || existingData.length === 0) {
        console.log("Initializing episodes table with sample data...");
        
        const sampleRecords = SAMPLE_EPISODES.map(episode => ({
          Name: episode.Name,
          Tags: episode.Tags || "",
          title_c: episode.title_c,
          channel_name_c: episode.channel_name_c,
          channelid_c: episode.channelid_c,
          videoid_c: episode.videoid_c,
          company_c: episode.company_c,
          publishdate_c: episode.publishdate_c,
          youtube_url_c: episode.youtube_url_c,
          duration_c: episode.duration_c,
          description_c: episode.description_c,
          transcript_c: episode.transcript_c,
          guest_name_c: episode.guest_name_c,
          likes_c: episode.likes_c,
          view_c: episode.view_c,
          thumbnail_c: episode.thumbnail_c
        }));

        const response = await this.apperClient.createRecord(this.tableName, {
          records: sampleRecords
        });

        if (response.success) {
          console.log(`Successfully initialized ${sampleRecords.length} sample episodes`);
          return response;
        } else {
          console.error("Failed to initialize sample data:", response.message);
        }
      }
    } catch (error) {
      console.error("Error initializing sample data:", error);
    }
  }
  static async search(query) {
    try {
      if (!query || !query.trim()) {
        return [];
      }

      const client = this.initializeClient();
      
      const params = {
fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "title_c" } },
          { field: { Name: "channel_name_c" } },
          { field: { Name: "channelid_c" } },
          { field: { Name: "videoid_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "publishdate_c" } },
          { field: { Name: "youtube_url_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "transcript_c" } },
          { field: { Name: "guest_name_c" } },
          { field: { Name: "likes_c" } },
          { field: { Name: "view_c" } },
          { field: { Name: "thumbnail_c" } }
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "title_c",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  {
                    fieldName: "channel_name_c",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  {
                    fieldName: "company_c",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  {
                    fieldName: "description_c",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  {
                    fieldName: "transcript_c",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  {
                    fieldName: "guest_name_c",
                    operator: "Contains",
                    values: [query]
                  }
                ],
                operator: "OR"
              }
            ]
          }
        ]
      };

      const response = await client.fetchRecords("episode_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error searching episodes:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error searching episodes:", error);
        toast.error("Search failed");
      }
      return [];
    }
  }
}
export default EpisodesService;