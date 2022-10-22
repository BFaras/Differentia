import { Component, OnInit, Inject } from '@angular/core';
import { CreateGameService } from '@app/services/create-game.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SocketClientService } from '@app/services/socket-client.service';
import { JoinGameService } from '@app/services/join-game.service';
import { StartUpGameService } from '@app/services/start-up-game.service';

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
    public startUpGameService: StartUpGameService,
    @Inject(MAT_DIALOG_DATA) public gameInfo: any) { }

  ngOnInit(): void {
    this.configureWaitingPopUpSocketFeatures();
    this.socketService.send(`Is the host still there`, this.gameInfo.nameGame);
  }

  private configureWaitingPopUpSocketFeatures(): void {
    this.socketService.on(`${this.gameInfo.nameGame} someone is trying to join`, (username: string) => {
      console.log(username);
      this.isSomeoneJoining = true;
      this.playerTryingToJoin = username;
    });

    this.socketService.on(`${this.gameInfo.nameGame} the player trying to join left`, () => {
      this.isSomeoneJoining = false;
      this.playerTryingToJoin = "";
    });

    this.socketService.on(`${this.gameInfo.nameGame} response on host presence`, (response: boolean) => {
      if(response) this.isHostPresent = true;
      else this.isHostPresent = false;
    })
  }

}
