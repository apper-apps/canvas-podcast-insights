import { toast } from "react-toastify";

class NotesService {
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
          { field: { Name: "episode_id_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
        ],
        orderBy: [
          {
            fieldName: "created_at_c",
            sorttype: "DESC"
          }
        ]
      };

      const response = await client.fetchRecords("note_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching notes:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error fetching notes:", error);
        toast.error("Failed to load notes");
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
          { field: { Name: "episode_id_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
        ]
      };

      const response = await client.getRecordById("note_c", id, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching note with ID ${id}:`, error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error fetching note:", error);
        toast.error("Failed to load note");
      }
      return null;
    }
  }

  static async getByEpisodeId(episodeId) {
    try {
      const client = this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "episode_id_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
        ],
        where: [
          {
            FieldName: "episode_id_c",
            Operator: "EqualTo",
            Values: [episodeId.toString()]
          }
        ]
      };

      const response = await client.fetchRecords("note_c", params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching notes by episode:", error?.response?.data?.message);
      } else {
        console.error("Error fetching notes by episode:", error);
      }
      return [];
    }
  }

  static async create(noteData) {
    try {
      const client = this.initializeClient();
      
      // Only include Updateable fields
      const params = {
records: [{
          Name: noteData.Name || "",
          Tags: noteData.Tags || "",
          episode_id_c: noteData.episode_id_c ? parseInt(noteData.episode_id_c, 10) : null,
          content_c: noteData.content_c || "",
          created_at_c: noteData.created_at_c || new Date().toISOString(),
          updated_at_c: noteData.updated_at_c || new Date().toISOString()
        }]
      };

      const response = await client.createRecord("note_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create notes ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Note created successfully");
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating note:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error creating note:", error);
        toast.error("Failed to create note");
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
          episode_id_c: updateData.episode_id_c ? updateData.episode_id_c.toString() : undefined,
          content_c: updateData.content_c,
          created_at_c: updateData.created_at_c,
          updated_at_c: updateData.updated_at_c || new Date().toISOString()
        }]
      };

      const response = await client.updateRecord("note_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update notes ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success("Note updated successfully");
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating note:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error updating note:", error);
        toast.error("Failed to update note");
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

      const response = await client.deleteRecord("note_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete notes ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success("Note deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting note:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error deleting note:", error);
        toast.error("Failed to delete note");
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
          { field: { Name: "episode_id_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
        ],
        where: [
          {
            FieldName: "content_c",
            Operator: "Contains",
            Values: [query]
          }
        ]
      };

      const response = await client.fetchRecords("note_c", params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error searching notes:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error searching notes:", error);
        toast.error("Search failed");
      }
      return [];
    }
  }
}

export default NotesService;