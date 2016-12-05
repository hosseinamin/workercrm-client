import { Component, EventEmitter, Output, Input, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router'
import { UserService, User } from './user.service'

declare var Collapse: any

@Component({
  template: `
<div class="navbar-wrapper">
  <div class="container">
    <nav class="navbar navbar-default navbar-static-top">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar" #navbar_toggle>
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">AB Demo</a>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
          <nav class="mnav">
            <!-- Not implemented yet
            <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
            -->
            <a routerLink="/worker/manage" routerLinkActive="active">Worker</a>
            <a routerLink="/config/manage" routerLinkActive="active">Config</a>
            <!-- Not implemented yet
                 <a routerLink="/place/manage" routerLinkActive="active">Place</a>
                 <a routerLink="/place-config/manage" routerLinkActive="active">Place Config</a>
                 -->
            <a href="/exit" (click)="onExitClick($event)">Exit</a>
          </nav>
        </div>
      </div>
    </nav>
  </div>
</div>
<div class="container content-container">
  <router-outlet></router-outlet>
</div>
  `
})
export class AppComponent {
  private user: User
  @ViewChild('navbar_toggle') navbarToggle: any
  constructor(private userService: UserService, private router: Router) {
    this.user = userService.user
  }
  ngAfterContentInit() {
    var collapse: any = this.navbarToggle.nativeElement, options: any = {};
    new Collapse(collapse,options);
  }
  onExitClick(event: any) {
    event.preventDefault()
    this.userService.logout().then(() => {
      this.router.navigate(["login"])
    })
  }
}
