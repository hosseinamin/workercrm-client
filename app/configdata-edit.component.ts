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
<div *ngIf="_configdata" class="col-lg-12">
  <div class="row">
    <!-- directories -->
    <div class="col-lg-4 col-md-6 form-group">
      <label [attr.for]="name+'.directories'">Directories:</label>
      <select class="form-control" [name]="name+'.directories'" [id]="name+'.directories'" [(ngModel)]="_configdata.data.directories" [formControl]="form.controls[name+'.directories']" required multiple>
        <option *ngFor="let directory of directories" [value]="directory.value">{{ directory.label }}</option>
      </select>
    </div>
    <div class="col-lg-4 col-md-6 form-group">
      <label [attr.for]="name+'.version'">Version:</label>
      <select class="form-control" [name]="name+'.version'" [id]="name+'.version'" [(ngModel)]="_configdata.data.version" [formControl]="form.controls[name+'.version']" required>
        <option *ngFor="let version of versions" [value]="version.value">{{ version.label }}</option>
      </select>
    </div>
  </div>
  <div class="row">
    <!-- max depth, priority, retry timeout -->
    <div class="col-lg-4 col-md-4 form-group">
      <label [attr.for]="name+'.max_depth'">Max Depth:</label>
      <input type="number" class="form-control" [name]="name+'.max_depth'" [id]="name+'.max_depth'" [(ngModel)]="_configdata.data.max_depth" [formControl]="form.controls[name+'.max_depth']" required/>
    </div>
    <div class="col-lg-4 col-md-4 form-group">
      <label [attr.for]="name+'.priority'">Process Priority:</label>
      <input type="number" class="form-control" [name]="name+'.priority'" [id]="name+'.priority'" [(ngModel)]="_configdata.data.priority" [formControl]="form.controls[name+'.priority']" required/>
    </div>
    <div class="col-lg-4 col-md-4 form-group">
      <label [attr.for]="name+'.retry_timeout'">Retry Timeout:</label>
      <input type="number" class="form-control" [name]="name+'.retry_timeout'" [id]="name+'.retry_timeout'" [(ngModel)]="_configdata.data.retry_timeout" [formControl]="form.controls[name+'.retry_timeout']" required/>
    </div>
  </div>
</div>
`
})
export class ConfigDataEditComponent {
  @Input() name: string
  @Input() form: NgForm
  _configdata: ConfigData
  @Output() configdataChange = new EventEmitter<ConfigData>()
  directories: SelectOption[] = [
    new SelectOption("Arts", "Arts"),
    new SelectOption("Business", "Business"),
    new SelectOption("Computers", "Computers"),
    new SelectOption("Games", "Games"),
    new SelectOption("Health", "Health"),
    new SelectOption("Home", "Home"),
    new SelectOption("News", "News"),
    new SelectOption("Recreation", "Recreation"),
    new SelectOption("Reference", "Reference"),
    new SelectOption("Regional", "Regional"),
    new SelectOption("Science", "Science"),
    new SelectOption("Shopping", "Shopping"),
    new SelectOption("Society", "Society"),
    new SelectOption("Sports", "Sports"),
  ]
  versions: SelectOption[] = [
    new SelectOption("stable", "stable"),
    new SelectOption("beta", "beta"),
    new SelectOption("alpha", "alpha"),
  ]
  constructor(private gui: GUIService, private userService: UserService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    var control = this.form.control
    var data = this.configdata.data
    control.addControl(this.name + '.directories', new FormControl(data.directories, SelectMultipleRequiredValidator));
    control.addControl(this.name + '.version', new FormControl(data.version, Validators.required));
    control.addControl(this.name + '.max_depth', new FormControl(data.max_depth, Validators.required));
    control.addControl(this.name + '.priority', new FormControl(data.priority, Validators.required));
    control.addControl(this.name + '.retry_timeout', new FormControl(data.retry_timeout, Validators.required));
  }
  
  @Input() get configdata() { return this._configdata }
  set configdata(configdata) {
    this._configdata = configdata
    if(!configdata) {
      throw new Error("Config data required!");
    }
    var data = configdata.data = configdata.data || {}
    var directories = data.directories = Array.isArray(data.directories) ? data.directories : []
    // eval directories
    for(var i = 0, len = directories.length; i < len;) {
      var directory = directories[i]
      if(typeof directory != 'string')
        directories.splice(i, 1); // remove non-strings
      else
        i++;
    }
    data.max_depth = data.max_depth === undefined ? 10 : data.max_depth
    data.priority = data.priority === undefined ? 5 : data.priority
    data.retry_timeout = data.retry_timeout === undefined ? 60 : data.retry_timeout
    data.version = data.version === undefined ? "stable" : data.version
  }
  public static validateData(data) {
    data.max_depth = isNaN(parseInt(data.max_depth)) ? 10 : parseInt(data.max_depth)
    data.priority = isNaN(parseInt(data.priority)) ? 5 : parseInt(data.priority)
    data.retry_timeout = isNaN(parseInt(data.retry_timeout)) ? 60 : parseInt(data.retry_timeout)
  }
}

