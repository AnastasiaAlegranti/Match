import {Score} from './Score';

export class MatchDetailsModel {
    public constructor(
        public rivelName: string,
        public rivelLogoImage: string,
        public score: Score,
        public matchLocation: string
    ) {
    }
}
