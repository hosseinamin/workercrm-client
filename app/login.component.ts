import { Inject, Component, ViewChild } from '@angular/core'
import { NgForm } from '@angular/forms'
import { Router } from '@angular/router'
import { UserService, User } from './user.service'
import { GUIService } from './gui.service'
import { AppConfig } from './app.config'

@Component({
  template: `
<div class="container mtop15">
  <div class="row">
    <div class="col-lg-6 col-md-7 col-sm-8">
      <div class="row">
        <div class="col-lg-4 col-md-4 col-sm-4">
          <img class="xwp-5 center-block img-responsive" src="assets/ab-256.png" alt="Aminbros" />
        </div>
        <div class="col-lg-8 col-lg-8 col-sm-8">
          <h2>Welcome</h2>
          <p>
            Aminbros's worker-crm demo project, An example of cloud management
            system made with powerful frameworks (Angular 2 and Django).
          </p>
          <p>
            This startup project has few quality features. Please login as demo user.
          </p>
          <pre>Username: demo
Passowrd: demo</pre>
          <p>
            This service does get reset every 2 hours.
          </p>
        </div>
      </div>
    </div>
    <div class="col-lg-6 col-md-5 col-sm-4">
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
