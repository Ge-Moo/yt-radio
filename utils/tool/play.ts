import {video} from "../youtube/youtube.model.js"
import {Global as global} from "./global.js"
import {downloadBuffer} from "../youtube/video.js"
import {exec} from "child_process"
import {EventEmitter} from 'events'
import fs from "fs"

export let media = new EventEmitter()
export function play(vid: video){
	let set = false 
	if (fs.existsSync(".buffer.mp3")) fs.unlinkSync(".buffer.mp3")
	downloadBuffer(vid)
	if(global.PID) exec('pkill ffplay')
	let st = setInterval(() => { 
		if(fs.existsSync(".buffer.mp3")){
			if(fs.statSync(".buffer.mp3").size != 0 ){
				clearInterval(st)
				let option = ["-nodisp","-vn","-loglevel","quiet","-loop","1",".buffer.mp3"]
				media.emit('play')
				global.PID = exec(`ffplay ${option.join(' ')}`)
			}
		}
	},100)
}
