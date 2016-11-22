import { Component, EventEmitter, Input, Output } from '@angular/core'
import { GUIService } from './gui.service'

export abstract class TableField {
  public type: string
  public fit: boolean = false
  constructor(public key: string, public label: string) { }
}

export class TFButton extends TableField {
  constructor(key: string, label: string,
              public fa_icon: string, public btntype: string,
              public title: string, public hidetitle: boolean,
              public handler: Function) {
    super(key, label)
    this.type = "BUTTON"
    this.fit = true
    if(!btntype)
      this.btntype = "default"
  }
}

export class TFText extends TableField {
  constructor(key: string, label: string) {
    super(key, label)
    this.type = "TEXT"
  }
}

export class ItemClickEvent {
  public item: any
}

@Component({
  selector: 'manage-table',
  template: `
<div class="row">
  <div class="col-lg-4 col-md-4 col-sm-4">
    <filter-query *ngIf="filterhasquery" placeholder="Search" [mModel]="filterquery" (mModelChange)="onfilterqueryChange($event)"></filter-query>
  </div>
  <div class="col-lg-4 col-md-4 col-sm-4">
    <filter-type *ngIf="filterhastype" [label]="filtertype_label" [mModel]="filtertype" (mModelChange)="onfiltertypeChange($event)" [types]="filtertypes"></filter-type>
  </div>
  <div class="col-lg-4 col-md-4 col-sm-3">
    <div class="pull-right mtbl-loading" [class.active]="loading">
      <i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>
    </div>
  </div>
</div>
<div class="row">
  <div class="col-lg-12">
    <table class="table table-striped">
      <thead>
        <tr>
          <th *ngFor="let field of fields">{{ field.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let item of items" (click)="onItemClick(item)">
          <td *ngFor="let field of fields" [ngSwitch]="field.type" [class.fit]="field.fit">
            <span *ngSwitchCase="'TEXT'">{{ item[field.key] }}</span>
            <button *ngSwitchCase="'BUTTON'" type="button"
                    (click)="onFieldButtonClick(item, field, $event)"
                    [title]="field.hidetitle ? field.title : ''"
                    [class]="'btn btn-' + field.btntype">
              <i [class]="'fa fa-' + field.fa_icon"></i>
              <span *ngIf="!field.hidetitle">{{ field.title }}</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div>
      <nav *ngIf="pagesList?.length > 1" class="paging-nav">
        <a *ngIf="_itemsOffset > 0" class="previous" [routerLink]="pageRoutePrefix + mkItemsScroll(itemsOffset - itemsLimit)">Previous</a>
        <span *ngIf="hasMoreLeft" class="more">...</span>
        <a *ngFor="let page of pagesList" [routerLink]="pageRoutePrefix + mkItemsScroll((page - 1) * _itemsLimit)" routerLinkActive="active">{{ page }}</a>
        <span *ngIf="hasMoreRight" class="more">...</span>
        <a *ngIf="_itemsOffset + items.length < _itemsCount" class="next" [routerLink]="pageRoutePrefix + mkItemsScroll(_itemsOffset + _itemsLimit)">Next</a>
      </nav>
    </div>
  </div>
</div>
`
})
export class ManageTableComponent {

  constructor(public gui: GUIService) { }
  @Input() pageRoutePrefix: string = ""
  @Input() pagingMaxAmount: number = 10
  @Input() loading: boolean = false
  @Input() filterhasquery: boolean = false
  @Input() filterhastype: boolean = false
  @Input() filterquery: string
  @Output() filterqueryChange = new EventEmitter<string>()
  onfilterqueryChange(newval: string) {
    this.filterquery = newval
    this.filterqueryChange.emit(newval)
  }
  @Input() filtertype: string
  @Output() filtertypeChange = new EventEmitter<string>()
  onfiltertypeChange(newval: string) {
    this.filtertype = newval
    this.filtertypeChange.emit(newval)
  }
  @Input() fields: TableField[]
  @Input() items: any[]
  @Output() itemclick = new EventEmitter<ItemClickEvent>()
  
  _itemsOffset: number = 0
  _itemsLimit: number = 10
  _itemsCount: number = 0
  pagesList: string[]
  hasMoreLeft: boolean
  hasMoreRight: boolean

  @Input() get itemsCount(): number { return this._itemsCount }
  set itemsCount(itemsCount: number) {
    this._itemsCount = itemsCount
    this.pagesListUpdate()
  }

  @Input() get itemsOffset(): number { return this._itemsOffset }
  set itemsOffset(itemsOffset: number) {
    this._itemsOffset = itemsOffset
    this.pagesListUpdate()
  }
  
  @Input() get itemsLimit(): number { return this._itemsLimit }
  set itemsLimit(itemsLimit: number) {
    this._itemsLimit = itemsLimit
    this.pagesListUpdate()
  }  
  
  onItemClick(item: any) {
    var evt = new ItemClickEvent()
    evt.item = item
    this.itemclick.emit(evt)
  }
  
  pagesListUpdate() {
    var count = this.itemsCount,
    offset = this.itemsOffset, limit = this.itemsLimit;
    if(!(count > 0 && offset >= 0 && limit > 0)) {
      this.pagesList = [];
      this.hasMoreLeft = false;
      this.hasMoreRight = false;
      return;
    }
    var pmamount = this.pagingMaxAmount,
    pageCount = Math.ceil(count / limit),
    page = Math.floor(offset / limit) + 1,
    plen = Math.min(pageCount - page + 1, pmamount),
    startpage = Math.max(1, page - Math.floor(pmamount - plen / 2.0)),
    splen = Math.min(pageCount - startpage + 1, pmamount);
    var ret: string[] = [];
    for(var i = 0; i < splen; ++i) {
      ret.push((startpage + i)+'');
    }
    this.pagesList = ret;
    this.hasMoreLeft = startpage > 1;
    this.hasMoreRight = startpage + splen - 1 < pageCount;
  }
  mkItemsScroll(offset: number): string {
    return offset + "-" + this.itemsLimit
  }
  public static parseItemsScroll(value: string): number[] {
    var values = value.split('-').map((v) => parseInt(v))
    if(values.length != 2 || isNaN(values[0]) || isNaN(values[1]))
      throw new Error("Value error: " + value)
    return values
  }
  onFieldButtonClick(item: any, field: TFButton, evt: any) {
    if(field.handler != null) {
      var ret = field.handler(item)
      if(ret instanceof Promise2) {
        var btn = evt.target;
        btn.disabled = true;
        ret.catch(this.gui.alerterrorbound)
          .finally(() => { btn.disabled = false })
      }
    }
  }
}
