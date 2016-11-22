import { Component, ViewChild, ViewChildren } from '@angular/core'
import { NgForm } from '@angular/forms'

import { FilterQueryComponent } from './filter-query.component'
import { FilterTypeComponent } from './filter-type.component'

import { Router, ActivatedRoute } from '@angular/router'
import { UserService, Config, ConfigData } from './user.service'
import { GUIService } from './gui.service'

import { SelectOption } from './neatselect.component'

@Component({
  template: `
<form *ngIf="config" #form="ngForm">
  <div class="row">
    <!-- name -->
    <div class="col-lg-4 col-md-6 form-group">
      <label for="name">Name:</label>
      <input class="form-control" type="text" name="name" id="name" [(ngModel)]="config.name" required>
    </div>
  </div>
  <div class="row">
    <configdata-edit name="configdata" [(configdata)]="config.configdata" [form]="form"></configdata-edit>
  </div>
  <div class="row">
    <div class="col-lg-12">
      <button class="btn btn-success" [disabled]="!form.valid" type="button" (click)="onSave()">Save</button>
    </div>
  </div>
</form>
`
})
export class ConfigEditComponent {
  configId: string = null
  config: Config = null
  configOptions: SelectOption[] = null
  constructor(private gui: GUIService, private userService: UserService, private route: ActivatedRoute, private router: Router) {
    this.configId = (<any>route.snapshot.params).id
    if(!this.configId) {
      var w = this.config = new Config()
      w.name = ''
      w.configdata = new ConfigData()
    } else {
      gui.blockloading()
      userService.getConfig(this.configId).then((response) => {
        this.config = <Config>response.record
      }).finally(gui.unblockbound)
        .catch(this.gui.alerterrorbound)
    }
  }
  onSave() {
    var promise: Promise2.IThenable<any>;
    if(!this.configId) {
      promise = this.userService.createConfig(this.config)
    } else {
      promise = this.userService.updateConfig(this.config);
    }
    this.gui.blockloading()
    promise.then(() => {
      this.router.navigate([ '/config/manage' ])
    }).finally(this.gui.unblockbound)
      .catch(this.gui.alerterrorbound)
  }
}
