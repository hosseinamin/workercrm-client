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
  <div class="col-lg-2 col-md-2 col-sm-2">
    <filter-query *ngIf="filterhasquery" placeholder="Search" [mModel]="filterquery" (mModelChange)="onfilterqueryChange($event)"></filter-query>
  </div>
  <div class="col-lg-2 col-md-2 col-sm-2">
    <filter-type *ngIf="filterhastype" [label]="filtertype_label" [mModel]="filtertype" (mModelChange)="onfiltertypeChange($event)" [types]="filtertypes"></filter-type>
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
  </div>
</div>
`
})
export class ManageTableComponent {

  constructor(public gui: GUIService) { }
  
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
  onItemClick(item: any) {
    var evt = new ItemClickEvent()
    evt.item = item
    this.itemclick.emit(evt)
  }
  onFieldButtonClick(item: any, field: TFButton, evt: any) {
    if(field.handler != null) {
      var ret = field.handler(item)
      if(ret instanceof Promise) {
        var btn = evt.target;
        btn.disabled = true;
        ret.then(() => {
          btn.disabled = false
        }).catch((reason) => {
          btn.disabled = false
          this.gui.alerterror(reason)
        })
      }
    }
  }
}
