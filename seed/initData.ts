import Indonesia from "../src/lib/models/Indonesia";
import { createConnection } from "../src/lib/Database";
import data from './data/indonesia.json'

interface Province {
    id: string
    name: string
    regencies: [{
        id: string
        name: string
        districts: [{
            id: string
            name: string
            villages: [{
                id: string
                name: string
            }]
        }]
    }]
}

const initData = async () => {
    try {
        console.log('init data...')
        const conn = await createConnection()
        const provinces = (<Province[]>data)

        Promise
            .allSettled(provinces.map(province => Indonesia.findOneAndUpdate(
                { id: province.id },
                { $set: province },
                { upsert: true, new: true },
            )))
            .then(results => console.log(results.length, 'datas inserted!'))
            .catch(console.error)
            .finally(async () => await conn.close())
    } catch (error) {
        console.error(error);
    }
}

export default initData