import { Injectable, Inject } from '@angular/core'
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { UserService, User } from './user.service'
import { GUIService } from './gui.service'
import { AppConfig } from './app.config'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(AppConfig) private  appCfg: AppConfig, private gui: GUIService, private userService: UserService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.checkLogin(state.url).then(resolve, reject);
    })
  }

  checkLogin(url: string): Promise2.IThenable<boolean> {
    return this.userService.checkLogin().then((loggedIn: boolean) => {
      if(loggedIn) {
        if(url == '/login') { // already login page
          this.router.navigate([this.appCfg.appDefaultRoute]);
          return false;
        } else {
          return true;
        }
      } else if(url == '/login') { // already logged in
        return true;
      } else {
        this.router.navigate(['/login'])
        return false;
      }
    }).catch(this.gui.alerterrorbound)
  }
}
