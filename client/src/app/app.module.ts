import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { AppMaterialModule } from '@app/modules/material.module';
import { AppComponent } from '@app/pages/app/app.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { MaterialPageComponent } from '@app/pages/material-page/material-page.component';
import { DialogInputComponent } from './components/dialog-input/dialog-input.component';
import { EditableImagesComponent } from './components/editable-images/editable-images.component';
import { ModifiedImageComponent } from './components/editable-images/modified-image/modified-image.component';
import { OriginalImageComponent } from './components/editable-images/original-image/original-image.component';
import { GameFormComponent } from './components/forms/game-form/game-form.component';
import { ListGameFormComponent } from './components/forms/list-game-form/list-game-form.component';
import { HeaderImageComponent } from './components/header-image/header-image.component';
import { PopDialogCreateGameComponent } from './components/pop-dialogs/pop-dialog-create-game/pop-dialog-create-game.component';
import { PopDialogDownloadImagesComponent } from './components/pop-dialogs/pop-dialog-download-images/pop-dialog-download-images.component';
import { PopDialogValidateGameComponent } from './components/pop-dialogs/pop-dialog-validate-game/pop-dialog-validate-game.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { GameCreationPageComponent } from './pages/game-creation-page/game-creation-page.component';
import { GameSelectionComponent } from './pages/game-selection/game-selection.component';

/**
 * Main module that is used in main.ts.
 * All automatically generated components will appear in this module.
 * Please do not move this module in the module folder.
 * Otherwise Angular Cli will not know in which module to put new component
 */
@NgModule({
    declarations: [
        AppComponent,
        GamePageComponent,
        MainPageComponent,
        MaterialPageComponent,
        PlayAreaComponent,
        SidebarComponent,
        GameCreationPageComponent,
        EditableImagesComponent,
        HeaderImageComponent,
        PopDialogDownloadImagesComponent,
        PopDialogValidateGameComponent,
        PopDialogCreateGameComponent,
        OriginalImageComponent,
        ModifiedImageComponent,
        GameSelectionComponent,
        GameFormComponent,
        ListGameFormComponent,
        AdminPageComponent,
        DialogInputComponent,
    ],
    imports: [AppMaterialModule, AppRoutingModule, BrowserAnimationsModule, BrowserModule, FormsModule, HttpClientModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
