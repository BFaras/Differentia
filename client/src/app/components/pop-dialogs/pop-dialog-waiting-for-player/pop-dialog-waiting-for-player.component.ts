import { Component, OnInit, Inject } from '@angular/core';
import { CreateGameService } from '@app/services/create-game.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SocketClientService } from '@app/services/socket-client.service';
import { JoinGameService } from '@app/services/join-game.service';
import { StartUpGameService } from '@app/services/start-up-game.service';
import { PopDialogHostRefusedComponent } from '../pop-dialog-host-refused/pop-dialog-host-refused.component';

@Component({
  selector: 'app-pop-dialog-waiting-for-player',
  templateUrl: './pop-dialog-waiting-for-player.component.html',
  styleUrls: ['./pop-dialog-waiting-for-player.component.scss']
})
export class PopDialogWaitingForPlayerComponent implements OnInit {
  isSomeoneJoining: boolean = false;
  playerTryingToJoin: string = "";
  isHostPresent: boolean = true;
  constructor(private socketService: SocketClientService, public createGameService: CreateGameService, public joinGameService: JoinGameService,
    public startUpGameService: StartUpGameService, private dialogRef: MatDialogRef<PopDialogWaitingForPlayerComponent>, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public gameInfo: any) { }

  ngOnInit(): void {
    this.configureWaitingPopUpSocketFeatures();
    this.socketService.send(`Is the host still there`, this.gameInfo.nameGame);
  }

  private openRefusedDialog() {
    this.dialog.open(PopDialogHostRefusedComponent, {
      height: '400px',
      width: '600px',
      disableClose: true,
    });
  }

  private configureWaitingPopUpSocketFeatures(): void {
    this.socketService.on(`${this.gameInfo.nameGame} someone is trying to join`, (username: string) => {
      this.isSomeoneJoining = true;
      this.playerTryingToJoin = username;
    });

    this.socketService.on(`${this.gameInfo.nameGame} the player trying to join left`, () => {
      this.isSomeoneJoining = false;
      this.playerTryingToJoin = "";
    });

    this.socketService.on(`${this.gameInfo.nameGame} response on host presence`, (response: boolean) => {
      this.isHostPresent = response;
    });

    this.socketService.on(`${this.gameInfo.nameGame} you have been declined`, () => {
      this.dialogRef.close();
      this.openRefusedDialog();
    });

    this.socketService.on(`${this.gameInfo.nameGame} you have been accepted`, () => {
      this.dialogRef.close();
      //Changer la page vers la page de jeu
    });

    // Pt mettre ce on dans la page de jeu directement
    this.socketService.on('The adversary username is', (username: string) => {
      //enlever le console.log et l'utiliser pour faire quoi que ce soit dans la vue du jeu multijoueur
      console.log(username);
    });
  }

}
