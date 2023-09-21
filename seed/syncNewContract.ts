import dotenv from 'dotenv';
import { createConnection } from "../src/lib/Database";
import Transaction from "../src/lib/models/Transaction";
import Project from "../src/lib/models/Project";
import { exit } from 'process';

dotenv.config({ path: ".env" });

const syncNewContract = async () => {
    try {
        const conn = await createConnection()

        console.log('Clear transactions...')
        await Transaction.deleteMany({})

        console.log('Clear onchain status...')
        await Project.updateMany({}, {
            "onchainData.trxHash": "",
            "onchainData.status": "failed"
        })

        await conn.close()
    } catch (error) {
        throw error
    }
}

syncNewContract()
    .then(_ => console.log('Synced.'))
    .catch(e => { console.error(e); exit(1) })