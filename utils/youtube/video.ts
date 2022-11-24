import ytdl from "ytdl-core"
import fs from "fs"
import { resolve } from "path" 
import { video } from "./youtube.model.js"
import { media } from "../tool/play.js"
export async function downloadBuffer(file: video){
	let bufferFileName: string = ".buffer.mp3"
	let videoInfo = await ytdl.getInfo(file.id)
	media.emit('info',videoInfo)
  // setup ytdl before write in to disk 
	ytdl(file.id,{filter : format => format.quality == 'tiny' && format.hasAudio == true})
	.pipe(fs.createWriteStream(bufferFileName))
}

export async function downloadToDisk(file: video): Promise<string> {
	return new Promise((resolve,reject) => {
		let filename = `${file.title}.mp3`
    // initilize youtube environment 
		let yt = ytdl(file.id,{filter : (format) => format.hasAudio == true && format.hasVideo == false})
		yt.pipe(fs.createWriteStream(`/home/ary/Music/${filename}`)).on('finish',() => {
			resolve('done')
		})
	})
}