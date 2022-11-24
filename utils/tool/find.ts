import {input} from "./input.js"
import youtube,{Results} from "scrape-youtube"

export async function find(query: string): Promise<Results | string> {
  // ask query to user
  try { 
    return await youtube.search(query)
  } catch (e) {
    return new Promise((resolve,reject) => resolve("something went wrong"))
  }
}