export interface channel {
  id : string,
  name : string,
  link : string,
  verified: boolean,
  thumbnail: string 
}

export interface video {
  title: string,
  id: string, 
  link: string,
  channel: channel,
  description: string,
  views: number
}