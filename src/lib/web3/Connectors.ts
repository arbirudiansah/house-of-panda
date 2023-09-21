import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

let supportedChainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID as string)
supportedChainId = isNaN(supportedChainId) ? 1 : supportedChainId
const supportedChainIds = [supportedChainId]

const coinbaseWallet = new WalletLinkConnector({
    url: `${process.env.NEXT_PUBLIC_WEB3_PROVIDER}`,
    appName: "House of Panda",
    supportedChainIds,
})

const walletConnect = new WalletConnectConnector({
    infuraId: 'd1fccd12300f4b7981d0b8ca66000df8',
    bridge: "https://bridge.walletconnect.org",
    qrcode: true,
})

const injected = new InjectedConnector({ supportedChainIds })

const connectors = { coinbaseWallet, walletConnect, injected }

export default connectors