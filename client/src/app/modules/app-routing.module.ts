import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPageComponent } from '@app/pages/admin-page/admin-page.component';
import { GameCreationPageComponent } from '@app/pages/game-creation-page/game-creation-page.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { GameSelectionComponent } from '@app/pages/game-selection/game-selection.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { MaterialPageComponent } from '@app/pages/material-page/material-page.component';
import { TestPageComponent } from '@app/pages/test-page/test-page.component';

const routes: Routes = [
    // on va mettre page ici
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'test', component: TestPageComponent },
    { path: 'test', component: MainPageComponent },
    { path: 'game', component: GamePageComponent },
    { path: 'gameCreation', component: GameCreationPageComponent },
    { path: 'gameSelection', component: GameSelectionComponent },
    { path: 'admin', component: AdminPageComponent },
    { path: 'material', component: MaterialPageComponent },
    { path: '**', redirectTo: '/home' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
