import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { UserService, User } from './user.service'

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
        <button class="btn btn-success" type="submit" [disabled]="!form.valid">Login</button>
      </form>
    </div>
  </div>
</div>
  `
})
export class LoginComponent {
  public username = ""
  public password = ""

  constructor(private userService: UserService, private router: Router) { }

  loginSubmit() {
    this.userService.login(this.username, this.password).then(() => {
      this.router.navigate(['dashboard'])
    })
  }
}
