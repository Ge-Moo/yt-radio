const OLD = {
  title: '',
  status: '',
  length: '',
  views: 0,
  owner: '-'
}

export function template(
  title: string, 
  status: string, 
  length: string, 
  views: number, 
  owner: string ): string {
  
  if(title.includes('. ')){
    title = title.split('. ')[1]
  }

  OLD.title = title
  OLD.status = status
  OLD.length = length
  OLD.views = views
  OLD.owner = owner 

return `  title   : ${title.slice(0,30)}
  status  : ${status}   owner : ${owner}
  length  : ${length}   views : ${views}
`
}

export function templateSet(pattern: string ,value: any): string {
  eval(`OLD.${pattern} = '${value}'`)
  return template(OLD.title,OLD.status,OLD.length,OLD.views,OLD.owner)
}
