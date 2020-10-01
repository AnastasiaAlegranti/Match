import {Component, OnInit} from '@angular/core';
import {MatchService} from '../../services/match.service';
import {StoreService} from '../../services/store.service';
import {IFormationType} from '../../interfaces/IFormationType';
import {Player} from '../../models/Player';
import {Rows} from '../../models/Rows';

@Component({
    selector: 'app-lineup',
    templateUrl: './line-up.component.html',
    styleUrls: ['./line-up.component.scss']
})

export class LineUpComponent implements OnInit {
    public formationTypesList: IFormationType[];
    public selectedFormationType: IFormationType;
    public emptyPlayer = new Player();
    public rows: Rows;
    public playerInReplaceMode: Player;
    public players$: Player[];
    public benchPlayers$: Player[];
    public lineupPlayers$: Player[];
    public disableSwitchPlayer$: boolean;

    constructor(private matchService: MatchService, private storeService: StoreService) {
        this.subscribePlayers();
    }

    ngOnInit(): void {
        this.rows = new Rows();
        this.selectedFormationType = {id: 2, name: '4-3-3'};
        this.initRows();//Arrange lineup on field
        this.getFormationTypes();
    }

    subscribePlayers() {
        this.storeService.players$.subscribe(players => {
            this.players$ = players;
        });
        this.storeService.benchPlayers$.subscribe(benchPlayers => {
            this.benchPlayers$ = benchPlayers;
        });
        this.storeService.lineupPlayers$.subscribe(lineupPlayers => {
            this.lineupPlayers$ = lineupPlayers;
        });
        this.storeService.isSubmit$.subscribe(submit => {
            if (!submit) {//Reset lineup rows after all data submitted
                this.selectedFormationType = {id: 2, name: '4-3-3'};
                this.initRows();
            }
        });
        this.storeService.substitutions$.subscribe(subs => {
            this.disableSwitchPlayer$ = subs.length === 0 ? false : true;
        });
    }

    getFormationTypes() {
        this.formationTypesList = this.matchService.getFormationTypes();
    }

    initRows() {
        if (this.players$) {// Reset bench players on every formation select
            this.storeService.updateBenchPlayers(this.players$);
            this.storeService.updateLineupPlayers([]);
        }
        const templeRows = new Rows([], [], [], [], [], [], []);
        switch (this.selectedFormationType.id) {
            case 1: // 4-4-2
                this.initializePlayers(templeRows.attackers, 2);
                this.initializePlayers(templeRows.midFielders, 4);
                this.initializePlayers(templeRows.defenders, 4);
                break;
            case 2: // 4-3-3
                this.initializePlayers(templeRows.attackers, 1);
                this.initializePlayers(templeRows.attackersSecondRow, 2);
                this.initializePlayers(templeRows.midFielders, 2);
                this.initializePlayers(templeRows.midFieldersSecondRow, 1);
                this.initializePlayers(templeRows.defenders, 4);
                break;
            case 3: // 5-3-2
                this.initializePlayers(templeRows.attackers, 2);
                this.initializePlayers(templeRows.midFielders, 1);
                this.initializePlayers(templeRows.midFieldersSecondRow, 2);
                this.initializePlayers(templeRows.defenders, 2);
                this.initializePlayers(templeRows.defendersSecondRow, 3);
                break;
            default: // 4-3-3
                this.initializePlayers(templeRows.attackers, 1);
                this.initializePlayers(templeRows.attackersSecondRow, 2);
                this.initializePlayers(templeRows.midFielders, 2);
                this.initializePlayers(templeRows.midFieldersSecondRow, 1);
                this.initializePlayers(templeRows.defenders, 4);
                break;
        }
        this.initializePlayers(templeRows.goalKippers, 1);
        this.rows = templeRows;
        this.storeService.updateFormation(this.selectedFormationType.name);
    }

    initializePlayers(array: Player[], playerNumber: number) {
        for (let i = 0; i < playerNumber; i++) {
            array.push(new Player());
        }
    }

    enterReplacePlayerMode(player) {
        if (this.disableSwitchPlayer$) {//Don't allow switch players if substitution filled
            return;
        }
        if (player) {
            this.playerInReplaceMode = player !== this.playerInReplaceMode ?
                player : null;
        }
    }

    switchPlayers(array: Player[], i: number) {
        if (!this.playerInReplaceMode) {
            return;
        }
        if (array[i].id !== 0) {
            this.benchPlayers$.push(array[i]);
        }
        this.benchPlayers$ = this.benchPlayers$.filter(el => el.id !== this.playerInReplaceMode.id);
        this.lineupPlayers$ = this.lineupPlayers$.filter(el => el.id !== array[i].id);
        this.lineupPlayers$.push(this.playerInReplaceMode);
        this.storeService.updateBenchPlayers(this.benchPlayers$);
        this.storeService.updateLineupPlayers(this.lineupPlayers$);
        array[i] = this.playerInReplaceMode; // Update object reference in html
        this.playerInReplaceMode = null; // Reset player in replace mode
    }
}
