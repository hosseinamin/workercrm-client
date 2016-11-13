import { Component } from '@angular/core'
import { Router } from '@angular/router'

import { GUIService } from './gui.service'

import { FilterQueryComponent } from './filter-query.component'
import { FilterTypeComponent } from './filter-type.component'
import { ManageTableComponent, TFButton, TFText } from './manage-table.component'

@Component({
  template: `
<div class="row">
  <div class="col-lg-2 col-md-2 col-sm-2 mtop15 xmh15">
    <ul class="nav nav-stacked nav-pills">
      <li><a class="btn btn-default" routerLink="/worker/new">{{ new_worker_label }}</a></li>
    </ul>
  </div>
  <div class="col-lg-10 col-md-10 col-sm-10 mtop15 xmh15">
    <manage-table [fields]="fields" [items]="items" filterhasquery="true" [(filterquery)]="filterquery"></manage-table>
  </div>
</div>
`
})
export class WorkerManageComponent {
  public new_worker_label = "New Worker"
  public filterquery = ""
  public filterhastype = false
  public filtertype_label = ""
  public filtertype = ""
  public filtertypes: any[] = []
  public fields = [
    new TFText('name', 'Name'),
    new TFButton('id', '', 'pencil', 'primary', 'Edit', true, this.onEditItem.bind(this)),
    new TFButton('id', '', 'trash', 'danger', 'Delete', true, this.onDeleteItem.bind(this))
  ]
  public items = [
    {
      "id": "1",
      "name": "Worker A"
    },
    {
      "id": "2",
      "name": "Worker B"
    },
  ]
  constructor(private router: Router, private gui: GUIService) { }
  
  onFilterQueryChange(query: string) {

  }
  onEditItem(item: any) {
    return new Promise((resolve, reject) => {
      resolve()
      this.router.navigate(['worker', 'edit', item.id])
    })
  }
  onDeleteItem(item: any) {
    return this.gui.confirm(`Request to delete worker "${item.name}"`,
                            "Are you sure you want to delete it?")
      .then((confirmed) => {
        if(confirmed) {
          console.log("delete: " + item.name)
        } else {
          console.log("skip delete")
        }
      })
  }
}
