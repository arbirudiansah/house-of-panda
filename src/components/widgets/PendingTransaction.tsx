import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { trxActions } from "@/lib/store/slices/transaction";
import { maskAddress } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import DoneIcon from "../icons/DoneIcon";
import FailedIcon from "../icons/FailedIcon";
import useComponentVisible from "../UseVisible";
import { LoadingIcon } from "./LoadingIcon";

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

const PendingTransaction = () => {
    const { pendingTrxs } = useAppSelector(({ transaction }) => transaction)
    const dispatch = useAppDispatch()
    const vis = useComponentVisible(false)

    useEffect(() => {
        dispatch(trxActions.getPendingTrxs())
    }, [dispatch])

    if (pendingTrxs.length === 0) return <div />

    return (
        <div className="relative" ref={vis.ref}>
            <button onClick={vis.toggle} className="bg-secondary select-none text-white px-4 py-2.5 rounded-full inline-flex space-x-2 items-center text-sm justify-center transition-all ease-in-out hover:bg-opacity-75 hover:cursor-pointer">
                <LoadingIcon show={pendingTrxs.filter(t => t.status === 'waiting').length > 0} />
                <span>{pendingTrxs.length} Pending</span>
            </button>

            <AnimatePresence>
                {vis.isComponentVisible && (
                    <motion.div
                        className="absolute w-[320px] bg-white shadow-menu rounded-lg top-full -z-10 right-0 mt-6 md:-mr-8 px-4 py-4"
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
                        <p className="text-base text-secondary mb-2 font-medium">Pending Transactions</p>
                        <div className="w-full max-h-[260px] overflow-y-auto overflow-x-hidden">
                            {pendingTrxs.map((trx, i) => (
                                <div className="rounded-xl px-3 py-2.5 border-2 mb-2" key={i}>
                                    <div className="flex items-center gap-3">
                                        <div>
                                            {trx.status === 'waiting' ? (
                                                <LoadingIcon w={32} h={32} fill="#FF3392" stroke="#b1b1b1" show />
                                            ) : trx.status === 'done' ? (
                                                <DoneIcon width={32} height={32} fill="green" />
                                            ) : (
                                                <FailedIcon width={32} height={32} fill="#C81E1E" />
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-secondary font-medium">
                                                <a
                                                    href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}tx/${trx.trxHash}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-secondary transition-all ease-in-out hover:text-primary"
                                                >
                                                    {maskAddress(trx.trxHash)}
                                                </a>
                                            </p>
                                            <span className="text-gray-700 text-xs">[{trx.action}] {trx.title}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default PendingTransaction;