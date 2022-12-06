import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';

import { ListImagesRenderedComponent } from './list-images-rendered.component';
@Component({ selector: 'app-header-image', template: '' })
class HeaderImageComponent {
    @Input() nameImage: string;
    @Input() indexOfImageToSend: number;
}
@Component({ selector: 'app-image-rendered', template: '' })
class ImageRenderedComponent {
    @Input() idFromParent: number;
}

@Component({ selector: 'app-canvas-drawing', template: '' })
class CanvasDrawingComponent {
    @Input() indexOfCanvas: number;
}

describe('ListImagesRenderedComponent', () => {
    let component: ListImagesRenderedComponent;
    let fixture: ComponentFixture<ListImagesRenderedComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ListImagesRenderedComponent, HeaderImageComponent, ImageRenderedComponent, CanvasDrawingComponent],
            imports: [MatCardModule, MatGridListModule],
        }).compileComponents();

        fixture = TestBed.createComponent(ListImagesRenderedComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
