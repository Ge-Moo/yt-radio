import {createInterface} from 'readline'

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
})

export function input(quest: string): Promise<string> {
  return new Promise((resolve,reject) => {
    rl.question(quest,(answer) => {
      resolve(answer)
    })
  })
}
