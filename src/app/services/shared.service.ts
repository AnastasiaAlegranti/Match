import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private alertController: AlertController) { }

  public async showAlert(message: string, showOkBtn: boolean, showCancelBtn: boolean, isDismiss?: boolean, cssStyle?: string): Promise<boolean> {
    const buttons: any = [];
    let swDismiss = false;
    if (showOkBtn) {
      buttons.push(
          {
            text: 'Ok',
            // cssClass: 'alertButton',
            handler: () => {
              swDismiss = true;
            }
          });
    }
    if (showCancelBtn) {
      buttons.push({
        text: 'Cancel',
        // cssClass: 'alertButton',
        handler: () => {
          swDismiss = false;
        }
      });
    }
    return new Promise<boolean>(async (resolve, reject) => {
      const alert = await this.alertController.create({
        message,
        buttons,
        cssClass: cssStyle,
        backdropDismiss: isDismiss
      });
      alert.onDidDismiss().then(() => {
        resolve(swDismiss);
      });
      await alert.present();
    });
  }
}
