import blessed from 'blessed'
import {home} from '../youtube/home.js'
import {reload} from '../tool/reload.js'
import {Global} from '../tool/global.js'
import {convert} from '../tool/convert.js'
import {play,media,stop} from '../tool/play.js'
import {downloadBuffer} from "../youtube/video.js"
import {find} from '../tool/find.js'
import {template,templateSet} from '../tool/template.js'
import {wait} from "../tool/time.js"

let download = false
const screen = blessed.screen({
  smartCSR: true,
  dockBorders: true
})

const box = blessed.box({
  top: '10%',
  mouse: true,
  left: 'center',
  width: '95%',
  height: '71%',
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
  if(download){
    return 
  }
  Global.index = parseInt(e.content.split('.')[0])-1
  if(Global.session) await stop()
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

media.on('done', async() => {
  box_info.setContent(templateSet('status','done'))
  screen.render()
  await wait(1)
  Global.index++ 
  play(Global.videos[Global.index])
})

media.on('stop', () => 'done'/* pass */ )

media.on('finish',() => {
  download = false
  box_info.setContent(templateSet('status','downloaded'))
  screen.render()
})

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
  content : template("No Song Selected ","sleep",'--:-- ',0,'-'),
  align: 'left',
  valign: 'bottom',
  left: '0',
  bottom: '0',
  width: '65%',
  height: '100%',
})

const button_box = blessed.button({
  content: 'Download',
  mouse : true,
  align : 'center',
  valign : 'middle',
  width : '20%',
  left: '70%',
  height : '50%',
  border : {
    type: 'line',
  },
  style : {
    fg : 'black',
    bg : 'green',
    hover : {
      bg : 'blue',
    }
  }
})

const bottom_box = blessed.box({
  left: 'center',
  bottom:'0',
  height: '28%',
  width: '95%',
  border : {
    type: 'line'
  }
})

bottom_box.append(button_box)
bottom_box.append(box_info)

button_box.on('press', async () => {
  download = true 
  await stop()
  downloadBuffer(Global.videos[Global.index])
  box_info.setContent(templateSet('status','download'))
  screen.render()
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
  screen.append(bottom_box)
  box.append(box_video)
  screen.append(box)
  screen.render()
}
export default main
