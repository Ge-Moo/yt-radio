import {video} from "../youtube/youtube.model.js"
import {ChildProcess} from "child_process"
export interface global {
  videos: video[],
  PID: ChildProcess,
  view: string[],
  index: number,
  session: boolean,
}

