import { Component, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { UserService } from './user.service'
import { PopupComponent } from './popup.component'
import { ProgressBlockerComponent } from './progress-blocker.component'
import { GUIService } from './gui.service'

@Component({
  selector: 'app-wrapper',
  template: `
    <popup></popup>
    <progress-blocker></progress-blocker>
    <router-outlet></router-outlet>
  `
})
export class AppWrapperComponent {
  @ViewChild(PopupComponent) mainpopup: PopupComponent
  @ViewChild(ProgressBlockerComponent) progress_blocker: ProgressBlockerComponent
  constructor(public gui: GUIService) { }
  
  ngAfterContentInit() {
    this.gui.bindMainPopup(this.mainpopup)
    this.gui.bindProgressBlocker(this.progress_blocker)
  }
}
