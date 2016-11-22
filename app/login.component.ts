import { Inject, Component, ViewChild } from '@angular/core'
import { NgForm } from '@angular/forms'
import { Router } from '@angular/router'
import { UserService, User } from './user.service'
import { GUIService } from './gui.service'
import { AppConfig } from './app.config'

@Component({
  template: `
<div class="container">
  <div class="row">
    <div class="col-lg-4 col-md-4 col-sm-4">
      <div>
        <h2>Welcome</h2>
      </div>
      <form (ngSubmit)="loginSubmit()" #form="ngForm">
        <div class="form-group">
          <label for="username">Username:</label>
          <input class="form-control" [(ngModel)]="username" name="username" type="text" placeholder="Username" id="username" required />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input class="form-control" [(ngModel)]="password" name="password" type="password" placeholder="Password" id="password" required />
        </div>
        <button class="btn btn-success" type="submit">Login</button>
      </form>
    </div>
  </div>
</div>
  `
})
export class LoginComponent {
  public username = ""
  public password = ""
  @ViewChild('form') form: NgForm
  
  constructor(@Inject(AppConfig) private appCfg: AppConfig, private gui: GUIService, private userService: UserService, private router: Router) { }
  
  loginSubmit() {
    this.gui.blockloading()
    this.userService.login(this.username, this.password).then(() => {
      this.router.navigate([this.appCfg.appDefaultRoute])
    }).finally(this.gui.unblockbound)
      .catch(this.gui.alerterrorbound)
  }
}
