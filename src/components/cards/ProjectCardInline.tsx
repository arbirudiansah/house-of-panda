/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { ProjectTypes } from "@/lib/consts";
import IProject from "@/lib/types/Project";
import { fundsPeriode, toTitleCase } from "@/lib/utils";
import { FC } from "react";
import { DotsIcon, PinIcon } from "../icons";

const ProjectCardInline: FC<{ item: IProject }> = ({ item }) => {
    return (
        <div className="w-full bg-white border rounded-lg border-gray-900 border-opacity-20 grid grid-cols-12 mb-4 overflow-hidden">
            <div className="relative col-span-4">
                <img className="w-full object-cover h-[260px]" src={item.image_urls[0]} />
                <div className="px-5 py-2 bg-primary w-fit bg-opacity-80 rounded-full absolute top-4 left-4">
                    <p className="text-base text-white uppercase">{fundsPeriode(item.timeline.funding_start, item.timeline.funding_end)}</p>
                </div>
            </div>
            <div className="p-6 w-full h-full flex flex-col justify-between col-span-8 relative">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-base text-primary uppercase">{ProjectTypes[item.onchainData.typeId]}</p>
                        <button className="text-primary transition-all ease-in-out hover:text-secondary"><DotsIcon /></button>
                    </div>
                    <div className="mb-8">
                        <h1 className="text-2xl mb-4 font-semibold text-gray-700">{item.name}</h1>
                        <div className="inline-flex space-x-1.5 items-center justify-start">
                            <div><PinIcon width={22} height={22} /></div>
                            <p className="opacity-60 text-base text-gray-800">{toTitleCase(item.meta.location)}</p>
                        </div>
                    </div>
                </div>
                <div className="">
                    <div className="flex justify-between mb-2">
                        <div className="inline-flex items-center space-x-2">
                            <p className="text-sm font-bold text-green-500">{item.meta.gain} USDT</p>
                            <p className="opacity-60 text-sm text-gray-800">Terkumpul</p>
                        </div>
                        <p className="opacity-60 text-sm text-right text-gray-800">{parseFloat(`${item.meta.progress}`).toFixed(2)}%</p>
                    </div>
                    <div className="w-full bg-[#ECECED] rounded-full h-2.5">
                        <div className="bg-[#20BF55] h-2.5 rounded-full" style={{ width: `${item.meta.progress}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectCardInline;