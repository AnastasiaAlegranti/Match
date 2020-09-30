import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {MatchService} from './match.service';
import {MatchDetailsModel} from '../models/MatchDetailsModel';
import {Player} from '../models/Player';
import {Substitution} from '../models/Substitution';
import {Score} from '../models/Score';

@Injectable({
    providedIn: 'root'
})
export class StoreService {
    private matchDetailsSource: BehaviorSubject<MatchDetailsModel>;
    public matchDetails$: Observable<MatchDetailsModel>;
    private formationSource: BehaviorSubject<string>;
    public formation$: Observable<string>;
    private playersSource: BehaviorSubject<Player[]>;
    public players$: Observable<Player[]>;
    private lineupPlayersSource: BehaviorSubject<Player[]>;
    public lineupPlayers$: Observable<Player[]>;
    private benchPlayersSource: BehaviorSubject<Player[]>;
    public benchPlayers$: Observable<Player[]>;
    private isSubmitSource: BehaviorSubject<boolean>;
    public isSubmit$: Observable<boolean>;
    private substitutionsSource: BehaviorSubject<Substitution[]>;
    public substitutions$: Observable<Substitution[]>;

    constructor(private matchService: MatchService) {
        this.initAllData();
    }

    async initAllData() {
        this.matchDetailsSource = new BehaviorSubject<MatchDetailsModel>(new MatchDetailsModel('', '', new Score(), ''));
        this.matchDetails$ = this.matchDetailsSource.asObservable();

        this.isSubmitSource = new BehaviorSubject(false);
        this.isSubmit$ = this.isSubmitSource.asObservable();

        this.formationSource = new BehaviorSubject('4-4-2');
        this.formation$ = this.formationSource.asObservable();

        let players = this.matchService.getPlayersList();

        this.playersSource = new BehaviorSubject(players);
        this.players$ = this.playersSource.asObservable();

        this.benchPlayersSource = new BehaviorSubject(players);
        this.benchPlayers$ = this.benchPlayersSource.asObservable();

        this.lineupPlayersSource = new BehaviorSubject([]);
        this.lineupPlayers$ = this.lineupPlayersSource.asObservable();

        this.substitutionsSource = new BehaviorSubject<Substitution[]>([]);
        this.substitutions$ = this.substitutionsSource.asObservable();

        this.updatePlayers(players);
        this.updateBenchPlayers(players);
    }

    updatePlayers(players: Player[]) {
        this.playersSource.next(players);
    }

    updateLineupPlayers(players: Player[]) {
        this.lineupPlayersSource.next(players);
    }

    updateIsSubmitted(bool: boolean) {
        this.isSubmitSource.next(bool);
    }

    updateMatchDetails(matchDetails: MatchDetailsModel) {
        this.matchDetailsSource.next(matchDetails);
    }

    updateFormation(selectedFormation: string) {
        this.formationSource.next(selectedFormation);
    }

    updateSubstitutions(substitutions: Substitution[]) {
        this.substitutionsSource.next(substitutions);
    }

    updateBenchPlayers(players: Player[]) {
        this.benchPlayersSource.next(players);
    }
}
