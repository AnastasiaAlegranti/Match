import {Component, Input, EventEmitter, Output} from '@angular/core';
import {Player} from '../../models/Player';

@Component({
    selector: 'app-select-substitution-player',
    templateUrl: './select-substitution-player.component.html',
    styleUrls: ['./select-substitution-player.component.scss'],
})
export class SelectSubstitutionPlayerComponent {
    @Input() isDisable: boolean;
    @Input() availablePlayers: Player[];
    @Input() selectedPlayer: Player;
    @Output() selectEvent = new EventEmitter<Player>();

    onSelect() {
        this.selectEvent.emit(this.selectedPlayer);
    }
}
