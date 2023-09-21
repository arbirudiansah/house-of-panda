import { Web3Storage } from 'web3.storage'

const client = new Web3Storage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDBhYjRkN2I5RDRkQzBGMDAzMkE2ZjE2MkJmMTg3ZjFkMzAzOGYxMGQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzAwOTkyMzQ0MjksIm5hbWUiOiJob3BpbmRvIn0.qY7TkxF3mZTzKxry3uhX-aFcVnXgvojuy0Kw-089Lss" })

export const web3Upload = async (files: File[], name: string) => {

    const onRootCidReady = (cid: string) => {
        console.log('uploading files with cid:', cid)
    }

    // when each chunk is stored, update the percentage complete and display
    const totalSize = files.map(f => f.size).reduce((a, b) => a + b, 0)
    let uploaded = 0

    const onStoredChunk = (size: number) => {
        uploaded += size
        const pct = 100 * (uploaded / totalSize)
        console.log(`Uploading... ${pct.toFixed(2)}% complete`)
    }

    try {
        const rootCid = await client.put(files, {
            maxRetries: 10,
            wrapWithDirectory: files.length > 1,
            name, onRootCidReady, onStoredChunk
        })
        console.log('stored files with cid:', rootCid)

        return `https://${rootCid}.ipfs.w3s.link/`
    } catch (error: any) {
        const message =
            (error.response &&
                error.response.data &&
                error.response.data.message) ||
            error.message ||
            error.toString();
        return Promise.reject(message);
    }
}