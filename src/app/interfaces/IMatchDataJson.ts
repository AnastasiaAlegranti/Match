import {Score} from '../models/Score';
import {Player} from '../models/Player';
import {ISubstitution} from './ISubstitution';

export interface IMatchDataJson {
    matchMetadata: {
        rivelName: string,
        rivelLogoImage: string
        score: Score,
        matchLocation: string
    };
    selectedFormation: string;
    players: {
        allPlayers: Player[],
        lineup: number [], // id[]
        bench: number[]; // id[]
    };
    subs: ISubstitution[];
}
