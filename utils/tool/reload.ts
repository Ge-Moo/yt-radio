import {Global as global} from "./global.js"
import {Results} from "scrape-youtube"
import {video} from "../youtube/youtube.model.js"
export function reload(data: video[]){
  // asign data to videos global
	global.videos = data
	let i: number = 0
  // data is mising
	if(!data) { 
    global.view = []
    return 
  }
	let viewData = data.map((item: video): string => {
		let title: string = ""
		title = item.title
		i++
		return `${i}. ${title}`
	})
  global.view = viewData
	i = 0
}