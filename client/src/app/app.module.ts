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
import { CanvasDrawingComponent } from './components/canvas-drawing/canvas-drawing.component';
import { ChatSectionComponent } from './components/chat-section/chat-section.component';
import { DialogInputComponent } from './components/dialog-input/dialog-input.component';
import { GameFormComponent } from './components/forms/game-form/game-form.component';
import { ListGameFormComponent } from './components/forms/list-game-form/list-game-form.component';
import { HeaderImageComponent } from './components/header-image/header-image.component';
import { ImageDifferenceComponent } from './components/image-difference/image-difference.component';
import { ImageRenderedComponent } from './components/list-images-rendered/image-rendered/image-rendered.component';
import { ListImagesRenderedComponent } from './components/list-images-rendered/list-images-rendered.component';
import { PopDialogCreateGameComponent } from './components/pop-dialogs/pop-dialog-create-game/pop-dialog-create-game.component';
import { PopDialogDownloadImagesComponent } from './components/pop-dialogs/pop-dialog-download-images/pop-dialog-download-images.component';
import { PopDialogEndgameComponent } from './components/pop-dialogs/pop-dialog-endgame/pop-dialog-endgame.component';
import { PopDialogHostRefusedComponent } from './components/pop-dialogs/pop-dialog-host-refused/pop-dialog-host-refused.component';
import { PopDialogUsernameComponent } from './components/pop-dialogs/pop-dialog-username/pop-dialog-username.component';
import { PopDialogValidateGameComponent } from './components/pop-dialogs/pop-dialog-validate-game/pop-dialog-validate-game.component';
import { PopDialogWaitingForPlayerComponent } from './components/pop-dialogs/pop-dialog-waiting-for-player/pop-dialog-waiting-for-player.component';
import { ToolSettingComponent } from './components/tool-setting/tool-setting.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { GameCreationPageComponent } from './pages/game-creation-page/game-creation-page.component';
import { GameSelectionComponent } from './pages/game-selection/game-selection.component';
import { PopDialogResetComponent } from './components/pop-dialogs/pop-dialog-reset/pop-dialog-reset.component';

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
        PlayAreaComponent,
        SidebarComponent,
        GameCreationPageComponent,
        ListImagesRenderedComponent,
        HeaderImageComponent,
        PopDialogDownloadImagesComponent,
        PopDialogValidateGameComponent,
        PopDialogCreateGameComponent,
        ImageRenderedComponent,
        TopbarComponent,
        GameSelectionComponent,
        GameFormComponent,
        ListGameFormComponent,
        AdminPageComponent,
        DialogInputComponent,
        ImageDifferenceComponent,
        PopDialogUsernameComponent,
        PopDialogEndgameComponent,
        ChatSectionComponent,
        PopDialogWaitingForPlayerComponent,
        PopDialogHostRefusedComponent,
        ToolSettingComponent,
        CanvasDrawingComponent,
        PopDialogResetComponent,
    ],
    imports: [AppMaterialModule, AppRoutingModule, BrowserAnimationsModule, BrowserModule, FormsModule, HttpClientModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
