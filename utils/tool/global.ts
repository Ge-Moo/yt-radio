import {video} from '../youtube/youtube.model.js'
import {global} from "./tool.model.js"
import {spawn} from "child_process"
export const Global: global = { 
  videos: [],
  view: [''],
  index: 0,
  PID: undefined,
  session_d: false,
  session_p: false,
}
