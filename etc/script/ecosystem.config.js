module.exports = {
    apps: [
        {
            name: "hop-prod",
            script: "yarn",
            args: "start",
            cwd: "/home/www/hop",
            instances: 4,
            autorestart: true,
            watch: false,
            max_memory_restart: "2G",
            env: {
                MONGODB_URI: "mongodb://uWeb3Hop321098:puWeb3Hop009213@127.0.0.1:27017/hop_prodb?retryWrites=true&authSource=admin",
                JWT_SECRET: "yLc%3q^t8S@+QzGv$pZJ7&uXe5mV*dH!",
                ADMIN_KEY: "5WUR9DSG0Kwi/xSo/9+154aQQ+QlEw6jaDN6zyX3z8zQbDTi/UEkFtDPgvyTrQr7WCAUSpIrZE+KDZcJz9b7HqSPgYbILciQcyNi6pSePGSB46xzt9R5fkUN3N1Hz9EvHFERS0Uqk8t1Yf9C1xCBHxKDCOiUL/1soAB08bFM5i0=",
                NEXT_PUBLIC_SMARTCONTRACT_ADDRESS: "0xb224d609ec38e01d7caaf731b2465f33b8105229",
                NEXT_PUBLIC_STAKER_ADDRESS: "0x00346845fb86aEC9d627109FF70cF4a27A6525fe",
                NEXT_PUBLIC_IPFS_HOST: "https://ipfs.houseofpanda.co",
                NEXT_PUBLIC_STABLE_COIN_ADDRESS: "0xdac17f958d2ee523a2206206994597c13d831ec7",
                NEXT_PUBLIC_WEB3_PROVIDER: "https://mainnet.infura.io/v3/eaf9acc880f140298d5e26f22a53fa64",
                NEXT_PUBLIC_EXPLORER_URL: "https://etherscan.io/",
                NEXT_PUBLIC_NFT_URL: "https://opensea.io/assets/ethereum",
                NEXT_PUBLIC_WEB_URL: "https://www.houseofpanda.co",
                NEXT_PUBLIC_CHAIN_ID: 1,
                NEXT_PUBLIC_GAS_LIMIT: 500000,
            },
        },
    ],
};
