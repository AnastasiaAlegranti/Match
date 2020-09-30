import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {AppComponent} from './components/app/app.component';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HomeComponent} from './components/home/home.component';
import {MatchDetailsComponent} from './components/match-details/match-details.component';
import {LineUpComponent} from './components/line-up/line-up.component';
import {SubstitutionsComponent} from './components/substitutions/substitutions.component';
import {MatSelectModule} from '@angular/material/select';
import {FormsModule} from '@angular/forms';
import {SelectPlayerComponent} from './components/select-player/select-player.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatRadioModule} from '@angular/material/radio';
import {SelectSubstitutionPlayerComponent} from './components/select-substitution-player/select-substitution-player.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        MatchDetailsComponent,
        LineUpComponent,
        SubstitutionsComponent,
        SelectPlayerComponent,
        SelectSubstitutionPlayerComponent
    ],
    entryComponents: [],
    imports: [
        BrowserModule, IonicModule.forRoot(), AppRoutingModule, BrowserAnimationsModule, MatSelectModule, FormsModule, MatToolbarModule, MatRadioModule, ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
