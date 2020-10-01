import {Player} from './Player';

export class Substitution {
    public constructor(
        public id?: number,
        public playerIn?: Player,
        public playerOut?: Player,
        public disableSelect?: boolean,
        public subMin?: number,
        public lineupPlayers?: Player[],
        public benchPlayers?: Player[]
    ) {
    }
}
