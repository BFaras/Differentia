import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SocketClientService } from '@app/services/socket-client.service';

import { PopDialogAbandonVerificationComponent } from './pop-dialog-abandon-verification.component';

describe('PopDialogAbandonVerificationComponent', () => {
    let component: PopDialogAbandonVerificationComponent;
    let fixture: ComponentFixture<PopDialogAbandonVerificationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PopDialogAbandonVerificationComponent],
            providers: [{ provide: SocketClientService }],
        }).compileComponents();

        fixture = TestBed.createComponent(PopDialogAbandonVerificationComponent);
        component = fixture.componentInstance;
        TestBed.inject(SocketClientService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });
});
