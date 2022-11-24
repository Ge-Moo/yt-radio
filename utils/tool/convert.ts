import {Results,Video} from "scrape-youtube"
import {video} from '../youtube/youtube.model.js'

export function convert(result: Results): video[]{
  return result.videos.map((vid: Video) => {
    return {
      title: vid.title,
      id: vid.id, 
      link: vid.link,
      channel: vid.channel,
      description: vid.description,
      views: vid.views
    }
  })
}