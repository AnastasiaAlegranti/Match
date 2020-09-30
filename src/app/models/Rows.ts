import {Player} from './Player';

export class Rows {
    public constructor(
        public defenders?: Player [],
        public defendersSecondRow?: Player [],
        public midFielders?: Player [],
        public midFieldersSecondRow?: Player [],
        public attackers?: Player [],
        public attackersSecondRow?: Player [],
        public goalKippers?: Player[]) {
    }
}
