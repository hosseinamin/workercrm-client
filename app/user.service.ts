import { Injectable } from '@angular/core'

export class User {
  public username: string
}

export class RegisterInfo {
  public nickname: string
  public username: string
  public password: string
}

export class QueryOrderByEntry {
  public field: string
  public order: string
}

export class QueryOrderBy {
  public entries: QueryOrderByEntry[]
}

export class QueryRange {
  constructor(public offset: number, public limit: number) { }
}

export class QueryCondition {
  /**
   * array of four strings as [ field, logic-op, value, valuetype ]
   */
  public cond: string[]
  public op: string = null
  public next: QueryCondition
  constructor(...args: any[]) {
    var qc: QueryCondition = this
    var argtype: string = "cond"
    for(let arg of args) {
      switch(argtype) {
      case 'cond':
        if(!(arg instanceof Array) || arg.length < 2 || arg.length > 4) {
          throw new Error("Invalid condition argument: " + JSON.stringify(arg))
        }
        if(arg.length == 3) {
          arg = arg.concat([ "string" ])
        }
        if(arg.length == 2) {
          arg = [ arg[0], "=", arg[1], "string" ]
        }
        qc.cond = arg
        argtype = 'op'
        break;
      case 'op':
        qc.op = arg
        argtype = 'cond'
        let tmp = new QueryCondition(arg)
        qc.next = tmp
        qc = tmp
        break;
      }
    }
    if(argtype == 'op')
      throw new Error("Invalid arguments, a cond expected at the end")
  }
}

export class ListFetchQuery {
  constructor(public condition: QueryCondition, public range: QueryRange,
                 public orderby: QueryOrderBy) { }
}

export class Worker {
  public id: string
  public name: string
  public config_id: number
  public needs_clean_state: boolean
  public needs_clean_all_states: boolean
}

export class Config {
  public static TYPE_KEEP = "keep"
  public static TYPE_FOR_WORKER = "for_worker"
  public id: string
  public name: string
  public type: string
  public content: string
}

@Injectable()
export class UserService {
  public user: User = new User()
  constructor() {
    this.user.username = "Hossein"
    // this.user = null
  }
  // user related
  register(info: RegisterInfo) {
    return new Promise(((resolve, reject) => {
      reject("Not implemented")
    }))
  }
  login(username: string, password: string) {
    return new Promise((resolve, reject) => {
      this.user = new User()
      this.user.username = username
      resolve(true)
    })
  }
  logout() {
    return new Promise((resolve, reject) => {
      this.user = null
      resolve()
    })
  }
  getUser() {
    return new Promise((resolve, reject) => { resolve(this.user) })
  }

   // worker
  getWorkers(listFetchQuery: ListFetchQuery) {

  }
  getWorker(id: string) {

  }
  saveWorker(worker: Worker) {

  }
  createWorker(worker: Worker) {

  }
  updateWorker(worker: Worker) {

  }
  deleteWorkers(id: string[]) {

  }

  // config
  getConfigs(listFetchQuery: ListFetchQuery) {

  }
  getConfig(id: string) {

  }
  saveConfig(worker: Config) {

  }
  createConfig(worker: Config) {

  }
  updateConfig(worker: Config) {

  }
  deleteConfigs(id: string[]) {

  }
}

