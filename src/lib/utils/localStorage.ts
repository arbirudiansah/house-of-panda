import { AnyObject } from './index';
class LocalStorage {
    set = (key: string, value: Object) => {
        if (this.checkifSupport()) {
            try {
                window.localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                throw new TypeError('Exceeded Storage Quota!');
            }
        } else {
            throw new TypeError("No support. Use a fallback such as browser cookies or store on the server.");
        }
    }

    get = <T>(key: string): T | null => {
        if (this.checkifSupport()) {
            var data = window.localStorage.getItem(key);
            if (data) {
                return JSON.parse(data) as T;
            }
        }

        return null
    }

    remove = (key: string) => {
        if (this.checkifSupport()) {
            window.localStorage.removeItem(key);
            return true;
        }

        return false
    }

    checkifSupport = () => {
        return typeof window !== 'undefined'
    }
}

class ContainerStorage<T extends Object> {
    private storage: LocalStorage
    private containerName: string
    private identifierKey: string

    constructor(containerName: string, identifierKey: string) {
        const s = new LocalStorage()
        this.containerName = containerName
        this.identifierKey = identifierKey
        this.storage = s

        if (!s.get(containerName)) {
            s.set(containerName, [])
        }
    }

    private writeAll = (entries: T[]) => {
        this.storage.set(this.containerName, JSON.stringify(entries))
    }

    insert = (data: T) => {
        const entries = [...this.getList()]
        entries.push(data)
        this.writeAll(entries)
    }

    getList = (): readonly T[] => {
        const data = this.storage.get(this.containerName)
        if (data) {
            if(typeof data === 'string') return JSON.parse(data)

            return <T[]>data
        }

        return []
    }

    get = <S extends unknown,>(matcher: S): T | undefined => {
        return this.getByKey(this.identifierKey, matcher)
    }

    getByKey = <S extends unknown,>(key: string, matcher: S): T | undefined => {
        return this.getList().find((d: AnyObject) => d[key] === matcher)
    }

    update = <S extends unknown,>(matcher: S, newData: T) => {
        return this.updateByKey(this.identifierKey, matcher, newData)
    }

    updateByKey = <S extends unknown,>(key: string, matcher: S, newData: T) => {
        const entries = this.getList().map((d: AnyObject) => {
            if (d[key] === matcher) {
                return newData
            }

            return d as T
        })
        this.writeAll(entries)
    }

    remove = <S extends unknown,>(matcher: S) => {
        return this.removeByKey(this.identifierKey, matcher)
    }

    removeByKey = <S extends unknown,>(key: string, matcher: S) => {
        const entries = this.getList().filter((d: AnyObject) => d[key] !== matcher)
        this.writeAll(entries)
    }

    clear = () => {
        this.storage.remove(this.containerName)
    }
}

export default LocalStorage
export { ContainerStorage }