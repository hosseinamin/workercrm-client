import { NgZone, Injectable } from '@angular/core'
import { PopupComponent, PopupButton } from './popup.component'
import { ProgressBlockerComponent } from './progress-blocker.component'

@Injectable()
export class GUIService {
  private mpopup: PopupComponent
  private mpopupPromise: Promise2.IThenable<any> = Promise2.resolve()
  private progressBlocker: ProgressBlockerComponent

  constructor(private zone: NgZone) { }
  
  bindMainPopup(popup: PopupComponent) {
    this.mpopup = popup
  }
  bindProgressBlocker(progressBlocker: ProgressBlockerComponent) {
    this.progressBlocker = progressBlocker
  }
  public alerterrorbound: () => {} = this.alerterror.bind(this)
  alerterror(reason: any) {
    if(reason == Promise2.Aborted)
      return Promise2.resolve()
    if(typeof(reason) == 'object' &&
       typeof(reason.toString) == 'function')
      reason = reason.toString()
    return this.alert("Error", reason)
  }
  alert(title: string, body: string): Promise2.IThenable<void> {
    var mpopup = this.mpopup
    if(mpopup == null)
      return Promise2.resolve()
    return this.mpopupPromise = this.mpopupPromise.then(() => {
      return new Promise2<void>((resolve) => {
        this.zone.run(() => {
          mpopup.title = title
          mpopup.body = body
          mpopup.buttons = []
          mpopup.hasclose = true
          mpopup.closelabel = "Close"
          mpopup.popup().then(() => {
            this.zone.run(resolve)
          })
        })
      })
    })
  }
  confirm(title: string, body: string): Promise2.IThenable<boolean> {
    var mpopup = this.mpopup
    if(mpopup == null)
      return Promise2.resolve(false)
    return this.mpopupPromise = this.mpopupPromise.then(() => {
      return new Promise2((resolve) => {
        this.zone.run(() => {
          var resolveStatus: boolean = false
          mpopup.title = title
          mpopup.body = body
          mpopup.buttons = [
            new PopupButton("Yes", "primary", () => {
              resolveStatus = true
              mpopup.close()
            }),
            new PopupButton("No", "default", () => {
              resolveStatus = false
              mpopup.close()
            })
          ]
          mpopup.hasclose = false
          mpopup.popup().then(() => {
            return resolveStatus
          }).then(() => {
            this.zone.run(resolve)
          })
        })
      })
    })
  }
  isBlocking() {
    if(this.progressBlocker == null)
      return false
    return this.progressBlocker.isBlocking()
  }
  blockloading() {
    return this.block("Loading...")
  }
  block(message: string) {
    if(this.progressBlocker == null)
      return
    this.zone.run(() => {
      this.progressBlocker.message = message
      this.progressBlocker.block()
    })
  }
  public unblockbound: () => {} = this.unblock.bind(this)
  unblock() {
    if(this.progressBlocker == null)
      return
    this.zone.run(() => {
      this.progressBlocker.unblock()
    })
  }
}
