import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { modal } from "@/lib/store/slices/modal";
import { ProjectOnchainData } from "@/lib/types/Project";
import { Collection } from "@/lib/types/Transaction";
import { BlackRoof, createProvider } from "@/lib/web3/BlackRoof";
import { useWeb3React } from "@web3-react/core";
import classNames from "classnames";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import CloseBorderedIcon from "../icons/CloseBorderedIcon";
import Button from "../widgets/Button";
import FormInput from "../widgets/FormInput";
import { z } from "zod";
import { maskAddress, transformNumber } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import '@/lib/utils/extensions'
import { stakeActions } from "@/lib/store/slices/stake";
import { notify } from "@/lib/store/slices/message";
import { AnimatePresence, motion } from "framer-motion";
import FadeTransition from "../animations/FadeTransition";
import moment from "moment";
import NFTIcon2 from "../icons/NFTIcon2";

interface TabProps {
    projectName: string
    item: ProjectOnchainData
    account: string
    callback?: () => void
}

const blackRoof = new BlackRoof(createProvider())

const TabStaking: FC<TabProps> = ({ projectName, item, account, callback }) => {
    const { freeBalance, isLoading, trxHash } = useAppSelector(state => state.stake)
    const formSchema = z
        .object({ amount: z.any().transform(transformNumber) })
        .refine(data => data.amount >= 1, {
            message: 'Minimum Stake Amount is 1',
            path: ['amount'],
        })
        .refine(data => data.amount <= freeBalance, {
            message: 'Insufficient Balance',
            path: ['amount'],
        })
    type FormType = z.infer<typeof formSchema>

    const dispatch = useAppDispatch()
    const forms = useForm<FormType>({ resolver: zodResolver(formSchema) })
    const amount = useWatch({ control: forms.control, name: 'amount', defaultValue: 0 })

    const onSubmit = (data: FormType) => {
        const project = { id: item.projectId, name: projectName }
        dispatch(stakeActions.create([account, project, data.amount]))
            .unwrap()
            .then(() => {
                notify.success("Staking success")
                dispatch(stakeActions.getInfo([account, item.projectId]))
                forms.reset()
                callback?.()
            })
    }

    return (
        <FormProvider {...forms}>
            <form onSubmit={forms.handleSubmit(onSubmit)}>
                <div className="flex justify-between items-center">
                    <p className="text-sm font-medium leading-normal text-secondary">Free Balance</p>
                    <p className="text-sm font-medium leading-normal text-secondary">{freeBalance} NFT</p>
                </div>
                <FormInput
                    name="amount"
                    type="text"
                    label=""
                    placeholder="0"
                    className="mb-4"
                    readOnly={isLoading}
                />
                <div className="flex justify-between mb-2 items-center w-full h-12 px-4 py-4 bg-gray-100 rounded-lg">
                    <p className="text-sm leading-tight text-gray-400">Stake Value</p>
                    <p className="text-sm font-medium leading-tight text-right text-gray-700">{Number(amount * item.price).toMoney()} USDT</p>
                </div>
                <div className="flex justify-between items-center w-full h-12 px-4 py-4 bg-gray-100 rounded-lg">
                    <p className="text-sm leading-tight text-gray-400">Stake Reward</p>
                    <p className="text-sm font-medium leading-tight text-right text-gray-700">{item.stakedApy}%</p>
                </div>
                {trxHash && (
                    <div className="flex justify-between items-center w-full h-12 px-4 py-4 bg-gray-100 rounded-lg mt-2">
                        <p className="text-sm leading-tight text-gray-400">Trx Hash</p>
                        <a
                            href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}/tx/${trxHash}`}
                            className="text-sm font-medium leading-tight text-right text-gray-700 hover:text-primary"
                            target="_blank"
                            rel="noreferrer"
                        >
                            {maskAddress(trxHash)}
                        </a>
                    </div>
                )}
                <Button title="Stake" isLoading={isLoading} className="w-full justify-center mt-12" />
            </form>
        </FormProvider>
    )
}

const TabUnstaking: FC<TabProps> = ({ projectName, item, account, callback }) => {
    const { stakeInfo, isLoading, trxHash } = useAppSelector(state => state.stake)
    const formSchema = z
        .object({ amount: z.any().transform(transformNumber) })
        .refine(data => data.amount >= 1, {
            message: 'Minimum Stake Amount is 1',
            path: ['amount'],
        })
        .refine(data => data.amount <= stakeInfo.qty, {
            message: 'Insufficient Balance',
            path: ['amount'],
        })
    type FormType = z.infer<typeof formSchema>

    const dispatch = useAppDispatch()
    const forms = useForm<FormType>({
        resolver: zodResolver(formSchema),
        // defaultValues: { amount: stakeInfo.qty }
    })
    const [isprojectEnd, setIsprojectEnd] = useState(false)

    const onSubmit = (data: FormType) => {
        const project = { id: item.projectId, name: projectName }
        dispatch(stakeActions.unstake([account, project, data.amount]))
            .unwrap()
            .then(() => {
                notify.success("Unstaking success")
                dispatch(stakeActions.getInfo([account, item.projectId]))
                forms.reset()
                callback?.()
            })
    }

    useEffect(() => {
        blackRoof
            .isProjectEnd(item.projectId)
            .then(setIsprojectEnd)
    }, [item.projectId])

    return (
        <FormProvider {...forms}>
            <form onSubmit={forms.handleSubmit(onSubmit)}>
                <div className="flex justify-between items-center">
                    <p className="text-sm font-medium leading-normal text-secondary">Staked NFTs</p>
                    <p className="text-sm font-medium leading-normal text-secondary">{stakeInfo.qty} NFT</p>
                </div>
                <FormInput
                    name="amount"
                    type="text"
                    label=""
                    placeholder="0"
                    className="mb-4"
                    readOnly={isLoading || !isprojectEnd}
                />
                {trxHash && (
                    <div className="flex justify-between items-center w-full h-12 px-4 py-4 bg-gray-100 rounded-lg mt-2">
                        <p className="text-sm leading-tight text-gray-400">Trx Hash</p>
                        <a
                            href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}/tx/${trxHash}`}
                            className="text-sm font-medium leading-tight text-right text-gray-700 hover:text-primary"
                            target="_blank"
                            rel="noreferrer"
                        >
                            {maskAddress(trxHash)}
                        </a>
                    </div>
                )}
                <Button disabled={stakeInfo.qty === 0 || !isprojectEnd} title="Unstake" isLoading={isLoading} className="w-full justify-center mt-12" />
            </form>
        </FormProvider>
    )
}

const FormStake: FC<{ item: Collection, callback?: () => void }> = ({ item, callback }) => {
    const { onchainData } = item.project
    const { account } = useWeb3React()
    const { isLoading, stakeInfo } = useAppSelector(state => state.stake)

    const [activeTab, setActiveTab] = useState(0)
    const dispatch = useAppDispatch()

    const getTimeLeft = useCallback(() => {
        const { timeline, onchainData } = item.project;
        const now = moment();
        const end = moment(timeline.funding_start).add(onchainData.term, 'months');
        const duration = moment.duration(end.diff(now));
        const days = Math.floor(duration.asDays());
        const hours = duration.hours();
        const minutes = duration.minutes();
        const seconds = duration.seconds();

        if (days > 0) {
            const daysText = days === 1 ? 'Day' : 'Days';
            return { canUnstake: false, timeLeft: `${days} ${daysText} Left` };
        } else if (hours > 0) {
            const hoursText = hours === 1 ? 'Hour' : 'Hours';
            return { canUnstake: false, timeLeft: `${hours} ${hoursText} Left` };
        } else if (minutes > 0) {
            const minutesText = minutes === 1 ? 'Minute' : 'Minutes';
            return { canUnstake: false, timeLeft: `${minutes} ${minutesText} Left` };
        } else if (seconds > 0) {
            const secondsText = seconds === 1 ? 'Second' : 'Seconds';
            return { canUnstake: false, timeLeft: `${seconds} ${secondsText} Left` };
        } else {
            return { canUnstake: true, timeLeft: 'Time has ended' };
        }
    }, [item.project])

    const close = () => {
        modal.hideModal()
        dispatch(stakeActions.clear())
    }

    useEffect(() => {
        if (account) {
            dispatch(stakeActions.getInfo([account, onchainData.projectId]))
        }
    }, [account, dispatch, onchainData.projectId])

    const renderUnstakingTab = () => {
        const { canUnstake, timeLeft } = getTimeLeft()

        if (canUnstake) {
            return (
                <TabUnstaking
                    account={account!}
                    projectName={item.project.name}
                    item={onchainData}
                    callback={callback}
                />
            )
        }

        return (
            <div className="flex flex-col items-center gap-4 py-3 mb-4">
                <div className="flex justify-between items-center gap-1">
                    <p className="text-lg font-medium leading-normal text-secondary">Staked NFTs</p>
                    <p className="text-lg font-medium leading-normal text-primary">{stakeInfo.qty}</p>
                </div>
                <NFTIcon2 />
                <p className="text-xl font-semibold text-secondary">{timeLeft}</p>
                <p className="w-52 text-base leading-snug text-center text-gray-400">Your NFT is locked until the project period is over</p>
            </div>
        )
    }

    return (
        <div className="px-4 md:px-10 py-6 md:py-8 bg-white rounded-lg w-[90%] md:w-[434px] mx-auto relative">
            <div className="absolute top-3 right-3">
                <button onClick={close} className="text-gray-800 hover:text-primary">
                    <CloseBorderedIcon width={24} height={24} />
                </button>
            </div>
            <div className="mb-4">
                <h1 className="text-xl font-semibold text-secondary mb-1">Stake Property</h1>
                <h3 className="text-base font-medium leading-normal text-gray-400">{item.project.name}</h3>
            </div>
            <AnimatePresence>
                {activeTab === 0 && (
                    <FadeTransition>
                        <div className="px-3 py-2 bg-pink-500 bg-opacity-20 border rounded-md border-pink-500 mb-6">
                            <p className="flex-1 text-sm leading-normal"><span className="text-primary font-semibold">Attention!</span> Staking your NFT will cause the NFT to be locked for the duration of the project, and the rewards generated at this time will be claimed automatically.</p>
                        </div>
                    </FadeTransition>
                )}
            </AnimatePresence>
            <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-lg mb-6 gap-1">
                <div className="relative z-10 p-0">
                    {activeTab === 0 && (<motion.div
                        layoutId="bg"
                        className="w-full h-full absolute bg-secondary rounded-md -z-[1] top-0 left-0 content-['']"
                    />)}
                    <button
                        disabled={isLoading}
                        onClick={() => setActiveTab(0)}
                        key="stake"
                        className={classNames(
                            "py-3 rounded-md w-full transition-all ease-in-out hover:bg-secondary hover:text-white",
                            {
                                ["text-white"]: activeTab === 0,
                                ["text-gray-600"]: activeTab !== 0,
                            },
                        )}>
                        <p className="text-base font-medium leading-tight text-center">Stake</p>
                    </button>
                </div>
                <div className="relative z-10 p-0">
                    {activeTab === 1 && (<motion.div
                        layoutId="bg"
                        className="w-full h-full absolute bg-secondary rounded-md -z-[1] top-0 left-0 content-['']"
                    />)}
                    <button
                        disabled={isLoading}
                        onClick={() => setActiveTab(1)}
                        key="unstake"
                        className={classNames(
                            "py-3 rounded-md w-full transition-all ease-in-out hover:bg-secondary hover:text-white",
                            {
                                ["text-white"]: activeTab === 1,
                                ["text-gray-600"]: activeTab !== 1,
                            },
                        )}>
                        <p className="text-base font-medium leading-tight text-center">Unstake</p>
                    </button>
                </div>
            </div>
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1, }}
                    exit={{ y: -1, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                >
                    {activeTab === 0 ?
                        <TabStaking
                            projectName={item.project.name}
                            item={onchainData}
                            account={account!}
                            callback={callback}
                        />
                        : renderUnstakingTab()
                    }
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export default FormStake;