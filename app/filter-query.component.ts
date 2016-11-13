import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'filter-query',
  template: `
    <div class="form-group">
      <label *ngIf="label" for="filter-query-input">{{ label }}</label>
      <input class="form-control" [ngModel]="mModel" (ngModelChange)="change($event)" type="text" id="filter-query-input" name="filterquery" [placeholder]="placeholder" />
    </div>
`
})
export class FilterQueryComponent {
  @Input() label: string = null
  @Input() placeholder: string = ""
  @Output() mModelChange = new EventEmitter<string>()
  @Input() mModel: string
  change(newVal: string) {
    this.mModel = newVal
    this.mModelChange.emit(newVal)
  }
}

