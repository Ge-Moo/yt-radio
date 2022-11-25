import blessed from 'blessed'
import {home} from '../youtube/home.js'
import {reload} from '../tool/reload.js'
import {Global} from '../tool/global.js'
import {convert} from '../tool/convert.js'
import {play,media,stop} from '../tool/play.js'
import {find} from '../tool/find.js'
import {template,templateSet} from '../tool/template.js'
import {wait} from "../tool/time.js"

const screen = blessed.screen({
  smartCSR: true,
  dockBorders: true
})

const box = blessed.box({
  top: '10%',
  mouse: true,
  left: 'center',
  width: '95%',
  height: '72%',
  tags: true,
  border: {
    type: 'line'
  },
})

screen.key('q', async () => {
  await stop()
  process.exit()
})

const box_video =  blessed.list({
  left: 'center',
  width: '90%',
  height: '90%',
  mouse: true,
  style: {
    selected : {
      bg: 'cyan'
    },
  },
  content: '{bold}VIDEO{/bold}!',
  tags: true,
})

box_video.on('select', async (e) => {
  Global.index = parseInt(e.content.split('.')[0])-1
  if(Global.PID) await stop()
  play(Global.videos[Global.index])
  box_info.setContent(template(e.content,'loading','--:--  ',0,'-'))
  screen.render()
})

media.on('info',(data) => {
  let currentVideo = data.videoDetails
  let rawLength = Number(currentVideo.lengthSeconds)
  let minute = Math.floor(rawLength / 60)
  let second = rawLength - (minute * 60)
  let minuteString = minute.toString().length == 1 ? `0${minute}` : `${minute}`
  let secondString = second.toString().length == 1 ? `0${second}` : `${second}`
  let length = `${minuteString}:${secondString}`  
  box_info.setContent(template(currentVideo.title,'prepare',`${length}  `,Number(currentVideo.viewCount),currentVideo.author.name))
  screen.render()
})

media.on('play',() => {
  box_info.setContent(templateSet('status','playing'))
  screen.render()
})

media.on('done', () => {
  box_info.setContent(templateSet('status','done'))
  screen.render()
  wait(1)
  Global.index++ 
  play(Global.videos[Global.index])
})

media.on('stop', () => 'done'/* pass */ )

const box_seacrh = blessed.textbox({
  left: 'center',
  vi: true,
  inputOnFocus: true,
  width: '95%',
  value: 'Seacrh ',
  height: '14%',
  mouse:true,
  tags: true,
  border: {
    type: 'line'
  },
})

box_seacrh.on('submit',async (e) => {
  let rawYt = await find(e)
  if(typeof rawYt == 'string'){
    return 
  }
  reload(convert(rawYt))
  box_video.clearItems()
  let HomeContent = Global.view
  HomeContent.forEach((element: string) => {
    box_video.add(element)
  });
  screen.render()
})

const box_info = blessed.box({
  content : "No Song Selected ",
  align: 'left',
  valign: 'top',
  left: 'center',
  bottom: '0',
  width: '95%',
  height: '25%',
  border: {
    type: 'line'
  }
})

async function main(){
  let rawHomeContent = await home()
  reload(convert(rawHomeContent))
  let HomeContent = Global.view
  HomeContent.forEach((element: string) => {
    box_video.add(element)
  });
  screen.title = 'My Youtube Radio'
  screen.append(box_seacrh)
  screen.append(box_info)
  box.append(box_video)
  screen.append(box)
  screen.render()
}
export default main
