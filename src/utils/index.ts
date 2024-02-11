import {format,subDays} from "date-fns"

export const getDate = (sub:number = 0)=>{
    const datexDaysAgo = subDays(new Date(),sub)
    return  format(datexDaysAgo,"dd/MM/yyyy")
}