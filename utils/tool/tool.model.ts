import {video} from "../youtube/youtube.model.js"
import {ChildProcess} from "child_process"
export interface global {
  videos: video[],
  PID: number | undefined,
  view: string[],
  index: number,
  session_d: boolean,
  session_p: boolean
}

