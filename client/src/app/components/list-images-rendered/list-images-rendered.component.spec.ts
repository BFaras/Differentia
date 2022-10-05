import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListImagesRenderedComponent } from './list-images-rendered.component';

describe('ListImagesRenderedComponent', () => {
    let component: ListImagesRenderedComponent;
    let fixture: ComponentFixture<ListImagesRenderedComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ListImagesRenderedComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ListImagesRenderedComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
