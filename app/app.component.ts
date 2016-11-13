import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router'
import { UserService, User } from './user.service'

@Component({
  template: `
<div class="container">
  <div class="row">
    <h2>Welcome, {{user.username}}</h2>
    <nav class="mnav">
      <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
      <a routerLink="/worker/manage" routerLinkActive="active">Worker</a>
      <a routerLink="/config/manage" routerLinkActive="active">Config</a>
<!-- Not implemented yet
      <a routerLink="/place/manage" routerLinkActive="active">Place</a>
      <a routerLink="/place-config/manage" routerLinkActive="active">Place Config</a>
-->
      <a href="/exit" (click)="onExitClick($event)">Exit</a>
    </nav>
  </div>
  <div class="row">
    <router-outlet></router-outlet>
  </div>
</div>
  `
})
export class AppComponent {
  user: User
  constructor(private userService: UserService, private router: Router) {
    this.user = userService.user
  }
  onExitClick(event: any) {
    event.preventDefault()
    this.userService.logout().then(() => {
      this.router.navigate(["login"])
    })
  }
}
