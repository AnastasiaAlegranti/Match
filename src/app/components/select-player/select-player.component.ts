import {Component, Input, OnInit} from '@angular/core';
import {SharedService} from '../../services/shared.service';
import {StoreService} from '../../services/store.service';
import {Player} from '../../models/Player';

@Component({
    selector: 'app-select',
    templateUrl: './select-player.component.html',
    styleUrls: ['./select-player.component.scss'],
})
export class SelectPlayerComponent implements OnInit {
    @Input() selectedPlayer: Player;
    @Input() goalKipperClass: boolean;
    @Input() isPlayerInReplaceMode: boolean;
    public tempPlayer: Player;
    public emptyPlayer: Player;
    public players$: Player[];
    public benchPlayers$: Player[];
    public lineupPlayers$: Player[];
    public isSubmitted$: boolean;
    public disableSelect: boolean = false;

    public constructor(private sharedService: SharedService, private storeService: StoreService) {
        this.subscribeData();
    }

    ngOnInit() {
        this.tempPlayer = this.selectedPlayer;//For resetting player in lineup if selected one is already exist in lineup and must.
        this.emptyPlayer = new Player();
    }

    subscribeData() {
        this.storeService.players$.subscribe(players =>
            this.players$ = players);
        this.storeService.benchPlayers$.subscribe(unSelectedPlayers => {
            this.benchPlayers$ = unSelectedPlayers;
        });
        this.storeService.lineupPlayers$.subscribe(selectedPlayers => {
            this.lineupPlayers$ = selectedPlayers;
        });
        this.storeService.isSubmit$.subscribe(bool => this.isSubmitted$ = bool);
        this.storeService.substitutions$.subscribe(subs => {
            this.disableSelect = subs.length === 0 ? false : true;
        });
    }

    async onSelected() {
        if (this.lineupPlayers$.some(el => el === this.selectedPlayer)) {//If selected player already exist in the lineup
            await this.sharedService.showAlert('Can not choose same player twice. ', true, false);
            this.selectedPlayer = this.tempPlayer;
            return;
        }
        if (this.selectedPlayer.id > 0) {//If player selected=>push to lineup and remove from the bench
            this.benchPlayers$ = this.benchPlayers$.filter(el => el.id !== this.selectedPlayer.id);
            this.lineupPlayers$.push(this.selectedPlayer);
        }
        if (this.tempPlayer.id > 0) {//If switch players=> push previous player to bench and remove from lineup
            this.benchPlayers$.push(this.tempPlayer);
            this.lineupPlayers$ = this.lineupPlayers$.filter(el => el.id !== this.tempPlayer.id);
        }
        this.storeService.updateBenchPlayers(this.benchPlayers$);
        this.storeService.updateLineupPlayers(this.lineupPlayers$);
        this.tempPlayer = this.selectedPlayer;//For future check when player will be selected.
    }
}
