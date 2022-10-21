import { Component, OnInit, Inject } from '@angular/core';
import { CreateGameService } from '@app/services/create-game.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SocketClientService } from '@app/services/socket-client.service';

@Component({
  selector: 'app-pop-dialog-waiting-for-player',
  templateUrl: './pop-dialog-waiting-for-player.component.html',
  styleUrls: ['./pop-dialog-waiting-for-player.component.scss']
})
export class PopDialogWaitingForPlayerComponent implements OnInit {
  isSomeoneJoining: boolean = false;
  playerTryingToJoin: string = "";
  constructor(private socketService: SocketClientService, public createGameService: CreateGameService, @Inject(MAT_DIALOG_DATA) public gameInfo: any) { }

  ngOnInit(): void {
    this.configureWaitingPopUpSocketFeatures();
  }

  private configureWaitingPopUpSocketFeatures(): void {
    this.socketService.on(`${this.gameInfo.nameGame} someone is trying to join`, (username: string) => {
      console.log("salut");
      this.isSomeoneJoining = true;
      this.playerTryingToJoin = username;
      console.log(username);
    });
  }

}
