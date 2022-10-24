import { Component, ViewContainerRef,
    ComponentFactoryResolver,
    ComponentRef } from '@angular/core';
import { SocketClientService } from '@app/services/socket-client.service';

@Component({
    selector: 'app-game-selection',
    templateUrl: './game-selection.component.html',
    styleUrls: ['./game-selection.component.scss'],
})
export class GameSelectionComponent {
    constructor(private socketService: SocketClientService, private resolver: ComponentFactoryResolver) {}
    nameOfPage: string = 'GameSelection';
    alertContainer!: ViewContainerRef;
    componentRef!: ComponentRef <GameSelectionComponent> ;

    ngOnInit(): void {
        this.socketService.connect();
        this.configureGameSelectionSocketFeatures();
    }

    create(): void {
        this.alertContainer.clear();
        // Create a factory for MessageComponent.
        const factory = this.resolver.resolveComponentFactory(GameSelectionComponent);
        // Create a component using the factory.
        this.componentRef = this.alertContainer.createComponent(factory);
    }

    destroy(): void {
        this.componentRef.destroy();
    }

    configureGameSelectionSocketFeatures(): void {
        this.socketService.on('reconnect', () => {
            window.location.reload();
            // console.log("je reconnectte");
            // this.socketService.disconnect();
            // this.ngOnInit();
        });
    }
}
