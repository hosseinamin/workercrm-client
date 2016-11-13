import { Component, EventEmitter, Input, Output } from '@angular/core';

export class FilterType {
  constructor(public name: string, public label: string) { }
}

@Component({
  selector: 'filter-type',
  template: `
    <div>
      <label for="filter-type-input">{{ label }}</label>
      <select [ngModel]="mModel" (ngModelChange)="change($event)" name="filtertype">
        <option value="" *ngIf="hasnull"></option>
        <option *ngFor="let atype of types" [value]="atype.name">{{ atype.label }}</option>
      </select>
    </div>
`
})
export class FilterTypeComponent {
  @Input() label: string
  @Output() mModelChange = new EventEmitter<string>()
  @Input() mModel: string
  @Input() hasnull: boolean
  @Input() types: FilterType[]
  change(newVal: string) {
    this.mModel = newVal
    this.mModelChange.emit(newVal)
  }
}
