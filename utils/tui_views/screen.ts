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
import {playCon,stopCon} from '../tool/control.js'

const screen = blessed.screen({
  smartCSR: true,
  dockBorders: true
})

const box = blessed.box({
  top: '10%',
  mouse: true,
  left: 'center',
  width: '95%',
  height: '60%',
  tags: true,
  border: {
    type: 'line'
  },
})

screen.key('q', async () => {
  await stop()
  process.exit()
})
screen.key('s',async() => await playCon())
screen.key('p',async() => await stopCon())
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
  if(Global.session_d){
    return 
  } else {
    if(Global.session_p){
      await stop()
      return 
    }
    Global.session_p = true
    Global.index = parseInt(e.content.split('.')[0])-1
    // if(Global.session_p) await stop()
    play(Global.videos[Global.index])
    box_info.setContent(template(e.content,'loading','--:--  ',0,'-'))
    screen.render()
  }
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
  Global.session_p = false
  box_info.setContent(templateSet('status','playing'))
  screen.render()
})

media.on('done', async() => {
  box_info.setContent(templateSet('status','done'))
  screen.render()
  await wait(1)
  Global.index++ 
  await play(Global.videos[Global.index])
})

media.on('stop', () => 'done'/* pass */ )

media.on('finish',() => {
  Global.session_d = false
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
  left: 'center',
  bottom: '0',
  width: '95%',
  height: '40%',
})

const buttons_box = blessed.box({
  top: '0%',
  left: 'center',
  width : '95%',
  height : '60%',
})

const button_exit = blessed.button({
  content: 'exit',
  padding : 0,
  mouse : true,
  left: '36%',
  width : '20%',
  align: 'center',
  height : '60%',
  border : {
    type: 'line',
  },
})
button_exit.on('press',async () => {
  await stop()
  process.exit() 
})

const button_play = blessed.button({
  content: 'Play',
  padding : 0,
  mouse : true,
  top: '0%',
  width : '20%',
  align: 'center',
  height : '60%',
  border : {
    type: 'line',
  },
})
button_play.on('press',async() =>{ 
  box_info.setContent(templateSet('status','playing'))
  screen.render()
  await stopCon()
})

const button_pause = blessed.button({
  content: 'Pause',
  padding : 0,
  mouse : true,
  left: '18%',
  width : '20%',
  align: 'center',
  height : '60%',
  border : {
    type: 'line',
  },
})
button_pause.on('press',async() => { 
  box_info.setContent(templateSet('status','pause'))
  screen.render()
  await playCon()
})

const button_download = blessed.button({
  content: 'Download',
  padding : 0,
  mouse : true,
  top: '0%',
  left: '54%',
  width : '20%',
  align: 'center',
  height : '60%',
  border : {
    type: 'line',
  },
})

button_download.setFront()
button_download.on('press', async () => {
  if(Global.session_p == true || Global.session_d == true){
    return  
  }else { 
    Global.session_d = true 
    await stop()
    downloadBuffer(Global.videos[Global.index])
    box_info.setContent(template('analyzing...','download','--:--',0,'-'))
    screen.render()
  }
})

const bottom_box = blessed.box({
  left: 'center',
  bottom:'0',
  height: '40%',
  width: '95%',
  border : {
    type: 'line'
  }
})

buttons_box.append(button_download)
buttons_box.append(button_pause)
buttons_box.append(button_play)
buttons_box.append(button_exit)
bottom_box.append(buttons_box)
bottom_box.append(box_info)


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
