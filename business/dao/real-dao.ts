import { cacheExchange, fetchExchange } from '@urql/core';
import { UserException } from 'kiss-for-react';
import { Client, createClient, gql } from 'urql';
import { Card } from '../state/card';
import { CardList } from '../state/card-list';
import { Dao } from './dao';

export class RealDao extends Dao {
    private client: Client;

    constructor() {
        super();
        // GraphQL client for Rick and Morty API.
        this.client = createClient({
            url: 'https://rickandmortyapi.com/graphql',
            exchanges: [cacheExchange, fetchExchange]
        });
    }

    async loadCards({ page }: { page: number }): Promise<{ cards: CardList, totalCount: number, totalPages: number }> {
        try {
            const charactersQuery = gql`
                query CharactersQuery($page: Int!) {
                    characters(page: $page) {
                        info {
                            count
                            pages
                        }
                        results {
                            id
                            name
                            status
                            species
                            type
                            gender
                            origin {
                                name
                                dimension
                            }
                            location {
                                name
                                dimension
                            }
                            image
                            episode {
                                name
                                episode
                            }
                        }
                    }
                }
            `;

            // Execute the query with the page parameter
            const result = await this.client.query(charactersQuery, { page }).toPromise();

            if (result.error) {
                throw new UserException('GraphQL error: ' + result.error.message);
            }

            if (!result.data) {
                throw new UserException('No data returned from Rick and Morty API');
            }

            // Map the GraphQL data to Card objects
            const cards = result.data.characters.results.map((character: any) => {

                // Extract character data
                const status = character.status || 'Unknown';
                const species = character.species || 'Unknown';
                const gender = character.gender || 'Unknown';
                const origin = character.origin?.name || 'Unknown';
                const location = character.location?.name || 'Unknown';
                const episodeCount = character.episode?.length || 0;

                return new Card(
                    character.id,
                    character.name,
                    status,
                    species,
                    gender,
                    origin,
                    location,
                    episodeCount,
                    character.image // The API already provides image URLs
                );
            });

            // Get the total count and pages information
            const totalCount = result.data.characters.info.count;
            const totalPages = result.data.characters.info.pages;

            // Return the cards, totalCount and totalPages
            return {
                cards: new CardList(cards),
                totalCount,
                totalPages
            };

        } catch (error) {
            console.error('Error fetching Rick and Morty data:', error);
            throw new UserException('Failed to fetch Rick and Morty data: ' + error);
        }
    }
}

