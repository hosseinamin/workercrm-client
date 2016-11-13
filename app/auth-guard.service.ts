import { Injectable } from '@angular/core'
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { UserService } from './user.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.checkLogin(state.url)
  }

  checkLogin(url: string): Promise<boolean> {
    return this.userService.getUser().then((user) => {
      if(user == null) {
        if(url == '/login') { // already login page
          return true
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      } else if(url == '/login') { // already logged in
        this.router.navigate(['/dashboard'])
        return false
      } else {
        return true;
      }
    })
  }
}
