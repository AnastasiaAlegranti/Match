import {Component, Input, OnInit} from '@angular/core';
import {Player} from '../../interfaces/matchDataJson';
import {SharedService} from '../../services/shared.service';

@Component({
    selector: 'app-select',
    templateUrl: './select-player.component.html',
    styleUrls: ['./select-player.component.scss'],
})
export class SelectPlayerComponent implements OnInit {
    @Input() selectedPlayer: Player;
    @Input() goalKipperClass: boolean;
    public emptyPlayer = new Player();
    public tempPlayer: Player;
    @Input() players: Player[]; // subscribe
    @Input() selectedPlayers: Player[]; // subscribe
    @Input() unselectedPlayers: Player[]; // subscribe

    public constructor(private sharedService: SharedService) {
    }

    ngOnInit() {
        this.tempPlayer = this.selectedPlayer;
        console.log('tempPlayer', this.tempPlayer);
        console.log('selectedPlayer', this.selectedPlayer);
    }


    public async onSelected() {
        // console.log('onSelected', this.tempPlayer, this.selectedPlayer);
        if (this.selectedPlayers.some(el => el === this.selectedPlayer)) {
            await this.sharedService.showAlert('Can not choose same player twice. ', true, false);
            this.selectedPlayer = this.tempPlayer;
            return;
        }
        if (this.selectedPlayer.id > 0) {
            this.selectedPlayers.push(this.selectedPlayer);
            this.unselectedPlayers = this.unselectedPlayers.filter(el => el.id !== this.selectedPlayer.id);
            if (this.tempPlayer.id > 0) {
                this.unselectedPlayers.push(this.tempPlayer);
                this.selectedPlayers = this.selectedPlayers.filter(el => el.id !== this.tempPlayer.id);
            }
        }
        console.log('selected', this.selectedPlayers);
        console.log('unselected', this.unselectedPlayers);
        this.tempPlayer = this.selectedPlayer;
    }

}
