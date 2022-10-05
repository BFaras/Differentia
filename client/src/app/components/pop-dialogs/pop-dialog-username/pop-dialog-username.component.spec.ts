import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SocketClientService } from '@app/services/socket-client.service';

import { PopDialogUsernameComponent } from './pop-dialog-username.component';

fdescribe('PopDialogUsernameComponent', () => {
    let component: PopDialogUsernameComponent;
    let fixture: ComponentFixture<PopDialogUsernameComponent>;
    let socketSpy: jasmine.SpyObj<SocketClientService>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PopDialogUsernameComponent],
            providers: [
                { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: {} },
            ],
        }).compileComponents();

        socketSpy = jasmine.createSpyObj('SocketClientService', ['send']);
        fixture = TestBed.createComponent(PopDialogUsernameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should send info to server', () => {
        component.gamePage();
    });
});
