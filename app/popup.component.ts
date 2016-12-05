import { Component, ViewChild, ElementRef } from '@angular/core'
import { Router } from '@angular/router'
import { UserService } from './user.service'

export class PopupButton {
  constructor(public label: string, public btntype: string,
              public onClick: Function) { }
}

declare var Modal: any

@Component({
  selector: 'popup',
  template: `
<div #modal class="modal fade" tabindex="-1" role="dialog" (click)="onDismissed($event)">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" (click)="onClose()" attr.aria-label="Close"><span attr.aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">{{ title }}</h4>
      </div>
      <div class="modal-body">
        {{ body }}
      </div>
      <div class="modal-footer">
        <button *ngIf="hasclose" type="button" class="btn btn-default" (click)="onClose()">{{ closelabel }}</button>
        <button *ngFor="let button of buttons" type="button"
                [class]="'btn btn-' + button.btntype"
                (click)="button.onClick($event)">{{ button.label }}</button>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
  `
})
export class PopupComponent {
  public title: string
  public body: string
  public hasclose: boolean = true
  public closelabel: string = "Close"
  public buttons: PopupButton[] = []
  @ViewChild('modal') modalRef: ElementRef
  private resolvePopupPromise: Function = null
  
  public popup(): Promise2.IThenable<void> {
    if(!this.modalRef)
      return Promise2.resolve();
    var modal = new Modal(this.modalRef.nativeElement, {})
    modal.open()
    return <Promise2.IThenable<void>><any>
      new Promise2((resolve) => {
        this.resolvePopupPromise = () => {
          this.resolvePopupPromise = null
          resolve()
        }
      })
  }
  public close(): Promise2.IThenable<void> {
    if(!this.modalRef)
      return Promise2.resolve();
    var modal = new Modal(this.modalRef.nativeElement, {})
    // TODO:: check if modal is closed already
    return this.onClose()
  }

  onClose() {
    if(!this.modalRef)
      return;
    var modal = new Modal(this.modalRef.nativeElement, {})
    modal.close()
    return <Promise2.IThenable<void>><any>new Promise2((resolve) => {
      setTimeout(() => {
        if(this.resolvePopupPromise != null)
          this.resolvePopupPromise();
        resolve()
      }, modal.options.duration)
    })
  }
  onDismissed(e: any) {
    if(!this.modalRef)
      return;
    var modalEl = this.modalRef.nativeElement;
    // bootstrap dismiss check
    if ( e.target.parentNode.getAttribute('data-dismiss') === 'modal' || e.target.getAttribute('data-dismiss') === 'modal' || e.target === modalEl ) {
      var modal = new Modal(this.modalRef.nativeElement, {})
      if(this.resolvePopupPromise != null)
        setTimeout(this.resolvePopupPromise, modal.options.duration)
    }
  }
}
