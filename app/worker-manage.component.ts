import { Component } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'

import { GUIService } from './gui.service'
import { UserService, Worker } from './user.service'

import { FilterQueryComponent } from './filter-query.component'
import { FilterTypeComponent } from './filter-type.component'
import { ManageTableComponent, TFButton, TFText } from './manage-table.component'

@Component({
  template: `
<div class="row">
  <div class="col-lg-2 col-md-2 col-sm-1">
    <ul class="nav nav-stacked nav-pills">
      <li><a class="btn btn-success" routerLink="/worker/new"><i class="fa fa-plus fa-lg"></i> {{ new_worker_label }}</a></li>
    </ul>
  </div>
  <div class="col-lg-10 col-md-10 col-sm-9 xmtop15">
    <manage-table [fields]="fields" [items]="items" [itemsCount]="itemsCount" filterhasquery="true" [filterquery]="filterquery" (filterqueryChange)="onFilterQueryChange($event)" [loading]="loading" [(itemsOffset)]="offset" [(itemsLimit)]="limit" pageRoutePrefix="/worker/manage/"></manage-table>
  </div>
</div>
`
})
export class WorkerManageComponent {
  public new_worker_label = "New Worker"
  public filterquery = ""
  public offset: number
  public limit: number
  public fields = [
    new TFText('name', 'Name'),
    new TFButton('id', '', 'pencil', 'primary', 'Edit', true, this.onEditItem.bind(this)),
    new TFButton('id', '', 'trash', 'danger', 'Delete', true, this.onDeleteItem.bind(this))
  ]
  public items: Worker[]
  public itemsCount: number
  public loading: boolean
  private loadWorkersPromise: Promise2.IThenable<any>
  constructor(private route: ActivatedRoute, private router: Router, private gui: GUIService, private userService: UserService) {
    route.params.subscribe((params: Params) => {
      var pagescroll = params['pagescroll']
      this.updatePageScroll(pagescroll||'')
      this._loadWorkers()
    })
  }

  updatePageScroll(pagescroll: string) {
    try {
      var values = ManageTableComponent.parseItemsScroll(pagescroll);
      this.offset = values[0]
      this.limit = values[1]
    } catch(err) {
      this.offset = 0
      this.limit = 10
    }
  }

  _loadWorkers() {
    var opts: {} = {
      query: this.filterquery,
      offset: this.offset,
      limit: this.limit
    }
    if(this.loadWorkersPromise != null) {
      this.loadWorkersPromise.finally(() => {
        this.loadWorkersPromise = null
        setTimeout(() => { this._loadWorkers() }, 0)
      })
      this.loadWorkersPromise.abort()
      return
    }
    this.loading = true
    this.loadWorkersPromise = this.userService.getWorkers(opts)
    this.loadWorkersPromise
      .then((response) => {
        this.items = <Worker[]>response.records
        this.itemsCount = response.count
      })
      .finally(() => { this.loading = false })
      .catch(this.gui.alerterrorbound)
        
  }
  
  onFilterQueryChange(query: string) {
    this.filterquery = query
    this._loadWorkers()
  }
  onEditItem(item: any) {
    return new Promise2((resolve, reject) => {
      resolve()
      this.router.navigate(['worker', 'edit', item.id])
    })
  }
  onDeleteItem(item: Worker) {
    return this.gui.confirm(`Request to delete worker "${item.name}"`,
                            "Are you sure you want to delete it?")
      .then((confirmed) => {
        if(confirmed) {
          this.gui.blockloading()
          this.userService.deleteWorker(item.id)
            .then(() => {
              this._loadWorkers()
            }).finally(this.gui.unblockbound)
              .catch(this.gui.alerterrorbound)
        }
      })
  }
}
