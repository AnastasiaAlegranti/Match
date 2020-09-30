import {Component} from '@angular/core';
import {StoreService} from '../../services/store.service';
import {SharedService} from '../../services/shared.service';
import {Player} from '../../models/Player';
import {Substitution} from '../../models/Substitution';

@Component({
    selector: 'app-substitutions',
    templateUrl: './substitutions.component.html',
    styleUrls: ['./substitutions.component.scss']
})
export class SubstitutionsComponent {
    static count = 0;
    public emptyPlayer = new Player();
    public substitution: Substitution;
    public substitutionsList$: Substitution[];
    public players$: Player[];
    public benchPlayers$: Player[];
    public lineupPlayers$: Player[];
    public isSubmitted$: boolean;

    constructor(private storeService: StoreService, private sharedService: SharedService) {
        this.subscribeData();
    }

    subscribeData() {
        this.storeService.players$.subscribe(players => {
            this.players$ = players;
        });
        this.storeService.benchPlayers$.subscribe(benchPlayers => {
            this.benchPlayers$ = benchPlayers;
        });
        this.storeService.lineupPlayers$.subscribe(lineupPlayers => {
            this.lineupPlayers$ = lineupPlayers;
        });
        this.storeService.isSubmit$.subscribe(bool => this.isSubmitted$ = bool);
        this.storeService.substitutions$.subscribe(substitutions => this.substitutionsList$ = substitutions);
    }

    async addSubstitution() {
        if (this.lineupPlayers$.length < 11) {
            await this.sharedService.showAlert('Must fill lineup players first.', true, false);
            return;
        }
        //Don't allow to add new substitution if previous one not filled
        if (this.substitutionsList$.length > 0 && (this.substitutionsList$[this.substitutionsList$.length - 1].playerOut.id === 0 || this.substitutionsList$[this.substitutionsList$.length - 1].playerIn.id === 0)) {
            await this.sharedService.showAlert('Must fill players first.', true, false);
            return;
        }
        this.substitutionsList$.push(new Substitution(SubstitutionsComponent.count++, this.emptyPlayer, this.emptyPlayer, false));
        if (this.substitutionsList$.length > 0) {//Enable selecting players
            this.substitutionsList$[this.substitutionsList$.length - 1].enableSelect = false;
        }
    }

    async calculatePlayersLists(index: number) {
        if (this.substitutionsList$[index].subMin < 0 || this.substitutionsList$[index].subMin > 90 || this.substitutionsList$[index].subMin === null) {//Check if minute in range
            await this.sharedService.showAlert('Substitution minute must be  between 0-90 .', true, false);
            return;
        }
        if (index === 0) {//If first substirutution
            this.substitutionsList$[index].benchPlayers = this.benchPlayers$;
            this.substitutionsList$[index].lineupPlayers = this.lineupPlayers$;
            this.substitutionsList$[index].enableSelect = true;
        } else {
            if (this.substitutionsList$[index - 1].subMin >= this.substitutionsList$[index].subMin) {//Check if current substitution minute is larger than previous
                await this.sharedService.showAlert('Current substitution minute must be larger than previous.', true, false);
                return;
            }
            //Slice operation clones array and return reference to a new array
            //Init previous substitution lists to present substitution
            this.substitutionsList$[index].benchPlayers = (this.substitutionsList$.length === 1) ? this.benchPlayers$.slice() : this.substitutionsList$[index - 1].benchPlayers.slice();

            this.substitutionsList$[index].lineupPlayers = (this.substitutionsList$.length === 1) ? this.lineupPlayers$.slice() : this.substitutionsList$[index - 1].lineupPlayers.slice();

            //Insert to present substitution lists added players from previous sustitution, and remove players that left lists from previous
            this.substitutionsList$[index].benchPlayers.push(this.substitutionsList$[index - 1].playerOut);
            this.substitutionsList$[index].benchPlayers = this.substitutionsList$[index].benchPlayers.filter(el => el.id !== this.substitutionsList$[index - 1].playerIn.id);

            this.substitutionsList$[index].lineupPlayers.push(this.substitutionsList$[index - 1].playerIn);
            this.substitutionsList$[index].lineupPlayers = this.substitutionsList$[index].lineupPlayers.filter(el => el.id !== this.substitutionsList$[index - 1].playerOut.id);
            this.substitutionsList$[index].enableSelect = true;//Enable select players
        }
    }

    initPlayerToSubstitution(player: Player, index: number, swInOut: number) {
        swInOut === 1 ? this.substitutionsList$[index].playerOut = player : this.substitutionsList$[index].playerIn = player;
        this.storeService.updateSubstitutions(this.substitutionsList$);
    }


}
