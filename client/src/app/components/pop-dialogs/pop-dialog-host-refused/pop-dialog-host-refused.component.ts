import { Component, OnInit, Inject } from '@angular/core';
import { SocketClientService } from '@app/services/socket-client.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-pop-dialog-host-refused',
  templateUrl: './pop-dialog-host-refused.component.html',
  styleUrls: ['./pop-dialog-host-refused.component.scss']
})
export class PopDialogHostRefusedComponent implements OnInit {

  constructor(private socketService: SocketClientService, @Inject(MAT_DIALOG_DATA) public gameInfo: any) { }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.socketService.send('need reconnection');
  }
}
