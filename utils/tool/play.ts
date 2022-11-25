import {video} from "../youtube/youtube.model.js"
import {Global as global} from "./global.js"
import {wait} from "../tool/time.js"
import {downloadBuffer,getAudioStream} from "../youtube/video.js"
import {exec} from "child_process"
import {EventEmitter} from 'events'
import fs from "fs"

export let media = new EventEmitter()

export async function stop(){
	return new Promise ((resolve,reject) => {
		exec('pkill ffplay',() => resolve(''))
	})
}

export async function play(vid: video){

	// kill last media
	if(global.PID){
		global.PID = undefined
		await stop()
	}

	// get url stream from video for audio only
	let urlStream = await getAudioStream(vid)
	let option = ["-nodisp","-vn","-loglevel","quiet","-autoexit",`'${urlStream}'`]

	// play audio 
	media.emit('play')
	let hasEmit = false 
	global.PID = exec(`ffplay ${option.join(' ')}`,(err,stdout,stderr) => {
		if(err){
			media.emit('stop')
			return
		}
		if(!hasEmit){
			media.emit('done')
			hasEmit = true 
		}
	}).pid
	await wait(0.5)

}

