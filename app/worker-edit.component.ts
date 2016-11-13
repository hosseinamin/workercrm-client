import { Component } from '@angular/core'

import { FilterQueryComponent } from './filter-query.component'
import { FilterTypeComponent } from './filter-type.component'

import { Worker } from './user.service'

@Component({
  template: `
<form *ngIf="worker" #form="ngForm">
  <div class="row">
    <!-- unique name and digital key -->
    <div class="col-lg-4 col-md-6 form-group">
      <label for="name">Name:</label>
      <input class="form-control" type="text" name="name" id="name" [(ngModel)]="worker.name" required>
    </div>
    <div class="col-lg-4 col-md-6 form-group">
      <label for="key">Key:</label>
      <input class="form-control" type="text" name="key" id="key" [(ngModel)]="worker.key" required>
    </div>
    <div class="form-group">
      <label for="config_id">Config:</label>
      <neatselect class="form-control" name="config_id" id="config_id" [(ngModel)]="worker.config_id"></neatselect>
    </div>
    <button class="btn btn-success" [disabled]="!form.valid">Save</button>
  </div>
</form>
`
})
export class WorkerEditComponent {
  worker: Worker = null
}
