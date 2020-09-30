import {Component, OnInit} from '@angular/core';
import {MatchService} from '../../services/match.service';
import {StoreService} from '../../services/store.service';
import {TeamData} from '../../models/TeamData';
import {MatchDetailsModel} from '../../models/MatchDetailsModel';

class MatchDetails {
}

@Component({
    selector: 'app-match-details',
    templateUrl: './match-details.component.html',
    styleUrls: ['./match-details.component.scss']
})
export class MatchDetailsComponent implements OnInit {
    public isSubmitted$: boolean;
    public matchDetails$: MatchDetailsModel;
    public teamData: TeamData;
    public rivalImageSrc: string;
    public rivalImage: any = [];

    constructor(private matchService: MatchService, private storeService: StoreService) {
        this.storeService.isSubmit$.subscribe(bool => this.isSubmitted$ = bool);
        this.storeService.matchDetails$.subscribe(matchDetails => this.matchDetails$ = matchDetails);
    }

    ngOnInit(): void {
        this.teamData = this.matchService.getMyTeamData();
    }

    onImageSelected(evt) {
        let file = evt.target.files[0];
        this.rivalImage.fileName = file.name;
        if (file) {
            // Convert file to base64textString for sending to server
            let reader = new FileReader();
            reader.onload = ((event: any) => {
                this.rivalImage.base64textString = btoa(event.target.result);
                this.matchDetails$.rivelLogoImage = this.rivalImage.base64textString;
                this.updateMatchDetails();
            });
            reader.readAsBinaryString(file);

            // For showing image  to user
            let readerForShowImg = new FileReader();
            readerForShowImg.onload = ((event: any) => this.rivalImageSrc = event.target.result);
            readerForShowImg.readAsDataURL(evt.target.files[0]);
        }
        this.matchDetails$.rivelLogoImage = this.rivalImage.base64textString;
        this.updateMatchDetails();
    }

    updateMatchDetails() {
        this.storeService.updateMatchDetails(this.matchDetails$);
    }
}
