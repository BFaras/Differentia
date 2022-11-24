import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PopUpData } from '@app/interfaces/pop-up-data';
import { SocketClientService } from '@app/services/socket-client.service';

@Component({
  selector: 'app-pop-dialog-abandon-verification',
  templateUrl: './pop-dialog-abandon-verification.component.html',
  styleUrls: ['./pop-dialog-abandon-verification.component.scss']
})
export class PopDialogAbandonVerificationComponent implements OnInit {

  constructor(private socketService: SocketClientService, @Inject(MAT_DIALOG_DATA) public gameInfo: PopUpData) { }

  ngOnInit(): void {
  }

  abandonGame():void{
    this.socketService.send('kill the game', this.gameInfo.gameMode);
  }
}
