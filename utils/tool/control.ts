import {Global} from './global.js'
import {exec} from 'child_process'

export function playCon(){
  return new Promise((resolve,reject) => {
    exec(`kill -STOP ${Global.PID}`,() => {
      resolve('')
    })
  })
}
export function stopCon(){
  return new Promise((resolve,reject) => {
    exec(`kill -CONT ${Global.PID}`,() => {
      resolve('')
    })
  })
}