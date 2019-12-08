import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { Global } from './global'

import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { QueryProfilesComponent } from './query-profiles/query-profiles.component';

const urlMap: Routes =
  [
    { path: '', redirectTo: '/home', pathMatch: "full" },
    { path: 'home', component: HomeComponent },
    { path: 'user-profile', component: UserProfileComponent },
    { path: 'query-profiles', component: QueryProfilesComponent },

  ];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserProfileComponent,
    QueryProfilesComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(urlMap),
    FormsModule,
    HttpClientModule
  ],
  providers: [Global],
  bootstrap: [AppComponent]
})
export class AppModule { }
