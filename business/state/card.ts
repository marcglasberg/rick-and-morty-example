/** Represents a single cards. */
export class Card {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly status: string = 'Unknown',
    public readonly species: string = 'Unknown',
    public readonly gender: string = 'Unknown',
    public readonly origin: string = 'Unknown',
    public readonly location: string = 'Unknown',
    public readonly episodeCount: number = 0,
    public readonly imageUrl: string
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

