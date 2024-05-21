import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page.component';

const routes: Routes = [
  {
    path:"",  redirectTo: 'Customer/1', pathMatch: 'full'
  },
  {
    path: 'Customer/:CustomerId',
    component: MainPageComponent,
  },
  { path: '**', redirectTo: 'Customer/1', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
