import { Component, ViewChild, ViewChildren } from '@angular/core'

import { FilterQueryComponent } from './filter-query.component'
import { FilterTypeComponent } from './filter-type.component'

import { Router, ActivatedRoute } from '@angular/router'
import { UserService, Worker, Config, ConfigData } from './user.service'
import { GUIService } from './gui.service'

import { SelectOption } from './neatselect.component'

@Component({
  template: `
<form *ngIf="worker" #form="ngForm">
  <div class="row">
    <!-- name and digital key -->
    <div class="col-lg-4 col-md-6 form-group">
      <label for="name">Name:</label>
      <input class="form-control" type="text" name="name" id="name" [(ngModel)]="worker.name" required>
    </div>
    <div class="col-lg-4 col-md-6 form-group">
      <label for="key">Key:</label>
      <input class="form-control" type="text" name="key" id="key" [(ngModel)]="worker.key" required>
    </div>
  </div>
  <div class="row">
    <div class="col-lg-4">
      <div class="form-group">
        <label for="baseconfig_id">Config:</label>
        <neatselect name="baseconfig_id" id="baseconfig_id" [(value)]="worker.baseconfig_id" [options]="configOptions" (optionsChange)="getConfigOptions($event)" hasnull="true" nulllabel="Not selected"></neatselect>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-lg-12">
      <button class="btn btn-success" [disabled]="!form.valid" type="button" (click)="onSave()">Save</button>
    </div>
  </div>
</form>
`
})
export class WorkerEditComponent {
  workerId: string = null
  worker: Worker = null
  configOptions: SelectOption[] = null
  constructor(private gui: GUIService, private userService: UserService, private route: ActivatedRoute, private router: Router) {
    this.workerId = (<any>route.snapshot.params).id
    if(!this.workerId) {
      var w = this.worker = new Worker()
      w.name = ''
      w.key = this.mkRandomKey(15)
      w.configdata = new ConfigData()
    } else {
      gui.blockloading()
      userService.getWorker(this.workerId).then((response) => {
        this.worker = <Worker>response.record
      }).finally(gui.unblockbound)
        .catch(this.gui.alerterrorbound)
    }
    userService.getConfigs({}).then((response) => {
      var items = <Config[]><any>response.records
      var options: SelectOption[] = [];
      for(var i = 0, len = items.length; i < len; ++i) {
        var option: Config = items[i]
        options.push(new SelectOption(option.id, option.name))
      }
      this.configOptions = options
    }).catch(this.gui.alerterrorbound)
  }
  onSave() {
    var promise: Promise2.IThenable<any>;
    if(!this.workerId) {
      promise = this.userService.createWorker(this.worker)
    } else {
      promise = this.userService.updateWorker(this.worker);
    }
    this.gui.blockloading()
    promise.then(() => {
      this.router.navigate([ '/worker/manage' ])
    }).finally(this.gui.unblockbound)
      .catch(this.gui.alerterrorbound)
  }
  geConfigOptions($event: any) {
    // change configOptions
  }
  mkRandomKey(n: number, chars: string="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789") {
    var ret = ''
    while(n-- > 0) {
      ret += chars[Math.floor(Math.random() * chars.length)]
    }
    return ret
  }
}
