import episodesData from "@/services/mockData/episodes.json";

class EpisodesService {
  static episodes = [...episodesData];

  static async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.episodes];
  }

  static async getById(id) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const episode = this.episodes.find(ep => ep.Id === id);
    if (!episode) {
      throw new Error(`Episode with ID ${id} not found`);
    }
    
    return { ...episode };
  }

  static async create(episodeData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newEpisode = {
      Id: Math.max(...this.episodes.map(ep => ep.Id)) + 1,
      ...episodeData,
      date: episodeData.date || new Date().toISOString().split('T')[0]
    };
    
    this.episodes.push(newEpisode);
    return { ...newEpisode };
  }

  static async update(id, updateData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const index = this.episodes.findIndex(ep => ep.Id === id);
    if (index === -1) {
      throw new Error(`Episode with ID ${id} not found`);
    }
    
    this.episodes[index] = { ...this.episodes[index], ...updateData };
    return { ...this.episodes[index] };
  }

  static async delete(id) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = this.episodes.findIndex(ep => ep.Id === id);
    if (index === -1) {
      throw new Error(`Episode with ID ${id} not found`);
    }
    
    const deletedEpisode = { ...this.episodes[index] };
    this.episodes.splice(index, 1);
    return deletedEpisode;
  }

  static async search(query) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!query || !query.trim()) {
      return [];
    }
    
    const searchTerm = query.toLowerCase();
    return this.episodes.filter(episode => 
      episode.title.toLowerCase().includes(searchTerm) ||
      episode.guestName.toLowerCase().includes(searchTerm) ||
      (episode.company && episode.company.toLowerCase().includes(searchTerm)) ||
      episode.transcript.toLowerCase().includes(searchTerm) ||
      episode.description.toLowerCase().includes(searchTerm)
    );
  }
}

export default EpisodesService;