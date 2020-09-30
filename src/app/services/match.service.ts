import {Injectable} from '@angular/core';
import {PlayersListMock} from '../mocks/player-list';
import {SharedService} from './shared.service';
import {Player} from '../models/Player';

@Injectable({
    providedIn: 'root'
})
export class MatchService {

    public constructor(private  sharedService: SharedService) {
    }

    getMyTeamData() {
        return {
            teamName: 'Playermaker united',
            logoImage: '../../../assets/images/playermaker.png'
            // logoImage: 'https://images.app.goo.gl/dmik1accCvcnXuGA8',//Return 403 error from localhost, when serve locally
        };
    }

    getFormationTypes() {
        return [{id: 2, name: '4-3-3'}, {id: 1, name: '4-4-2'}, {id: 3, name: '5-3-2'}];
    }

    getPlayersList(): Player[] {
        return PlayersListMock;
    }

    async submitMatch(matchData) {
        await this.sharedService.showAlert('Match data submitted.', true, false);
    }

}

