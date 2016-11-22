import { Input, Output, Component, ViewChild, EventEmitter } from '@angular/core'
import { NgForm, FormControl, Validators } from '@angular/forms'

import { FilterQueryComponent } from './filter-query.component'
import { FilterTypeComponent } from './filter-type.component'

import { Router, ActivatedRoute } from '@angular/router'
import { UserService, ConfigData } from './user.service'
import { GUIService } from './gui.service'

import { SelectOption, SelectMultipleRequiredValidator } from './neatselect.component'

@Component({
  selector: 'configdata-edit',
  template: `
<div *ngIf="_configdata">
  <!-- gears -->
  <div class="col-lg-4 col-md-6 form-group">
    <label for="name">Gears:</label>
    <select class="form-control" [name]="name+'.gears'" [id]="name+'.gears'" [(ngModel)]="_configdata.data.gears" [formControl]="form.controls[name+'.gears']" required multiple>
      <option *ngFor="let gear of gears" [value]="gear.value">{{ gear.label }}</option>
    </select>
  </div>
</div>
`
})
export class ConfigDataEditComponent {
  @Input() name: string
  @Input() form: NgForm
  _configdata: ConfigData
  @Output() configdataChange = new EventEmitter<ConfigData>()
  gears: SelectOption[] = [
    new SelectOption("skin-p", "Skin protection"),
    new SelectOption("eye-p", "Eye protection"),
    new SelectOption("hearing-p", "Hearing protection"),
    new SelectOption("helmet", "Helmet"),
    new SelectOption("camera", "Camera"),
    new SelectOption("computer", "Computer"),
    new SelectOption("toolbox", "Toolbox")
  ]
  constructor(private gui: GUIService, private userService: UserService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    var control = this.form.control
    var data = this.configdata.data
    control.addControl(this.name + '.gears', new FormControl(data.gears, SelectMultipleRequiredValidator));
  }
  
  @Input() get configdata() { return this._configdata }
  set configdata(configdata) {
    this._configdata = configdata
    if(!configdata) {
      throw new Error("Config data required!");
    }
    var data = configdata.data = configdata.data || {}
    var gears = data.gears = Array.isArray(data.gears) ? data.gears : []
    // eval gears
    for(var i = 0, len = gears.length; i < len;) {
      var gear = gears[i]
      if(typeof gear != 'string')
        gears.splice(i, 1); // remove non-strings
      else
        i++;
    }
  }
}

