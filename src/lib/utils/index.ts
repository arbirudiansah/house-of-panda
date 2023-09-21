import moment from "moment"
import { z } from "zod"

export const extractLatLng = (url: string) => {
    const latLng = /\/\@(.*),(.*),/.exec(url);
    if (!latLng || latLng.length < 3) return { lat: 0, lng: 0 }

    return { lat: parseFloat(latLng[2]), lng: parseFloat(latLng[1]) }
}

export const transformNumber = (val: string | number, ctx: z.RefinementCtx) => {
    if (typeof val === 'number') return val
    if (val.includes(',')) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "This field value number is not valid",
        });

        return z.NEVER;
    }

    const parsed = parseInt(val);
    if (isNaN(parsed) || parsed === 0) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "This field value number is not valid",
        });

        return z.NEVER;
    }
    return parsed;
}

export const toQueryString = (params: Object) => {
    let searchParams = new URLSearchParams()
    Object.entries(params).map(([key, value]) => {
        searchParams.append(key, value)
    })
    return searchParams.toString()
}

export const toTitleCase = (input: string) => {
    var sentence = input.toLowerCase().split(" ")
    for (var i = 0; i < sentence.length; i++) {
        sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1)
    }

    return sentence.join(" ")
}

export function toIDR(input: string): string {
    return parseFloat(input).toLocaleString('id-ID', {
        // style: 'currency',
        // currency: 'RP'
    })
}

export const getTetherPrice = async (amount?: number, formated = true): Promise<string | number> => {
    return new Promise((resolve, reject) => {
        fetch('https://indodax.com/api/tickers')
            .then(res => res.json())
            .then(data => {
                const last = parseInt(data.tickers.usdt_idr.last)
                if (formated) {
                    const result = toIDR(((amount ?? 1) * last).toString())
                    return resolve(result)
                }

                return resolve(last)
            })
            .catch(err => reject(err))
    })
}

// @returns [Eth, Tether]
export const getEthTetherPrice = async (): Promise<[number, number]> => {
    return new Promise((resolve, reject) => {
        fetch('https://indodax.com/api/tickers')
            .then(res => res.json())
            .then(data => {
                const eth = parseInt(data.tickers.eth_idr.last)
                const usdt = parseInt(data.tickers.usdt_idr.last)

                return resolve([eth, usdt])
            })
            .catch(err => reject(err))
    })
}

export const maskAddress = (addr: string) => {
    // check if address is valid
    if (!addr || addr.length < 42) return addr

    return addr.substring(0, 6) + "..." + addr.substring(addr.length - 4, addr.length);
}

export const calculateRewards = (amount: number, startTime: Date, apy: number): number => {
    const now = (new Date()).getTime()
    const aDays = (now - startTime.getTime()) / 24
    const aAmount = amount * apy
    let reward = (aAmount * aDays) / 100 / 365
    reward = Number(reward / Math.pow(10, 6))

    return reward
}

export const fundsPeriode = (start: string, end: string) => {
    const startDate = moment(start)
    const endDate = moment(end)
    const now = moment()
    const diffH = endDate.diff(now, 'hours')

    if (now.isBefore(startDate)) {
        return "Not Started"
    }

    if (now.isAfter(endDate)) {
        return "Done"
    }

    if (diffH < 24 && diffH > 0) {
        return diffH + ' Hour(s) Remaining'
    }

    if (now.isSameOrAfter(startDate) && now.isBefore(endDate)) {
        return endDate.diff(now, 'days') + " Day(s) Remaining";
    }

    return ""
}

export const isFundingActive = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const now = moment()

    return now.isSameOrAfter(startDate) && now.isSameOrBefore(endDate)
}

export type AnyObject = { [key: string]: any }

export const pickBy = (obj: AnyObject, fn: Function) => {
    return Object.keys(obj)
        .filter((k) => fn(obj[k], k))
        .reduce((acc, key) => ((acc[key] = obj[key]), acc), {} as AnyObject)
}