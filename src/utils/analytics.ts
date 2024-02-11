import {redis} from "@/lib/redis"
import {getDate} from "@/utils"
type AnalyticsArgs={
    retention?:number
}

type TrackOptions={
    persist?:boolean
}

export class Analytics {
  private retention: number = 60 * 60 * 24 * 7;

  constructor(opts?:AnalyticsArgs){
    if(opts?.retention) this.retention = opts.retention
  }

  async track(eventname:string,event:object={},opts?:TrackOptions){
    let key=`analytics::${eventname}`
    if(!opts?.persist){
        key += `::${getDate()}`
    }
    //database call to this event

    await redis.hincrby(key,JSON.stringify(event),1)
    if(!opts?.persist) await redis.expire(key,this.retention)
  }
 
  async retrieveDays(namespace:string,nDays:number){
    type AnalyticsPromise = ReturnType<typeof analytics.retrieve>
    const promises:AnalyticsPromise[]=[]
    for (let i = 0; i < nDays; i++) {
      const formattedDate=getDate(i)
      const promise = analytics.retrieve(namespace,formattedDate)
      promises.push(promise)
      
    }
  }

  async retrieve(namespace: string,date:string){
    const res = await redis.hgetall<Record<string,string>>(`analytics::${namespace}::${date}`)
    
    return {
      date,
      events:Object.entries(res??[]).map(([key,value])=>({
        [key]:Number(value)
      }))
    }
  }
}

export const analytics = new Analytics({retention:3600})

