import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Player} from '../interfaces/matchDataJson';
import {MatchService} from './match.service';

@Injectable({
    providedIn: 'root'
})
export class PlayersStateService {
    // private playersSource: BehaviorSubject<Player[]> = new BehaviorSubject([]);
    // public players$: Observable<Player[]> = this.playersSource.asObservable();

    // private lineupPlayersSource: BehaviorSubject<Player[]> = new BehaviorSubject([]);
    // public selectedPlayers: Observable<Player[]> = this.lineupPlayersSource.asObservable();
    //
    // private benchPlayersSource: BehaviorSubject<Player[]> = new BehaviorSubject([]);
    // public unSelectedPlayers: Observable<Player[]> = this.lineupPlayersSource.asObservable();


    private playersSource: BehaviorSubject<Player[]>;
    public players$: Observable<Player[]>;

    private lineupPlayersSource: BehaviorSubject<Player[]>;
    public lineupPlayers$: Observable<Player[]>;

    private benchPlayersSource: BehaviorSubject<Player[]>;
    public benchPlayers$: Observable<Player[]>;


    constructor(private matchService: MatchService) {
        this.initPlayerList();
    }

    async initPlayerList() {

        console.log('constructor');


        let players = this.matchService.getPlayersList();
        console.log('initPlayerList', players);

        this.playersSource = new BehaviorSubject(players);
        this.players$ = this.playersSource.asObservable();

        this.benchPlayersSource = new BehaviorSubject(players);
        this.benchPlayers$ = this.benchPlayersSource.asObservable();

        this.lineupPlayersSource = new BehaviorSubject([]);
        this.lineupPlayers$ = this.lineupPlayersSource.asObservable();


        this.updatePlayers(players);
        this.updateBenchPlayers(players);
    }

    updatePlayers(players: Player[]) {
        this.playersSource.next(players);
        console.log('updatePlayers', this.playersSource.getValue());
    }

    getPlayersValue(): Player[] {
        console.log('getPlayersValue', this.playersSource.getValue());
        return this.playersSource.getValue();
    }

    updateLineupPlayers(players: Player[]) {
        this.lineupPlayersSource.next(players);
        console.log('updateSelectedPlayers', this.lineupPlayersSource.getValue());
    }

    getSelectedPlayersValue(): Player[] {
        console.log('getSelectedPlayersValue', this.lineupPlayersSource.getValue());
        return this.lineupPlayersSource.getValue();
    }

    updateBenchPlayers(players: Player[]) {
        this.benchPlayersSource.next(players);
        console.log('in updateUnSelectedPlayers', players, this.benchPlayersSource.getValue());
        // this.unSelectedPlayers$.subscribe(el => console.log(' updateUnSelectedPlayers unSelectedPlayers', el));

    }

    getUnSelectedPlayersValue(): Player[] {
        console.log('getUnSelectedPlayersValue', this.benchPlayersSource.getValue());
        return this.benchPlayersSource.getValue();
    }

}
