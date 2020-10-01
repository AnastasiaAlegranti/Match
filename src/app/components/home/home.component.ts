import {Component, HostListener} from '@angular/core';
import {StoreService} from '../../services/store.service';
import {SharedService} from '../../services/shared.service';
import {MatchService} from '../../services/match.service';
import {MatchDetailsModel} from '../../models/MatchDetailsModel';
import {Player} from '../../models/Player';
import {Substitution} from '../../models/Substitution';
import {IMatchDataJson} from '../../interfaces/IMatchDataJson';
import {ISubstitution} from '../../interfaces/ISubstitution';
import {Score} from '../../models/Score';
import {Platform} from '@ionic/angular';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    public viewNumber = 1;
    public platformWidth: number = window.innerWidth;
    public isSubmitted$: boolean;
    private matchDetails$: MatchDetailsModel;
    private players$: Player[];
    private benchPlayers$: Player[];
    private lineupPlayers$: Player[];
    private formation$: string;
    private substitutions$: Substitution[];

    @HostListener('window:resize', ['$event'])//For mobile view style
    onResize(event) {
        this.platformWidth = event.target.innerWidth;
        if (this.platformWidth <= 550 && !this.platform.is('mobileweb')) {//Change view number only if not runnind on mobile, because keybord open event resizing innerWidth
            this.viewNumber = 1;
        }
    }

    constructor(private store: StoreService, private sharedService: SharedService, private matchService: MatchService, private platform: Platform) {
        this.subscribeData();
    }

    subscribeData() {
        this.store.isSubmit$.subscribe(bool => this.isSubmitted$ = bool);
        this.store.matchDetails$.subscribe(matchDetails => this.matchDetails$ = matchDetails);
        this.store.players$.subscribe(players => this.players$ = players);
        this.store.benchPlayers$.subscribe(benchPlayers => this.benchPlayers$ = benchPlayers);
        this.store.lineupPlayers$.subscribe(lineupPlayers => this.lineupPlayers$ = lineupPlayers);
        this.store.formation$.subscribe(formation => this.formation$ = formation);
        this.store.substitutions$.subscribe(substitutions => this.substitutions$ = substitutions);
    }

    async onSubmit() {
        this.store.updateIsSubmitted(true);//For require css in missing fields
        if (!await this.checkMatchDetails()) {//Show message to user if missing data
            return;
        }
        if (!await this.checkLineup()) {
            return;
        }
        if (!await this.checkSubstitutions()) {
            return;
        }
        //Fill matchDataJson to the server:
        let subs: ISubstitution[] = this.substitutions$.map(sub => {
            return {id: sub.id, playerIn: sub.playerIn.id, playerOut: sub.playerOut.id, subMin: sub.subMin};
        });
        let lineup: number[] = this.lineupPlayers$.map(player => {
            return player.id;
        });
        let bench: number[] = this.benchPlayers$.map(player => {
            return player.id;
        });
        let matchDataJson: IMatchDataJson = {
            matchMetadata: this.matchDetails$,
            selectedFormation: this.formation$,
            players: {
                allPlayers: this.players$,
                lineup: lineup,
                bench: bench,
            },
            subs: subs
        };
        await this.matchService.submitMatch(matchDataJson);
        this.resetAllData();//Reset all data for next match
    }


    async checkSubstitutions(): Promise<boolean> {
        if (this.substitutions$.length === 0) {
            await this.sharedService.showAlert('Must fill substitutions', true, false);
            this.viewNumber = 3;
            return false;
        }
        if (this.substitutions$[this.substitutions$.length - 1].subMin === null || this.substitutions$[this.substitutions$.length - 1].playerIn.id === 0 || this.substitutions$[this.substitutions$.length - 1].playerOut.id === 0) {
            await this.sharedService.showAlert('Must fill all substitution details.', true, false);
            this.viewNumber = 3;
            return false;
        }
        return true;
    }

    async checkMatchDetails(): Promise<boolean> {
        if (!this.matchDetails$.rivelName || this.matchDetails$.rivelName === '') {
            await this.sharedService.showAlert('Must fill rival name', true, false);
            this.viewNumber = 1;//If mobile => show details view
            return false;
        }
        if (this.matchDetails$.score.myTeam === null || this.matchDetails$.score.rival === null) {
            await this.sharedService.showAlert('Must fill score', true, false);
            this.viewNumber = 1;
            return false;
        }
        if (!this.matchDetails$.matchLocation) {
            await this.sharedService.showAlert('Must fill match location', true, false);
            this.viewNumber = 1;
            return false;
        }
        return true;
    }

    async checkLineup(): Promise<boolean> {
        if (this.lineupPlayers$.length !== 11) {
            await this.sharedService.showAlert('Must fill lineup players', true, false);
            this.viewNumber = 2;//If mobile => show lineup view
            return false;
        }
        return true;
    }

    resetAllData() {
        this.store.updateIsSubmitted(false);
        this.store.updateMatchDetails(new MatchDetailsModel('', '', new Score(), ''));
        this.store.updateBenchPlayers(this.players$);
        this.store.updateLineupPlayers([]);
        this.store.updateSubstitutions([]);
    }
}

