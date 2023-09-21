/* eslint-disable @next/next/no-img-element */
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { authActions } from "@/lib/store/slices/userAuth";
import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect } from "react";
import { TetherIcon, WalletIcon } from "../icons";
import { maskAddress } from "@/lib/utils";
import useComponentVisible from "../UseVisible";
import { web3Actions } from "@/lib/store/slices/web3Provider";
import { useRouter } from "next/router";
import "@/lib/utils/extensions"
import CopyToClipboard from "./CopyToClipboard";
import { modal } from "@/lib/store/slices/modal";
import ConnectWallet from "./ConnectWallet";
import connectors from "@/lib/web3/Connectors";
import Web3 from "web3";
import userAccess from "@/lib/UserAccess";
import { KeyValue } from "@/lib/types/data";
import { AnimatePresence, motion } from "framer-motion";

const dropIn = {
    hidden: {
        y: "-20px",
        opacity: 0,
    },
    visible: {
        y: "0",
        opacity: 1,
        transition: {
            duration: 0.9,
            type: "spring",
            damping: 25,
            stiffness: 500,
        },
    },
    exit: {
        y: "-20px",
        opacity: 0,
    },
}

const AuthButton = () => {
    const { active, account, activate, deactivate, library } = useWeb3React<Web3>()
    const { isLoggedIn } = useAppSelector(state => state.userAuth)
    const { tokenBalance } = useAppSelector(state => state.web3Provider)

    const vis = useComponentVisible(false)
    const dispatch = useAppDispatch()
    const router = useRouter()

    const provider = library?.givenProvider
    const currentProvider = userAccess.providerValue

    const connect = async () => {
        modal.showModal(<ConnectWallet />)
    }

    const disconnect = async () => {
        deactivate()
        dispatch(authActions.logout({}))
        if ([router.pathname, router.asPath].includes('/collections')) {
            router.push('/')
        }
    }

    const toggleMenu = () => {
        vis.toggle()
        dispatch(web3Actions.getTokenBalance({}))
    }

    const onDisconnect = useCallback((error: any) => {
        if (!error) {
            try {
                deactivate()
                dispatch(authActions.logout({}))
                router.push('/')
            } catch (ex) {
                console.log(ex)
            }
        }
    }, [deactivate, dispatch, router])

    useEffect(() => {
        const connector = typeof currentProvider === 'string' ? (connectors as KeyValue<any>)[currentProvider] : null
        if (connector) {
            activate(connector)
        }

        // if (isLoggedIn && !account) {
        //     onDisconnect(null)
        // }

        const changeAccount = (accounts: string[]) => {
            // dispatch(authActions.login([accounts[0], currentProvider]))
            deactivate()
            dispatch(authActions.logout({}))
        }

        provider?.on("accountsChanged", changeAccount)

        return () => {
            provider?.removeListener("accountsChanged", changeAccount)
        }
    }, [account, activate, currentProvider, deactivate, dispatch, isLoggedIn, provider])

    const auth = active && account && isLoggedIn
    if (!auth) {
        return (
            <button
                onClick={connect}
                className="py-2 px-5 text-lg font-semibold text-white rounded-lg w-fit bg-primary transition-all ease-in-out hover:bg-opacity-75 inline-flex items-center space-x-2"
            >
                <div><WalletIcon /></div>
                <div>Connect</div>
            </button>
        )
    }

    return (
        <div ref={vis.ref} className="relative">
            <img
                onClick={toggleMenu}
                className="w-[44px] h-[44px] rounded-full hover:cursor-pointer hover:opacity-75 transition-all ease-in-out z-50"
                src={`https://effigy.im/a/${account}.png`}
                alt={account} />
            <AnimatePresence>
                {vis.isComponentVisible && (
                    <motion.div
                        className="absolute w-[320px] bg-white shadow-menu rounded-lg top-full z-[999999] right-0 mt-6 md:-mr-8 px-4 py-4"
                        variants={dropIn}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        key="user-menu"
                    >
                        <div className="absolute bottom-full right-9 z-10 hidden md:block">
                            <svg width="32" height="13" viewBox="0 0 32 13" fill="none" xmlns="http://www.w3.org/2000/svg" style={{
                                filter: 'drop-shadow(0px -5px 4px rgb(0 0 0 / 0.1))'
                            }}>
                                <path d="M10.3432 2.65685L0 13H32L21.6569 2.65686C18.5327 -0.467339 13.4673 -0.467344 10.3432 2.65685Z" fill="#FFFFFF" />
                            </svg>
                        </div>
                        <p className="text-base text-secondary mb-2 font-medium">Wallet</p>
                        <div className="rounded-xl px-3 py-2.5 border-2 mb-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div>
                                    <TetherIcon size={36} />
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-secondary font-medium">{maskAddress(account)}</p>
                                    <span className="text-gray-700 text-xs">{tokenBalance?.toMoney()} USDT</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <CopyToClipboard data={account}>
                                    <div className="inline-flex items-center space-x-1 text-xs text-secondary hover:text-primary transition-all ease-in-out">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                                        </svg>
                                        <span>Copy Address</span>
                                    </div>
                                </CopyToClipboard>
                                <a href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}address/${account}`} target="_blank" rel="noreferrer" className="inline-flex -mt-1 items-center space-x-1 text-xs text-secondary hover:text-primary transition-all ease-in-out">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                    </svg>

                                    <span>Explore</span>
                                </a>
                            </div>
                        </div>
                        <button onClick={disconnect} className="transition-all ease-in-out border border-orange-600 text-orange-600 hover:text-white hover:bg-orange-600 py-2 rounded-lg w-full flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                            </svg>
                            <span>Logout</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )

}

export default AuthButton;