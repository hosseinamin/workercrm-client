import { Injectable } from '@angular/core'
import { PopupComponent, PopupButton } from './popup.component'
import { ProgressBlockerComponent } from './progress-blocker.component'

@Injectable()
export class GUIService {
  private mpopup: PopupComponent
  private mpopupPromise: Promise<any> = Promise.resolve()
  private progressBlocker: ProgressBlockerComponent
  bindMainPopup(popup: PopupComponent) {
    this.mpopup = popup
  }
  bindProgressBlocker(progressBlocker: ProgressBlockerComponent) {
    this.progressBlocker = progressBlocker
  }
  alerterror(reason: string) {
    return this.alert("Error", reason)
  }
  alert(title: string, body: string): Promise<void> {
    var mpopup = this.mpopup
    if(mpopup == null)
      return Promise.resolve()
    return this.mpopupPromise = this.mpopupPromise.then(() => {
      mpopup.title = title
      mpopup.body = body
      mpopup.buttons = []
      mpopup.hasclose = true
      mpopup.closelabel = "Close"
      return mpopup.popup()
    })
  }
  confirm(title: string, body: string): Promise<boolean> {
    var mpopup = this.mpopup
    if(mpopup == null)
      return Promise.resolve(false)
    return this.mpopupPromise = this.mpopupPromise.then(() => {
      var resolveStatus: boolean = false
      mpopup.title = title
      mpopup.body = body
      mpopup.buttons = [
        new PopupButton("Yes", "default", () => {
          resolveStatus = true
          mpopup.close()
        }),
        new PopupButton("No", "default", () => {
          resolveStatus = false
          mpopup.close()
        })
      ]
      mpopup.hasclose = false
      return mpopup.popup().then(() => {
        return new Promise((resolve) => {
          resolve(resolveStatus)
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
    this.progressBlocker.message = message
    this.progressBlocker.block()
  }
  unblock() {
    if(this.progressBlocker == null)
      return
    this.progressBlocker.unblock()
  }
}
