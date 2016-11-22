import { Input, Output, Component, EventEmitter } from '@angular/core'
import { FormControl } from '@angular/forms'

import { FilterQueryComponent } from './filter-query.component'
import { FilterTypeComponent } from './filter-type.component'

export class SelectOption {
  constructor(public value: string, public label: string) { }
}

export function SelectMultipleRequiredValidator(c: FormControl) {
  return c.value.length > 0 ? null : { required: true }
}

@Component({
  selector: 'neatselect',
  template: `
<select class="form-control" [name]="name" [ngModel]="value" (ngModelChange)="onValueChange($event)">
  <option *ngIf="hasnull" value="">{{ nulllabel }}</option>
  <option *ngFor="let option of options" [value]="option.value">{{ option.label }}</option>
</select>
`
})
export class NeatSelectComponent {
  @Input() name: string
  private _value: any
  get value(): any {
    return this._value
  }
  @Input('value')
  set value(value) {
    if(!value)
      value = ''
    this._value = value
  }
  onValueChange(value: any) {
    this.value = value
    this.valueChange.emit(this.value)
  }
  @Output() valueChange = new EventEmitter<any>()
  private _options: string[]
  get options() {
    return this._options
  }
  @Input() set options(options) {
    if(!options)
      options = []
    this._options = options
  }
  @Output() optionsChange = new EventEmitter<void>()
  @Input() hasnull: boolean = false
  @Input() nulllabel: string = ""
}
