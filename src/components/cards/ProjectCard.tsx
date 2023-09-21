/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { ProjectTerms } from "@/lib/consts";
import IProject from "@/lib/types/Project";
import { fundsPeriode, toTitleCase } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";
import { HelpIcon, PinIcon, TetherIcon } from "../icons";
import '@/lib/utils/extensions'
import HTooltip from "../widgets/HTooltip";
import WhitelistIcon from "../icons/WhitelistIcon";

const ProjectCard: FC<{ item: IProject }> = ({ item }) => {
    const router = useRouter()

    const progress = parseFloat(`${item.meta.minted / item.onchainData.supplyLimit * 100}`).toFixed(2)

    return (
        <div className="w-full h-full bg-white border rounded-lg border-gray-900 border-opacity-20 p-2">
            <div className="h-full flex flex-col justify-between">
                <div>
                    <div className="relative mb-4">
                        <img className="w-full object-cover h-62 md:h-72 rounded-md" src={item.image_urls[0]} />
                        <div className="px-5 py-2 bg-primary w-fit bg-opacity-80 rounded-full absolute top-4 left-4">
                            {item.whitelisted ? (
                                <div className="text-base text-white uppercase inline-flex items-center">
                                    <WhitelistIcon />
                                    <span className="ml-2">Whitelisted</span>
                                </div>
                            ) : (
                                <p className="text-base text-white uppercase">
                                    {fundsPeriode(item.timeline.funding_start, item.timeline.funding_end)}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="mb-8 px-2">
                        <div className="inline-flex space-x-1.5 items-center justify-start mb-2">
                            <div><PinIcon /></div>
                            <p className="opacity-60 text-sm text-gray-800">{toTitleCase(item.meta.location)}</p>
                        </div>
                        <div>
                            <Link href={`/project/${item.id}`}>
                                <a className="text-lg font-semibold hover:text-secondary text-gray-700">{item.name}</a>
                            </Link>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="mb-5 px-2">
                        <div className="flex justify-between mb-2">
                            <div className="inline-flex items-center space-x-2">
                                <p className="text-sm font-bold text-green-500">{item.meta.gain.toMoney()} USDT</p>
                                <p className="opacity-60 text-sm text-gray-800">Collected</p>
                            </div>
                            <p className="opacity-60 text-sm text-right text-gray-800">{progress}%</p>
                        </div>
                        <div className="w-full bg-[#ECECED] rounded-full h-2.5">
                            <div className="bg-[#20BF55] h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="border rounded-md border-gray-200 px-4 py-2 h-[60px]">
                            <div className="inline-flex space-x-1 items-center justify-start w-14 h-3.5">
                                <p className="opacity-60 text-sm text-gray-800">Reward</p>
                                <div>
                                    <HTooltip
                                        id={`p-${item.id}`}
                                        position="right"
                                        content="Total rewards given during annual period"
                                    >
                                        <HelpIcon />
                                    </HTooltip>
                                </div>
                            </div>
                            <p className="text-sm font-semibold text-gray-900">{item.onchainData.apy}%</p>
                        </div>
                        <div className="border rounded-md border-gray-200 px-4 py-2 h-[60px]">
                            <p className="opacity-60 text-sm text-gray-800">Project Duration</p>
                            <p className="text-sm font-semibold text-gray-900">{ProjectTerms[item.onchainData.term]}</p>
                        </div>
                        <div className="rounded-md bg-[#F6F6F6] space-x-2 inline-flex items-center justify-center px-4 py-2 h-[60px]">
                            <div><TetherIcon /></div>
                            <p className="text-sm font-semibold text-gray-800">{item.onchainData.price} USDT</p>
                        </div>
                        <button onClick={() => router.push(`/project/${item.id}`)} className="rounded-md bg-primary transition-all ease-in-out hover:bg-opacity-75 text-white font-bold px-4 uppercase py-2 h-[60px]">
                            Invest
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectCard;