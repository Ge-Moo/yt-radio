import ytdl from "ytdl-core"
import fs from "fs"
import { resolve } from "path" 
import { video } from "./youtube.model.js"
import { media } from "../tool/play.js"

export async function downloadBuffer(file: video){
	if(!file.title){
		return media.emit('finish')
	}
	let bufferFileName: string = `${file.title}.mp3`
	let path = process.env.HOME
	let videoInfo = await ytdl.getInfo(file.id)
	media.emit('info',videoInfo)
  // setup ytdl before write in to disk 
	ytdl(file.id,{filter : format => format.quality == 'tiny' && format.hasAudio == true})
	.pipe(fs.createWriteStream(`${path}/Downloads/${bufferFileName}`).on('finish',() => {
		media.emit('finish')
	}))
}

export async function getAudioStream(file: video): Promise<string>{
	let buffer = await ytdl.getInfo(file.id);
	media.emit('info',buffer)
	let audioFormat = ytdl.chooseFormat(buffer.formats, { quality: 'highestaudio', filter: 'audioonly' });
	return audioFormat.url;
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