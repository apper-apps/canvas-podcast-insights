import notesData from "@/services/mockData/notes.json";

class NotesService {
  static notes = [...notesData];

  static async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 250));
    return [...this.notes];
  }

  static async getById(id) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const note = this.notes.find(n => n.Id === id);
    if (!note) {
      throw new Error(`Note with ID ${id} not found`);
    }
    
    return { ...note };
  }

  static async getByEpisodeId(episodeId) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return this.notes.filter(note => note.episodeId === episodeId);
  }

  static async create(noteData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newNote = {
      Id: Math.max(...this.notes.map(n => n.Id), 0) + 1,
      ...noteData,
      createdAt: noteData.createdAt || new Date().toISOString(),
      updatedAt: noteData.updatedAt || new Date().toISOString()
    };
    
    this.notes.push(newNote);
    return { ...newNote };
  }

  static async update(id, updateData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const index = this.notes.findIndex(n => n.Id === id);
    if (index === -1) {
      throw new Error(`Note with ID ${id} not found`);
    }
    
    this.notes[index] = { 
      ...this.notes[index], 
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    return { ...this.notes[index] };
  }

  static async delete(id) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = this.notes.findIndex(n => n.Id === id);
    if (index === -1) {
      throw new Error(`Note with ID ${id} not found`);
    }
    
    const deletedNote = { ...this.notes[index] };
    this.notes.splice(index, 1);
    return deletedNote;
  }

  static async search(query) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!query || !query.trim()) {
      return [];
    }
    
    const searchTerm = query.toLowerCase();
    return this.notes.filter(note => 
      note.content.toLowerCase().includes(searchTerm)
    );
  }
}

export default NotesService;