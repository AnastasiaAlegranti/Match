import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {Player} from '../../interfaces/matchDataJson';

@Component({
    selector: 'app-select-substiution-player',
    templateUrl: './select-substiution-player.component.html',
    styleUrls: ['./select-substiution-player.component.scss'],
})
export class SelectSubstiutionPlayerComponent {
    @Input() isDisable: boolean;
    @Input() availablePlayers: Player[];
    @Output() selectEvent = new EventEmitter<Player>();
    @Input() selectedPlayer: Player;

    onSelect() {
        this.selectEvent.emit(this.selectedPlayer);
    }
}
