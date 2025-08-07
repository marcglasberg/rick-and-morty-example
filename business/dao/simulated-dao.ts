import { Card } from '../state/card';
import { CardList } from '../state/card-list';
import { Dao } from './dao';

export class SimulatedDao extends Dao {
    async loadCards({ page = 1 }: { page?: number }): Promise<{ cards: CardList, totalCount: number, totalPages: number }> {
        // For a simulated DAO, we return mock Rick and Morty character data
        const mockCards = [
            new Card(
                '1',
                'Rick Sanchez',
                'Alive',
                'Human',
                'Male',
                'Earth (C-137)',
                'Citadel of Ricks',
                51,
                'https://rickandmortyapi.com/api/character/avatar/1.jpeg'
            ),
            new Card(
                '2',
                'Morty Smith',
                'Alive',
                'Human',
                'Male',
                'Earth (C-137)',
                'Citadel of Ricks',
                51,
                'https://rickandmortyapi.com/api/character/avatar/2.jpeg'
            ),
            new Card(
                '3',
                'Summer Smith',
                'Alive',
                'Human',
                'Female',
                'Earth (Replacement Dimension)',
                'Earth (Replacement Dimension)',
                42,
                'https://rickandmortyapi.com/api/character/avatar/3.jpeg'
            ),
            new Card(
                '4',
                'Beth Smith',
                'Alive',
                'Human',
                'Female',
                'Earth (Replacement Dimension)',
                'Earth (Replacement Dimension)',
                42,
                'https://rickandmortyapi.com/api/character/avatar/4.jpeg'
            ),
            new Card(
                '5',
                'Jerry Smith',
                'Alive',
                'Human',
                'Male',
                'Earth (Replacement Dimension)',
                'Earth (Replacement Dimension)',
                36,
                'https://rickandmortyapi.com/api/character/avatar/5.jpeg'
            ),
            new Card(
                '6',
                'Abadango Cluster Princess',
                'Alive',
                'Alien',
                'Female',
                'Abadango',
                'Abadango',
                1,
                'https://rickandmortyapi.com/api/character/avatar/6.jpeg'
            ),
            new Card(
                '7',
                'Abradolf Lincler',
                'Unknown',
                'Human',
                'Male',
                'Earth (Replacement Dimension)',
                'Testicle Monster Dimension',
                2,
                'https://rickandmortyapi.com/api/character/avatar/7.jpeg'
            ),
            new Card(
                '8',
                'Adjudicator Rick',
                'Dead',
                'Human',
                'Male',
                'Unknown',
                'Citadel of Ricks',
                1,
                'https://rickandmortyapi.com/api/character/avatar/8.jpeg'
            ),
            new Card(
                '9',
                'Agency Director',
                'Dead',
                'Human',
                'Male',
                'Earth (Replacement Dimension)',
                'Earth (Replacement Dimension)',
                1,
                'https://rickandmortyapi.com/api/character/avatar/9.jpeg'
            ),
            new Card(
                '10',
                'Alan Rails',
                'Dead',
                'Human',
                'Male',
                'Unknown',
                'Worldender\'s lair',
                1,
                'https://rickandmortyapi.com/api/character/avatar/10.jpeg'
            ),
            new Card(
                '11',
                'Albert Einstein',
                'Dead',
                'Human',
                'Male',
                'Earth (C-137)',
                'Earth (C-137)',
                1,
                'https://rickandmortyapi.com/api/character/avatar/11.jpeg'
            ),
            new Card(
                '12',
                'Alexander',
                'Dead',
                'Human',
                'Male',
                'Earth (C-137)',
                'Anatomy Park',
                1,
                'https://rickandmortyapi.com/api/character/avatar/12.jpeg'
            ),
            new Card(
                '13',
                'Alien Googah',
                'Unknown',
                'Alien',
                'Unknown',
                'Unknown',
                'Earth (Replacement Dimension)',
                1,
                'https://rickandmortyapi.com/api/character/avatar/13.jpeg'
            ),
            new Card(
                '14',
                'Alien Morty',
                'Unknown',
                'Alien',
                'Male',
                'Unknown',
                'Citadel of Ricks',
                1,
                'https://rickandmortyapi.com/api/character/avatar/14.jpeg'
            ),
            new Card(
                '15',
                'Alien Rick',
                'Unknown',
                'Alien',
                'Male',
                'Unknown',
                'Citadel of Ricks',
                1,
                'https://rickandmortyapi.com/api/character/avatar/15.jpeg'
            ),
            new Card(
                '16',
                'Amish Cyborg',
                'Dead',
                'Alien',
                'Male',
                'Unknown',
                'Earth (Replacement Dimension)',
                1,
                'https://rickandmortyapi.com/api/character/avatar/16.jpeg'
            ),
            new Card(
                '17',
                'Annie',
                'Alive',
                'Human',
                'Female',
                'Earth (C-137)',
                'Anatomy Park',
                1,
                'https://rickandmortyapi.com/api/character/avatar/17.jpeg'
            ),
            new Card(
                '18',
                'Antenna Morty',
                'Alive',
                'Human',
                'Male',
                'Unknown',
                'Citadel of Ricks',
                5,
                'https://rickandmortyapi.com/api/character/avatar/18.jpeg'
            ),
            new Card(
                '19',
                'Antenna Rick',
                'Unknown',
                'Human',
                'Male',
                'Unknown',
                'Unknown',
                1,
                'https://rickandmortyapi.com/api/character/avatar/19.jpeg'
            ),
            new Card(
                '20',
                'Ants in my Eyes Johnson',
                'Unknown',
                'Human',
                'Male',
                'Unknown',
                'Interdimensional Cable',
                1,
                'https://rickandmortyapi.com/api/character/avatar/20.jpeg'
            ),
            new Card(
                '21',
                'Aqua Morty',
                'Unknown',
                'Humanoid',
                'Male',
                'Unknown',
                'Citadel of Ricks',
                1,
                'https://rickandmortyapi.com/api/character/avatar/21.jpeg'
            ),
            new Card(
                '22',
                'Aqua Rick',
                'Unknown',
                'Humanoid',
                'Male',
                'Unknown',
                'Citadel of Ricks',
                1,
                'https://rickandmortyapi.com/api/character/avatar/22.jpeg'
            ),
            new Card(
                '23',
                'Arcade Alien',
                'Unknown',
                'Alien',
                'Male',
                'Unknown',
                'Immortality Field Resort',
                1,
                'https://rickandmortyapi.com/api/character/avatar/23.jpeg'
            ),
            new Card(
                '24',
                'Armagheadon',
                'Alive',
                'Alien',
                'Male',
                'Unknown',
                'Signus 5 Expanse',
                1,
                'https://rickandmortyapi.com/api/character/avatar/24.jpeg'
            ),
            new Card(
                '25',
                'Armothy',
                'Dead',
                'Unknown',
                'Male',
                'Post-Apocalyptic Earth',
                'Post-Apocalyptic Earth',
                1,
                'https://rickandmortyapi.com/api/character/avatar/25.jpeg'
            )];

        // Calculate items per page (for pagination simulation)
        const itemsPerPage = 20; // Same as Rick & Morty API default
        const totalItems = mockCards.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        // Calculate start and end indices for the requested page
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

        // Get the cards for the current page
        const paginatedCards = mockCards.slice(startIndex, endIndex);

        return {
            cards: new CardList(paginatedCards),
            totalCount: totalItems, // Total count of all mock cards
            totalPages: totalPages
        };
    }
}