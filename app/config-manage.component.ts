import { Component } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'

import { GUIService } from './gui.service'
import { UserService, Config } from './user.service'

import { FilterQueryComponent } from './filter-query.component'
import { FilterTypeComponent } from './filter-type.component'
import { ManageTableComponent, TFButton, TFText } from './manage-table.component'

@Component({
  template: `
<div class="row">
  <div class="col-lg-12">
    <h4 style="margin-top:0px;">Manage Configurations</h4>
    <p>With the power of search and pagination you can easily, Do it!</p>
  </div>
</div>
<div class="row">
  <div class="col-lg-2 col-md-2 col-sm-3">
    <ul class="nav nav-stacked nav-pills">
      <li><a class="btn btn-success" routerLink="/config/new"><i class="fa fa-plus fa-lg"></i> {{ new_config_label }}</a></li>
    </ul>
  </div>
  <div class="col-lg-10 col-md-10 col-sm-9 xmtop15">
    <manage-table [fields]="fields" [items]="items" [itemsCount]="itemsCount" filterhasquery="true" [filterquery]="filterquery" (filterqueryChange)="onFilterQueryChange($event)" [loading]="loading" [itemsOffset]="offset" [itemsLimit]="limit" pageRoutePrefix="/config/manage/" (itemsScrollChange)="onItemsScrollChange($event)"></manage-table>
  </div>
</div>
`
})
export class ConfigManageComponent {
  public new_config_label = "New Config"
  public filterquery = ""
  public offset: number
  public limit: number
  public fields = [
    new TFText('name', 'Name'),
    new TFButton('id', '', 'pencil', 'primary', 'Edit', true, this.onEditItem.bind(this)),
    new TFButton('id', '', 'trash', 'danger', 'Delete', true, this.onDeleteItem.bind(this))
  ]
  public items: Config[]
  public itemsCount: number
  public loading: boolean
  private loadItemsPromise: Promise2.IThenable<any>
  constructor(private route: ActivatedRoute, private router: Router, private gui: GUIService, private userService: UserService) {
    route.params.subscribe((params: Params) => {
      var pagescroll = params['pagescroll']
      this.updatePageScroll(pagescroll||'')
      this._loadItems()
    })
  }

  onItemsScrollChange(change: any) {
    if(change.offset != this.offset || change.limit != this.limit) {
      this.offset = change.offset
      this.limit = change.limit
      this.router.navigate(["/config/manage/",
                ManageTableComponent.mkItemsScroll(this.offset, this.limit)])
    }
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

  _loadItems() {
    var opts: {} = {
      query: this.filterquery,
      offset: this.offset,
      limit: this.limit
    }
    if(this.loadItemsPromise != null) {
      this.loadItemsPromise.finally(() => {
        this.loadItemsPromise = null
        setTimeout(() => { this._loadItems() }, 0)
      })
      this.loadItemsPromise.abort()
      return
    }
    this.loading = true
    this.loadItemsPromise = this.userService.getConfigs(opts)
    this.loadItemsPromise
      .then((response) => {
        this.items = <Config[]>response.records
        this.itemsCount = response.count
      })
      .finally(() => { this.loading = false })
      .catch(this.gui.alerterrorbound)
        
  }
  
  onFilterQueryChange(query: string) {
    this.filterquery = query
    this._loadItems()
  }
  onEditItem(item: any) {
    return new Promise2((resolve, reject) => {
      resolve()
      this.router.navigate(['config', 'edit', item.id])
    })
  }
  onDeleteItem(item: Config) {
    return this.gui.confirm(`Request to delete config "${item.name}"`,
                            "Are you sure you want to delete it?")
      .then((confirmed) => {
        if(confirmed) {
          this.gui.blockloading()
          this.userService.deleteConfig(item.id)
            .then(() => {
              this._loadItems()
            }).finally(this.gui.unblockbound)
              .catch(this.gui.alerterrorbound)
        }
      })
  }
}
