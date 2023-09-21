import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { mintActions } from "@/lib/store/slices/mint";
import { modal } from "@/lib/store/slices/modal";
import IProject from "@/lib/types/Project";
import { maskAddress } from "@/lib/utils";
import { useWeb3React } from "@web3-react/core";
import { FC, useEffect, useMemo, useState } from "react";
import { StepMinusIcon, StepPlusIcon, TetherIcon } from "../icons";
import CloseBorderedIcon from "../icons/CloseBorderedIcon";
import Button from "../widgets/Button";
import { LoadingIcon } from "../widgets/LoadingIcon";
import OutlinedButton from "../widgets/OutlinedButton";
import Lottie from 'react-lottie';
import * as Success from '@/components/assets/json/SuccessAnimation.json';
import * as Failed from '@/components/assets/json/FailedAnimation.json';
import { useRouter } from "next/router";
import '@/lib/utils/extensions'
import { trpc, withTRPC } from "@/lib/utils/trpc";
import { MintStateValue } from "@/lib/types/Payload";
import { notify } from "@/lib/store/slices/message";

interface Props {
    item: IProject
    supply: number
    limit: number
    cb?: () => void
}

const FormMint: FC<Props> = ({ cb, item, supply, limit }) => {
    const { account } = useWeb3React()
    const { tokenBalance } = useAppSelector(state => state.web3Provider)
    const { tokenAllowance, isLoading, state, trxHash } = useAppSelector(state => state.mint)

    const [amount, setAmount] = useState(1)

    const dispatch = useAppDispatch()
    const router = useRouter()

    const getAdminSignature = trpc.whitelist.getAdminSignature.useMutation()

    const needApproval = useMemo(
        () => tokenAllowance < (amount * item.onchainData.price),
        [amount, item.onchainData.price, tokenAllowance]
    )

    const updateAmount = (e: any) => {
        try {
            setAmount(parseInt(e.target.value))
        } catch (error) {
            setAmount(1)
        }
    }

    const increase = () => {
        if (amount === (limit - supply)) return;

        const newAmount = amount + 1
        setAmount(newAmount)
    }

    const decrease = () => {
        if (amount === 1) return;

        const newAmount = amount - 1
        setAmount(newAmount)
    }

    const close = () => {
        modal.hideModal()
        dispatch(mintActions.clearState({}))
        if (state === MintStateValue.Success) {
            cb?.()
            router.push(router.asPath)
        }
    }

    const approveToken = () => {
        if (account) {
            const value = amount * item.onchainData.price
            dispatch(mintActions.approveToken({ account, value }))
        }
    }

    const mintProject = async () => {
        let payload = {
            project: item.id,
            from: account!,
            amount,
            projectId: item.onchainData.projectId,
            mintPrice: item.onchainData.price,
        }

        if (item.whitelisted) {
            await getAdminSignature.mutateAsync({
                project: item.id,
                from: account!,
                to: account!,
                amount,
            }).then(({ sig, nonce }) => {
                dispatch(mintActions.mintProject({
                    ...payload,
                    to: account!,
                    signature: sig,
                    nonce,
                })).unwrap().then(() => cb?.())
            }).catch(e => {
                notify.error(e.message)
            })
        } else {
            dispatch(mintActions.mintProject(payload))
                .unwrap()
                .then(() => cb?.())
        }
    }

    useEffect(() => {
        if (account && amount) {
            dispatch(mintActions.checkAllowance(account))
        }
    }, [account, amount, dispatch])

    return (
        <div className="px-4 md:px-10 py-6 md:py-8 bg-white rounded-lg w-[90%] md:w-[434px] mx-auto relative">
            {state === MintStateValue.Iddle ? (
                <div>
                    <div className="absolute top-3 right-3">
                        <button onClick={close} className="text-gray-800 hover:text-primary">
                            <CloseBorderedIcon width={24} height={24} />
                        </button>
                    </div>
                    <div className="mb-6">
                        <p className="text-xl font-semibold text-gray-700 mb-3">Invesment Minting</p>
                        <p className="w-full text-base leading-normal text-gray-400">You are about to invest a <span className="text-secondary">{item.name}</span></p>
                    </div>

                    {account && (
                        <div className="rounded-xl px-4 py-4 border-2 mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div>
                                    <TetherIcon size={46} />
                                </div>
                                <div className="flex flex-col">
                                    <a href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}address/${account}`} target="_blank" rel="noreferrer" className="text-secondary text-base font-medium hover:text-primary">{maskAddress(account)}</a>
                                    <span className="text-gray-700 text-xs">{tokenBalance?.toMoney()} USDT</span>
                                </div>
                            </div>
                            <div className="inline-flex items-start justify-start px-1.5 py-0.5 bg-green-50 rounded">
                                <p className="flex-1 h-full text-xs text-green-600">Connected</p>
                            </div>
                        </div>
                    )}

                    <div className="text-center mb-6">
                        <p className="text-sm leading-tight text-gray-400 mb-6">Invest Quantity</p>
                        <div className="flex items-center justify-center gap-6">
                            <button onClick={decrease} className="w-6 h-6 rounded-md bg-[#F6F6F6] hover:bg-primary text-[#8B8BA3] hover:text-white"><StepMinusIcon /></button>
                            <input type="number" min={1} max={item.onchainData.supplyLimit} value={amount} className="text-3xl focus:ring-primary border-none py-1 w-[80px] font-medium leading-10 text-center text-pink-500" onChange={updateAmount} />
                            <button onClick={increase} className="w-6 h-6 rounded-md bg-[#F6F6F6] hover:bg-primary text-[#8B8BA3] hover:text-white"><StepPlusIcon /></button>
                        </div>
                    </div>

                    <div className="flex justify-between mb-2 items-center w-full h-12 px-4 py-4 bg-gray-100 rounded-lg">
                        <p className="text-sm leading-tight text-gray-400">Invest Price</p>
                        <p className="text-sm font-medium leading-tight text-right text-gray-700">{item.onchainData.price} USDT</p>
                    </div>
                    <div className="flex justify-between mb-6 items-center w-full h-12 px-4 py-4 bg-gray-100 rounded-lg">
                        <p className="text-sm leading-tight text-gray-400">Total Invest</p>
                        <p className="text-sm font-medium leading-tight text-right text-gray-700">{amount * item.onchainData.price} USDT</p>
                    </div>
                    {needApproval && (
                        <Button isLoading={isLoading} onClick={approveToken} title="Approve Token" className="w-full justify-center py-4 mb-2 bg-secondary" />
                    )}
                    <Button
                        onClick={mintProject}
                        isLoading={isLoading || getAdminSignature.isLoading}
                        disabled={isLoading || needApproval}
                        title="Proceed to Payment"
                        className="w-full justify-center py-4"
                    />
                </div>
            ) : (
                <div className="text-center">
                    <div className="text-primary mb-6 flex justify-center items-center">
                        <LoadingIcon w={100} h={100} fill="#FF3392" stroke="#d1d1d1" show={state === MintStateValue.Loading} />
                        {[MintStateValue.Success, MintStateValue.Failed].includes(state) && (
                            <div className="h-[130px]">
                                <Lottie
                                    style={{ scale: state === MintStateValue.Success ? "100%" : "85%" }}
                                    isClickToPauseDisabled
                                    ariaRole="div"
                                    options={{
                                        loop: false,
                                        autoplay: true,
                                        animationData: state === MintStateValue.Success ? Success : Failed,
                                        rendererSettings: {
                                            preserveAspectRatio: 'xMidYMid slice'
                                        }
                                    }} />
                            </div>
                        )}
                    </div>
                    <p className="text-xl font-semibold text-center text-gray-700 mb-2">
                        {state === MintStateValue.Loading && 'Minting..'}
                        {state === MintStateValue.Success && 'Minting Success'}
                        {state === MintStateValue.Failed && 'Minting Failed'}
                    </p>
                    <p className="text-base leading-normal text-center text-gray-400 mb-4">
                        {state === MintStateValue.Loading && 'Generating for your NFT..'}
                        {state === MintStateValue.Success && 'Your NFT successfully generated'}
                        {state === MintStateValue.Failed && 'Failed generating your NFT'}
                    </p>
                    {trxHash && (
                        <p className="text-gray-400 text-base">
                            Transaction Hash:&nbsp;
                            <a className="text-secondary" href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}/tx/${trxHash}`} target="_blank" rel="noreferrer">{maskAddress(trxHash)}</a>
                        </p>
                    )}
                    {state !== MintStateValue.Loading && (
                        <OutlinedButton onClick={close} title="Close" className="mx-auto mt-4" />
                    )}
                </div>
            )}
        </div>
    );
}

export default withTRPC<Props>(FormMint);