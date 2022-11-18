import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SocketClientService } from '@app/services/socket-client.service';
import { StartUpGameService } from '@app/services/start-up-game.service';

@Component({
  selector: 'app-pop-dialog-limited-time-mode',
  templateUrl: './pop-dialog-limited-time-mode.component.html',
  styleUrls: ['./pop-dialog-limited-time-mode.component.scss']
})
export class PopDialogLimitedTimeModeComponent implements OnInit {
  constructor(
    private socketService: SocketClientService,
    public startUpGameService: StartUpGameService,
    public dialogRef: MatDialogRef<PopDialogLimitedTimeModeComponent>,
    public router: Router,
  ) {}

  ngOnInit(): void {
    this.socketService.connect();
    this.configureLimitedTimePopUpSocketFeatures();
  }

  ngOnDestroy(): void {
    this.socketService.off('username valid');
  }
// private closeDialog(): void {
//     this.dialogRef.close();
// }

  private configureLimitedTimePopUpSocketFeatures(): void {
    console.log('salut');
  }
}
