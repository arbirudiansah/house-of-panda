/* eslint-disable @next/next/no-img-element */
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { Collection } from "@/lib/types/Transaction";
import { toTitleCase } from "@/lib/utils";
import { useWeb3React } from "@web3-react/core";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { HelpIcon, PinIcon } from "../icons";
import Button from "../widgets/Button";
import '@/lib/utils/extensions'
import { modal } from "@/lib/store/slices/modal";
import FormStake from "../forms/FormStake";
import { Holdinginfo, StakeInfo } from "@/lib/types/Payload";
import classNames from "classnames";
import FormCollectReward from "../forms/FormCollectReward";
import OutlinedButton from "../widgets/OutlinedButton";
import FormBurn from "../forms/FormBurn";
import HTooltip from "../widgets/HTooltip";
import { BlackRoof, createProvider } from "@/lib/web3/BlackRoof";
import { trxActions } from "@/lib/store/slices/transaction";

const blackRoof = new BlackRoof(createProvider())

const CollectionCard: FC<{ item: Collection }> = ({ item }) => {
    const { account } = useWeb3React()
    const dispatch = useAppDispatch()

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
    const [claimedRewards, setClaimedRewards] = useState(0)

    const { hasStaking, onchainData, projectId } = useMemo(() => {
        const onchainData = item.project.onchainData
        return {
            hasStaking: stakeInfo.qty > 0,
            onchainData,
            projectId: onchainData.projectId
        }
    }, [item.project.onchainData, stakeInfo.qty])

    const showStakeModal = (e: any) => {
        e.preventDefault()
        modal.showModal(
            <FormStake
                item={item}
                callback={() => {
                    getAssetAlloc()
                    dispatch(trxActions.getPendingTrxs())
                }}
            />
        )
    }

    const showBurnModal = (e: any) => {
        e.preventDefault()
        modal.showModal(
            <FormBurn
                item={item}
                callback={() => {
                    getAssetAlloc()
                    dispatch(trxActions.getPendingTrxs())
                }}
            />
        )
    }

    const showCollectModal = (e: any) => {
        e.preventDefault()
        modal.showModal(
            <FormCollectReward
                item={item}
                callback={() => {
                    getAssetAlloc()
                    dispatch(trxActions.getPendingTrxs())
                }}
            />
        )
    }

    const getAssetAlloc = useCallback(() => {
        if (!account) return;
        blackRoof
            .getAssetAlloc(account, projectId)
            .then(({ holding, stake, claimedRewards: claimed }) => {
                setHoldingInfo(holding)
                setStakeInfo(stake)
                setClaimedRewards(claimed)
            })
    }, [account, projectId])

    useEffect(() => {
        getAssetAlloc()
    }, [getAssetAlloc])

    return (
        <div className="bg-white border rounded-lg border-gray-900 border-opacity-20 p-3 flex flex-col md:flex-row gap-4 w-full">
            <div className="w-full md:w-1/4 flex flex-col justify-center">
                <div className="relative">
                    <div className="absolute top-2 left-2 ">
                        <HTooltip
                            id={`info-${onchainData.projectId}`}
                            position="right"
                            content={`Holding: ${holdingInfo.qty} - Staked: ${stakeInfo.qty}`}
                        >
                            <div className="text-white text-base font-medium rounded-md flex items-center justify-center bg-gray-700 bg-opacity-50 py-1 px-2">x{holdingInfo.qty + stakeInfo.qty}</div>
                        </HTooltip>
                    </div>
                    <img src={`${process.env.NEXT_PUBLIC_IPFS_HOST}/${item.project.onchainData.projectId}.jpg`} alt={item.project.name} className="w-full md:w-72 h-auto rounded-lg object-contain" />
                </div>
            </div>
            <div className="px-0 md:px-4 flex flex-col justify-between w-full md:w-3/4">
                <div>
                    <div className="mb-2 md:mb-4">
                        <div className="inline-flex space-x-2 items-center justify-start mb-2">
                            <div><PinIcon className="md:w-[22px] md:h-[22px]" /></div>
                            <p className="opacity-60 text-base text-gray-800 lea">{toTitleCase(item.project.location)}</p>
                        </div>
                        <h1 className="text-xl md:text-2xl font-semibold text-gray-700">{item.project.name}</h1>
                    </div>
                    <div className="inline-flex space-x-2 items-center justify-start mb-4 md:mb-6">
                        <a
                            href={`${process.env.NEXT_PUBLIC_NFT_URL}/${process.env.NEXT_PUBLIC_SMARTCONTRACT_ADDRESS}/${item.project.onchainData.projectId}`}
                            className="md:text-base hover:underline hover:cursor-pointer text-pink-500"
                            target="_blank"
                            rel="noreferrer"
                        >
                            View NFT <span>&#8594;</span>
                        </a>
                    </div>
                </div>

                <div className={classNames(
                    "grid grid-cols-2 gap-2 md:gap-4 w-full mb-2 md:mb-4",
                    {
                        ["md:grid-cols-3"]: !hasStaking,
                        ["md:grid-cols-4"]: hasStaking,
                    }
                )}>
                    <div className="rounded-lg border px-3 py-2 md:px-4 md:py-3 flex-grow">
                        <p className="text-gray-400 text-xs mb-1 md:mb-2">Total Investment</p>
                        <p className="text-secondary md:text-base font-semibold">{Number(onchainData.price * item.minted).toMoney()} USDT</p>
                    </div>
                    <div className="rounded-lg border px-3 py-2 md:px-4 md:py-3 flex-grow">
                        <p className="text-gray-400 text-xs mb-1 md:mb-2 inline-flex space-x-2 items-center">
                            <span>Regular Reward</span>
                            <span className="text-primary font-medium">{onchainData.apy}%</span>
                            <span>
                                <HTooltip
                                    id={`taa-${item.project._id}`}
                                    position="top"
                                    content="Total rewards given during annual period"
                                >
                                    <HelpIcon />
                                </HTooltip>
                            </span>
                        </p>
                        <p className="text-primary md:text-base font-semibold">{holdingInfo.accumRewards.toMoney()} USDT</p>
                    </div>
                    {hasStaking && (
                        <div className="rounded-lg border px-3 py-2 md:px-4 md:py-3 flex-grow">
                            <p className="text-gray-400 text-xs mb-1 md:mb-2 inline-flex space-x-2 items-center">
                                <span>Staking Reward</span>
                                <span className="text-primary font-medium">{onchainData.stakedApy}%</span>
                                <span className="hover:cursor-pointer hover:text-primary">
                                    <HTooltip
                                        id={`taa-2-${item.project._id}`}
                                        position="top"
                                        content="Total staking rewards given during annual period"
                                    >
                                        <HelpIcon />
                                    </HTooltip>
                                </span>
                            </p>
                            <p className="text-primary md:text-base font-semibold">{(stakeInfo.accumRewards).toMoney()} USDT</p>
                        </div>
                    )}
                    <div className="rounded-lg border px-3 py-2 md:px-4 md:py-3 flex-grow">
                        <p className="text-gray-400 text-xs mb-1 md:mb-2 inline-flex space-x-2 items-center">
                            <span>Claimed Reward</span>
                            <span className="hover:cursor-pointer hover:text-primary">
                                <HTooltip
                                    id={`taa-3-${item.project._id}`}
                                    position="top"
                                    content="Total reward that has been claimed"
                                >
                                    <HelpIcon />
                                </HTooltip>
                            </span>
                        </p>
                        <p className="text-primary md:text-base font-semibold">{claimedRewards.toMoney()} USDT</p>
                    </div>
                </div>

                <div className="flex flex-wrap lg:flex-nowrap items-center gap-4">
                    <Button onClick={showStakeModal} title="Stake/Unstake" className="w-full justify-center bg-secondary" />
                    <Button onClick={showCollectModal} title="Claim Reward" className="w-full justify-center" disabled={false} />
                    <OutlinedButton onClick={showBurnModal} title="Burn Token" className="justify-center w-full" />
                </div>

            </div>
        </div>
    );
}

export default CollectionCard;