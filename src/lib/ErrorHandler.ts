import { AnyObject } from './utils/index';
export const extractObject = (input: string) => {
    try {
        const start = input.indexOf('{')
        const end = input.lastIndexOf('}')
        const match = input.match(/(?<='\s*).*?(?='\s*)/g)

        if (match && match.length > 0) {
            const obj: AnyObject = JSON.parse(match[0]).value as Object
            if (obj.hasOwnProperty('data')) {
                return obj.data.message
            } else if (obj.hasOwnProperty('message')) {
                return obj.message
            }
        } else if (start != -1 && end != -1) {
            return input.substring(0, start).replace(":", "").trim()
        }
    } catch (error: any) {
        return error.toString()
    }

    return input;
}

export const errorHandler = (error: any): string => {
    let message =
        (error.response &&
            error.response.data &&
            error.response.data.message) ||
        error.message ||
        error.toString();
    message = extractObject(message)

    return message
}