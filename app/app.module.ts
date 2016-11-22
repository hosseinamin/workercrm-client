import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule, Routes, Router } from '@angular/router'
import { AppWrapperComponent } from './app-wrapper.component'
import { UserService } from './user.service'
import { AuthGuard } from './auth-guard.service'
import { GUIService } from './gui.service'

// router components
import { AppComponent } from './app.component'
import { LoginComponent } from './login.component'
import { DashboardComponent }   from './dashboard.component'
import { NotFoundComponent } from './not-found.component'

import { WorkerManageComponent }      from './worker-manage.component'
import { ConfigManageComponent }      from './config-manage.component'
import { WorkerEditComponent }      from './worker-edit.component'
import { ConfigEditComponent }      from './config-edit.component'
import { ConfigDataEditComponent }  from './configdata-edit.component'

import { PlaceManageComponent }      from './place-manage.component'
import { PlaceConfigManageComponent }      from './place-config-manage.component'

// components
import { PopupComponent } from './popup.component'
import { FilterQueryComponent } from './filter-query.component'
import { FilterTypeComponent } from './filter-type.component'
import { ManageTableComponent } from './manage-table.component'
import { NeatSelectComponent } from './neatselect.component'
import { ProgressBlockerComponent } from './progress-blocker.component'

import { AppConfig, APP_CONFIG } from './app.config'

const routes: Routes = [
  { path: '', redirectTo: APP_CONFIG.appDefaultRoute, pathMatch: 'full' },
  { path: 'login', component: LoginComponent,
    canActivate: [AuthGuard] /* special use of AuthGuard */ },
  {
    path: '',
    component: AppComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard',  component: DashboardComponent },
      {
        path: 'worker',
        children: [
          { path: 'manage/:pagescroll', component: WorkerManageComponent },
          { path: 'manage', component: WorkerManageComponent },
          { path: 'edit/:id', component: WorkerEditComponent },
          { path: 'new', component: WorkerEditComponent },
        ]
      },
      {
        path: 'config',
        children: [
          { path: 'manage/:pagescroll', component: ConfigManageComponent },
          { path: 'manage', component: ConfigManageComponent },
          { path: 'edit/:id', component: ConfigEditComponent },
          { path: 'new', component: ConfigEditComponent },
        ]
      },
      /* TODO:: add later
      { path: 'place', component: PlaceManageComponent },
      { path: 'place-config', component: PlaceConfigManageComponent },
      */
      { path: '**', component: NotFoundComponent },
    ]
  }
];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule
  ],
  declarations: [
    AppWrapperComponent,
    
    AppComponent,
    LoginComponent,
    DashboardComponent,
    NotFoundComponent,

    WorkerManageComponent,
    ConfigManageComponent,
    WorkerEditComponent,
    ConfigEditComponent,
    ConfigDataEditComponent,
    
    PlaceManageComponent,
    PlaceConfigManageComponent,
    
    // components
    FilterQueryComponent,
    FilterTypeComponent,
    ManageTableComponent,
    PopupComponent,
    ProgressBlockerComponent,
    NeatSelectComponent
  ],
  providers: [
    UserService, AuthGuard, GUIService,
    { provide: AppConfig, useValue: APP_CONFIG }
  ],
  bootstrap: [ AppWrapperComponent ]
})
export class AppModule {
}
