/** Represents a single cards. */
export class Card {
  constructor(
    public id: string,
    public title: string,
    public status: string = 'Unknown',
    public species: string = 'Unknown',
    public gender: string = 'Unknown',
    public origin: string = 'Unknown',
    public location: string = 'Unknown',
    public episodeCount: number = 0,
    public imageUrl: string
  ) { }

  getDescriptionItems(): string[] {
    return [
      `Species: ${this.species}`,
      `Status: ${this.status}`,
      `Gender: ${this.gender}`,
      `Origin: ${this.origin}`,
      `Location: ${this.location}`,
      `Appears in ${this.episodeCount} episodes`
    ];
  }
}

