import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { GameSelectionComponent } from '@app/pages/game-selection/game-selection.component';
import { MaterialPageComponent } from '@app/pages/material-page/material-page.component';
import { TestPageComponent } from '@app/pages/test-page/test-page.component';

const routes: Routes = [
    //on va mettre page ici
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: TestPageComponent },
    { path: 'game', component: GamePageComponent },
    { path: 'gameSelection', component: GameSelectionComponent },
    { path: 'material', component: MaterialPageComponent },
    { path: '**', redirectTo: '/home' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
