import { modal } from "@/lib/store/slices/modal";
import CloseBorderedIcon from "../icons/CloseBorderedIcon";
import '@/lib/utils/extensions'
import { MetaMaskIcon, WalletConnectIcon } from "../icons";
import CoinbaseIcon from "../icons/CoinbaseIcon";
import React, { useEffect, useState } from "react";
import connectors from "@/lib/web3/Connectors";
import { useWeb3React } from "@web3-react/core";
import { errorHandler } from "@/lib/ErrorHandler";
import { notify } from "@/lib/store/slices/message";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { authActions } from "@/lib/store/slices/userAuth";
import { useRouter } from "next/router";
import { LoadingIcon } from "./LoadingIcon";
import { AnimatePresence, motion } from "framer-motion";


const Wallets = [
    {
        name: 'MetaMask',
        label: 'Popular',
        icon: MetaMaskIcon,
        connector: connectors.injected,
        provider: 'injected',
    },
    {
        name: 'Coinbase Wallet',
        label: undefined,
        icon: CoinbaseIcon,
        connector: connectors.coinbaseWallet,
        provider: 'coinbaseWallet',
    },
    {
        name: 'Wallet Connect',
        label: undefined,
        icon: WalletConnectIcon,
        connector: connectors.walletConnect,
        provider: 'walletConnect',
    }
]

const ConnectWallet = () => {
    const { activate, account, deactivate } = useWeb3React()
    const { isLoggedIn } = useAppSelector(state => state.userAuth)
    const dispatch = useAppDispatch()
    const router = useRouter()

    const [provider, setProvider] = useState<string | null>(null)
    const [connecting, setConnecting] = useState(false)

    const connectToWallet = async (wallet: any) => {
        setConnecting(true)
        try {
            setProvider(wallet.provider)
            await activate(wallet.connector, undefined, true)
        } catch (error: any) {
            const msg = errorHandler(error)
            const ignores = [
                'The user rejected the request.',
                'invalid authorization token',
                'User denied account authorization',
                'MetaMask Message Signature: User denied message signature.'
            ].map(s => s.toLowerCase())

            if (msg.includes('No Ethereum')) {
                notify.error("Web Browser not supported! Please install MetaMask extension or use MetaMask mobile browser.")
            } else if (ignores.includes(msg.toLowerCase())) {
                setProvider(null)
                setConnecting(false)
                return
            } else {
                notify.error(msg)
            }

            setProvider(null)
            setConnecting(false)
        }
    }

    const close = () => {
        modal.hideModal()
    }

    useEffect(() => {
        if (account && !isLoggedIn) {
            dispatch(authActions.login([account, provider]))
                .unwrap()
                .then(() => {
                    close()
                    router.push(router.asPath, { query: { auth: true } })
                })
                .catch(() => {
                    deactivate()
                    dispatch(authActions.logout({}))
                })
                .finally(() => setConnecting(false))
        }
    }, [account, deactivate, dispatch, isLoggedIn, provider, router])

    return (
        <div className="px-4 md:px-10 py-6 md:py-8 bg-white rounded-lg w-[90%] md:w-[434px] mx-auto relative">
            <div className="absolute top-3 right-3">
                <button onClick={close} className="text-gray-800 hover:text-primary">
                    <CloseBorderedIcon width={24} height={24} />
                </button>
            </div>
            <div className="mb-4">
                <h1 className="text-xl font-semibold text-secondary mb-1">Select Wallet</h1>
            </div>
            <div className="flex flex-col gap-5">
                <p>If you don&apos;t have a wallet yet, you can select a provider and create one now.</p>
                <div className="border rounded-lg overflow-hidden mb-4 relative">
                    <AnimatePresence>
                        {connecting && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="flex justify-center text-primary items-center w-full h-full bg-black absolute top-0 left-0 bg-opacity-50"
                            >
                                <LoadingIcon show={connecting} fill="#FF3392" stroke="white" w={36} h={36} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <ul>
                        {Wallets.map((wallet, i) => {
                            return (
                                <li key={i} className="border-b last:border-none">
                                    <button onClick={() => connectToWallet(wallet)} className="w-full transition-all ease-in-out flex justify-between px-5 py-4 text-lg font-semibold text-secondary hover:bg-gray-100">
                                        <div className="inline-flex items-center space-x-4">
                                            <span>{React.createElement(wallet.icon, { width: 24, height: 24 })}</span>
                                            <span>{wallet.name}</span>
                                        </div>
                                        {wallet.label && (
                                            <span className="text-sm rounded-full px-3 py-1 font-normal text-white bg-primary">{wallet.label}</span>
                                        )}
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default ConnectWallet;