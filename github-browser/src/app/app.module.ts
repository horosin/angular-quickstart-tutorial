import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { RepoComponent } from './components/repo/repo.component';
import { RepolistComponent } from './components/repolist/repolist.component';

const appRoutes:Routes = [
  {path:'', component:RepoComponent},
  {path:'list', component:RepolistComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    RepoComponent,
    RepolistComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
