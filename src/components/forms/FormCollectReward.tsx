import { modal } from "@/lib/store/slices/modal";
import { Collection } from "@/lib/types/Transaction";
import { FC, useCallback, useState, useMemo, useEffect } from "react";
import CloseBorderedIcon from "../icons/CloseBorderedIcon";
import { maskAddress } from "@/lib/utils";
import '@/lib/utils/extensions'
import { FormProvider, useForm } from "react-hook-form";
import Button from "../widgets/Button";
import FormInput from "../widgets/FormInput";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { stakeActions } from "@/lib/store/slices/stake";
import { notify } from "@/lib/store/slices/message";
import { useWeb3React } from "@web3-react/core";
import { Holdinginfo, StakeInfo } from "@/lib/types/Payload";
import { RewardType } from "@/lib/consts";
import { BlackRoof, createProvider } from "@/lib/web3/BlackRoof";

const blackRoof = new BlackRoof(createProvider())

interface Props {
    item: Collection
    callback?: () => void
}

const FormCollectReward: FC<Props> = ({ item, callback }) => {
    const { isLoading, trxHash } = useAppSelector(state => state.stake)
    const { account } = useWeb3React()
    const dispatch = useAppDispatch()
    const forms = useForm()

    const [rt, setRt] = useState<RewardType | null>(null)
    const [stakeInfo, setStakeInfo] = useState<StakeInfo>({
        qty: 0,
        term: 0,
        startTime: 0,
        accumRewards: 0,
        claimedRewards: 0
    })
    const [holdingInfo, setHoldingInfo] = useState<Holdinginfo>({
        qty: 0,
        startTime: 0,
        accumRewards: 0,
        claimedRewards: 0
    })

    const { hasStaking, projectId } = useMemo(() => {
        const onchainData = item.project.onchainData
        return {
            hasStaking: stakeInfo.qty > 0,
            projectId: onchainData.projectId
        }
    }, [item.project.onchainData, stakeInfo.qty])

    const close = () => {
        modal.hideModal()
    }

    const onSubmit = (_: any) => {
        const { name } = item.project
        dispatch(stakeActions.collectRewards([account!, { id: projectId, name }, RewardType.Holding | RewardType.Staking]))
            .unwrap()
            .then(() => {
                notify.success("Rewards collected")
                getAssetAlloc()
                callback?.()
            })
    }

    const claimReward = (rewardType: RewardType) => {
        const { name } = item.project

        setRt(rewardType)
        dispatch(stakeActions.collectRewards([account!, { id: projectId, name }, rewardType]))
            .unwrap()
            .then(() => {
                notify.success("Rewards collected")
                getAssetAlloc()
                callback?.()
            })
            .finally(() => setRt(null))
    }

    const getAssetAlloc = useCallback(() => {
        if (!account) return;
        blackRoof
            .getAssetAlloc(account, projectId)
            .then(({ holding, stake }) => {
                setHoldingInfo(holding)
                setStakeInfo(stake)
            })
    }, [account, projectId])

    useEffect(() => {
        getAssetAlloc()
    }, [getAssetAlloc])

    return (
        <div className="px-4 md:px-10 py-6 md:py-8 bg-white rounded-lg w-[90%] md:w-[434px] mx-auto relative">
            <div className="absolute top-3 right-3">
                <button onClick={close} className="text-gray-800 hover:text-primary">
                    <CloseBorderedIcon width={24} height={24} />
                </button>
            </div>
            <div className="mb-8">
                <h1 className="text-xl font-semibold text-secondary mb-1">Claim Reward</h1>
                <h3 className="text-base font-medium leading-normal text-gray-400">{item.project.name}</h3>
            </div>
            <FormProvider {...forms}>
                <form onSubmit={forms.handleSubmit(onSubmit)}>
                    <div className="inline-flex items-end space-x-2 mb-4 justify-between w-full">
                        <FormInput
                            name="holding"
                            type="text"
                            label="Regular Reward"
                            placeholder="0"
                            readOnly={true}
                            currentValue={holdingInfo.accumRewards.toMoney()}
                            suffix={<p>USDT</p>}
                            className="w-full"
                        />
                        <Button
                            title="Claim"
                            onClick={(e) => {
                                e.preventDefault()
                                claimReward(RewardType.Holding)
                            }}
                            isLoading={isLoading && rt === RewardType.Holding}
                            disabled={isLoading || holdingInfo.accumRewards === 0}
                            className="mb-2 py-2.5"
                        />
                    </div>
                    {hasStaking && (
                        <div className="inline-flex items-end justify-between mb-4 w-full space-x-2">
                            <FormInput
                                name="stake"
                                type="text"
                                label="Staking Reward"
                                placeholder="0"
                                readOnly={true}
                                currentValue={stakeInfo.accumRewards.toMoney()}
                                suffix={<p>USDT</p>}
                                className="w-full"
                            />
                            <Button
                                title="Claim"
                                onClick={(e) => {
                                    e.preventDefault()
                                    claimReward(RewardType.Staking)
                                }}
                                isLoading={isLoading && rt === RewardType.Staking}
                                disabled={isLoading || stakeInfo.accumRewards === 0}
                                className="mb-2 py-2.5"
                            />
                        </div>
                    )}
                    {trxHash && (
                        <div className="flex justify-between items-center w-full h-12 px-4 py-4 bg-gray-100 rounded-lg mt-2 mb-4">
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
                    <Button title="Claim All Rewards" disabled={!hasStaking || (holdingInfo.accumRewards === 0 && stakeInfo.claimedRewards === 0)} isLoading={hasStaking && isLoading} className="w-full justify-center mb-4" />
                    <div className="px-3 py-2 bg-pink-500 bg-opacity-20 border rounded-md border-pink-500">
                        <p className="flex-1 text-sm leading-normal"><span className="text-primary font-semibold">Claiming All Rewards</span> can be an option for those who have regular rewards and staked rewards to save on gas fees.</p>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}

export default FormCollectReward;