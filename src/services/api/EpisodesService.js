import { toast } from "react-toastify";

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
          { field: { Name: "company_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "youtube_url_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "transcript_c" } },
          { field: { Name: "guest_name_c" } }
        ],
        orderBy: [
          {
            fieldName: "date_c",
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
          { field: { Name: "company_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "youtube_url_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "transcript_c" } },
          { field: { Name: "guest_name_c" } }
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

static async create(episodeData) {
    try {
      const client = this.initializeClient();
      
      // Support both single record and array of records for bulk import
      const recordsArray = Array.isArray(episodeData) ? episodeData : [episodeData];
      
      // Only include Updateable fields for each record
      const params = {
        records: recordsArray.map(data => ({
          Name: data.Name || data.title_c || "",
          Tags: data.Tags || "",
          title_c: data.title_c || "",
          channel_name_c: data.channel_name_c || "",
          company_c: data.company_c || "",
          date_c: data.date_c || new Date().toISOString().split('T')[0],
          youtube_url_c: data.youtube_url_c || "",
          duration_c: data.duration_c || "",
          description_c: data.description_c || "",
          transcript_c: data.transcript_c || "",
          guest_name_c: data.guest_name_c || ""
        }))
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
          company_c: updateData.company_c,
          date_c: updateData.date_c,
          youtube_url_c: updateData.youtube_url_c,
          duration_c: updateData.duration_c,
          description_c: updateData.description_c,
          transcript_c: updateData.transcript_c,
          guest_name_c: updateData.guest_name_c
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
          { field: { Name: "company_c" } },
          { field: { Name: "date_c" } },
          { field: { Name: "youtube_url_c" } },
          { field: { Name: "duration_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "transcript_c" } },
          { field: { Name: "guest_name_c" } }
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