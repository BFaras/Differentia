import { Component, OnInit, Inject } from '@angular/core';
import { SocketClientService } from '@app/services/socket-client.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PopUpData } from '@app/interfaces/pop-up-data';

@Component({
  selector: 'app-pop-dialog-host-refused',
  templateUrl: './pop-dialog-host-refused.component.html',
  styleUrls: ['./pop-dialog-host-refused.component.scss']
})
export class PopDialogHostRefusedComponent implements OnInit {
    constructor(private socketService: SocketClientService, @Inject(MAT_DIALOG_DATA) public gameInfo: PopUpData) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.socketService.send('need reconnection');
  }
}
