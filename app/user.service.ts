import { Injectable, Inject } from '@angular/core'
import { AppConfig } from './app.config'

export class User {
  public email: string
  public first_name: string
  public last_name: string
  public username: string
}

export class RegisterInfo {
  public email: string
  public first_name: string
  public last_name: string
  public username: string
  public password: string
}

export class ConfigData {
  public id: string
  public inherits_id: string
  public inherits: ConfigData
  public data: any = {}
}

export class Config {
  public id: string
  public name: string
  public configdata_id: string
  public configdata: ConfigData
}

export class Worker {
  public id: string
  public name: string
  public key: string
  public baseconfig_id: string = null
  public baseconfig: Config
  public configdata_id: string
  public configdata: ConfigData
//  NIMPL: is not implemented yet
//  public needs_clean_state: boolean
//  public needs_clean_all_states: boolean
}

export class UserServiceError extends Error {
  constructor(public status_code: number, public message: string) {
    super(message)
  }
  toString() {
    return this.message + " (" + this.status_code + ")"
  }
}

function encodeQueryData(data: {}): string {
  let ret: string[] = [];
  for (let d in data)
    if(data[d] !== null)
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
   return ret.join('&');
}

@Injectable()
export class UserService {
  public token: string
  public apiversion: string = "1.0"
  public servicehost: string
  public user: User
  public EMULATE_NETWORK_LATENCY: boolean = false
  constructor(@Inject(AppConfig) private appCfg: AppConfig) {
    this.servicehost = appCfg.userServiceHost
    this.token = localStorage.getItem('X-USER-TOKEN')
  }
  apicall(method: string, funcname: string, params: {},
          token: string = this.token): Promise2.IThenable<any> {
    if(!this.EMULATE_NETWORK_LATENCY)
      return this._apicall(method, funcname, params, token)
    return new Promise2<any>((resolve, reject, bindabort) => {
      if(!bindabort(null)) // already aborted
        return
      var tid = setTimeout(() => {
        var promise = this._apicall(method, funcname, params, token)
        bindabort(promise.abort.bind(promise))
        promise.then(resolve, reject)
      }, 2000)
      bindabort(clearTimeout.bind(this, tid))
    })
  }
  _apicall(method: string, funcname: string, params: {},
          token: string = this.token): Promise2.IThenable<any> {
    return new Promise2<any>((resolve, reject, bindabort) => {
      var getq: any,postq: any;
      if(method == 'DELETE' || method == 'GET') {
        getq = params
      } else if(method == 'POST') {
        postq = params
      }
      var url = this.servicehost + '/' + this.apiversion + '/' + funcname +
        (getq ? '?' + encodeQueryData(getq) : '')
      var data = postq ? encodeQueryData(postq) : undefined

      var xhr = new XMLHttpRequest()
      var _aborted = false
      if(!bindabort(() => {
            _aborted = true
            xhr.abort()
          }))
        return // already aborted (onabort no promises)
      xhr.onreadystatechange = () => {
        if(xhr.readyState == 4 && !_aborted) {
          if(xhr.status >= 200 && xhr.status < 300) {
            try {
              var data = JSON.parse(xhr.responseText)
              resolve(data)
            } catch(e) {
              reject(new UserServiceError(-1, "Response is not in json format!"))
            }
          } else {
            try {
              var data = JSON.parse(xhr.responseText)
              reject(new UserServiceError(data.code, data.error))
            } catch(e) {
              if(xhr.status == 0) {
                // possibly cross-origin blocked
                reject(new UserServiceError(0, "Possibly Cross-Origin request blocked"))
              } else {
                reject(new UserServiceError(xhr.status, xhr.statusText))
              }
            }
          }
        }
      }
      xhr.open(method, url)
      if(token != null)
        xhr.setRequestHeader('X-USER-TOKEN', token)
      if(method == 'POST')
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.overrideMimeType('text/plain') // ignore type
      xhr.send(data)
    })
  }
  
  // user related
  register(info: RegisterInfo) {
    return new Promise2(((resolve, reject) => {
      reject("Not implemented")
    }))
  }
  login(username: string, password: string, expires: number = null) {
    return this.apicall('POST', 'login', {
      username: username,
      password: password,
      expires: expires
    }, null).then((response) => {
      this.token = response.token
      // save token in localStorage
      localStorage.setItem('X-USER-TOKEN', response.token)
      return this.getUser(true)
    })
  }
  logout() {
    return new Promise2((resolve, reject) => {
      this.token = null
      // delete token from localStorage
      localStorage.removeItem('X-USER-TOKEN')
      this.user = null
      resolve()
    })
  }
  checkLogin(): Promise2.IThenable<boolean> {
    if(!this.token)
      return Promise2.resolve(false)
    return <Promise2.IThenable<boolean>><any>
      this.getUser().then((user) => { return !!user })
      .catch(() => { this.logout() })
  }
  getUser(forcerequest: boolean = false): Promise2.IThenable<User> {
    if(!forcerequest && this.user != null)
      return Promise2.resolve(this.user)
    return this.apicall('GET', 'myInfo', null).then((response) => {
      this.user = <User>response.record
      return this.user
    })
  }

  // worker
  getWorkers(params: {}) {
    return this.apicall('GET', 'workers', params)
  }
  getWorker(id: string, with_baseconfig: boolean = true,
            with_configdata: boolean = true) {
    return this.apicall('GET', 'worker', {
      id: id,
      with_baseconfig: with_baseconfig,
      with_configdata: with_configdata
    })
  }
  createWorker(worker: Worker) {
    var data: any = {};
    for(var k in worker) data[k] = worker[k];
    this.__validateconfigdata(data)
    delete data.baseconfig
    return this.apicall('POST', 'workerCreate', data)
  }
  updateWorker(worker: Worker) {
    var data: any = {};
    for(var k in worker) data[k] = worker[k];
    this.__validateconfigdata(data)
    delete data.baseconfig
    return this.apicall('POST', 'workerUpdate', data)
  }
  deleteWorker(id: string) {
    return this.apicall('DELETE', 'worker', { id: id })
  }

  // config
  getConfigs(params: {}) {
    return this.apicall('GET', 'configs', params)
  }
  getConfig(id: string, with_configdata: boolean = true) {
    return this.apicall('GET', 'config', {
      id: id,
      with_configdata: with_configdata
    })  
  }
  createConfig(config: Config) {
    var data: any = {};
    for(var k in config) data[k] = config[k];
    this.__validateconfigdata(data)
    return this.apicall('POST', 'configCreate', data)
  }
  updateConfig(config: Config) {
    var data: any = {};
    for(var k in config) data[k] = config[k];
    this.__validateconfigdata(data)
    return this.apicall('POST', 'configUpdate', data)
  }
  deleteConfig(id: string) {
    return this.apicall('DELETE', 'config', { id: id })
  }

  private __validateconfigdata(data: any)  {
    if(data.configdata) {
      if(data.configdata.id) {
        if(!data.configdata_id)
          data.configdata_id = data.configdata.id
        delete data.configdata
      } else {
        data.configdata = JSON.stringify(data.configdata.data);
        delete data.configdata_id
      }
    }
  }
}

