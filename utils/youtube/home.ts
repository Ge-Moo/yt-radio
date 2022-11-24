import youtube,{Results} from "scrape-youtube"

export async function home (): Promise<Results> {
  let result = await youtube.search('')
  return result
}