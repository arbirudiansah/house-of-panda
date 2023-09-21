/* eslint-disable @next/next/no-img-element */
import Footer from "@/components/Footer"
import FormMint from "@/components/forms/FormMint"
import { CalendarCheckIcon, CalendarWaitIcon, DirectInboxIcon, HelpIcon, PinIcon, SackIcon, TetherIcon, TrophyIcon } from "@/components/icons"
import MainNavbar from "@/components/layout/MainNavbar"
import Button from "@/components/widgets/Button"
import CollapsibleContainer from "@/components/widgets/CollapsibleContainer"
import HTooltip from "@/components/widgets/HTooltip"
import ImageSlider from "@/components/widgets/ImageSlider"
import * as db from "@/lib/Database"
import { errorHandler } from "@/lib/ErrorHandler"
import { ProjectTerms, ProjectTypes } from "@/lib/consts"
import * as projectRepo from "@/lib/repository/ProjectRepository"
import { notify } from "@/lib/store/slices/message"
import { modal } from "@/lib/store/slices/modal"
import IProject from "@/lib/types/Project"
import { fundsPeriode, getTetherPrice, isFundingActive, toIDR, toTitleCase } from "@/lib/utils"
import { BlackRoof, createProvider } from "@/lib/web3/BlackRoof"
import '@/lib/utils/extensions'
import { useWeb3React } from "@web3-react/core"
import moment from "moment"
import { GetServerSideProps, NextPage } from "next"
import { NextSeo } from 'next-seo'
import React, { useEffect, useMemo, useState } from "react"
import { ProjectSpecs } from "@/components/widgets/ProjectSpecs"
import { createRedisConnection } from "@/lib/Database"
import whitelistRepo from "@/lib/repository/WhitelistRepository"
import WhitelistIcon from "@/components/icons/WhitelistIcon"

const blackRoof = new BlackRoof(createProvider())

const ProjectDetailPage: NextPage<{ project: IProject }> = ({ project }) => {
    const { active } = useWeb3React()
    const collapseImages = [...project.image_urls]
    const [tetherPrice, setTetherPrice] = useState(0)
    const [info, setInfo] = useState([0, 0])
    const [supply, limit] = useMemo(() => info, [info])

    const progress = useMemo(() => {
        return parseFloat(`${project.meta.minted / project.onchainData.supplyLimit * 100}`).toFixed(2)
    }, [project.meta.minted, project.onchainData.supplyLimit])

    const meta = [
        {
            icon: SackIcon,
            title: `${project.amountRequired} USDT`,
            subitle: 'Total funds needed'
        }, {
            icon: CalendarWaitIcon,
            title: moment(project.timeline.funding_start).format("DD MMM yyyy") + ' - ' + moment(project.timeline.funding_end).format("DD MMM yyyy"),
            subitle: 'Fundraising Periode'
        }, {
            icon: CalendarCheckIcon,
            title: moment(project.timeline.project_start).format("DD MMM yyyy"),
            subitle: 'Project date starts'
        }, {
            icon: TrophyIcon,
            title: "Every month",
            subitle: 'Receive yield/reward'
        },
    ]

    const disableInvestBtn = () => {
        if (supply < limit && project.whitelisted) return false;

        const isActive = isFundingActive(project.timeline.funding_start, project.timeline.funding_end)

        return (supply === limit) || !isActive
    }

    const invest = async () => {
        try {
            if (!active) throw 'Please connect to wallet first!'
            modal.showModal(<FormMint
                item={project}
                supply={supply}
                limit={limit}
                cb={() => blackRoof
                    .getNFTSupply(project.onchainData.projectId)
                    .then(setInfo)
                }
            />
            )
        } catch (error) {
            notify.warning(errorHandler(error))
        }
    }

    useEffect(() => {
        getTetherPrice(1, false).then((amount) => {
            setTetherPrice(amount as number)
        })
        blackRoof
            .getNFTSupply(project.onchainData.projectId)
            .then(setInfo)
    }, [project.onchainData.projectId])
    
    return (
        <>
            <NextSeo
                title={project.name}
                description={project.description.substring(0, 50).replace(/(<([^>]+)>)/gi, "")}
                canonical={`${process.env.NEXT_PUBLIC_WEB_URL}/project/${project.id}`}
                openGraph={{
                    url: `${process.env.NEXT_PUBLIC_WEB_URL}/project/${project.id}`,
                    title: project.name,
                    description: project.description.substring(0, 50).replace(/(<([^>]+)>)/gi, ""),
                    images: project.image_urls.map(url => ({ url })),
                    siteName: 'House of Panda',
                }}
                twitter={{
                    handle: '@handle',
                    site: '@site',
                    cardType: 'summary_large_image',
                }}
            />

            <main>
                <MainNavbar />
                <div className="max-w-7xl px-4 py-8 mx-auto">
                    <div className="flex flex-col md:grid md:grid-cols-[1fr,.75fr] gap-[20px]">
                        <div className="slider">
                            <ImageSlider images={collapseImages} />
                        </div>
                        <div>
                            <div className="mb-8">
                                <div className="flex items-center gap-[15px] uppercase mb-4">
                                    <p className="text-primary">{ProjectTypes[project.onchainData.typeId]}</p>
                                    <div className="bg-primary text-white px-4 py-2 rounded-full">
                                        {project.whitelisted ? (
                                            <div className="inline-flex items-center">
                                                <WhitelistIcon />
                                                <span className="ml-2">Whitelisted</span>
                                            </div>
                                        ) : (
                                            <span>{fundsPeriode(project.timeline.funding_start, project.timeline.funding_end)}</span>
                                        )}
                                    </div>
                                </div>
                                <h1 className="text-3xl font-semibold text-gray-700">{project.name}</h1>
                                <div className="mt-3 inline-flex space-x-1.5 items-center justify-start mb-2">
                                    <div><PinIcon /></div>
                                    <p className="opacity-60 text-sm text-gray-800">{toTitleCase(project.meta.location)}</p>
                                </div>
                            </div>
                            <div className="mb-8">
                                <div className="flex justify-between mb-2">
                                    <div className="inline-flex items-center space-x-2">
                                        <p className="text-sm font-bold text-green-500">{parseFloat(`${project.meta.gain}`).toMoney()} USDT</p>
                                        <p className="opacity-60 text-sm text-gray-800">Collected</p>
                                    </div>
                                    <p className="opacity-60 text-sm text-right text-gray-800">{progress}%</p>
                                </div>
                                <div className="w-full bg-[#ECECED] rounded-full h-2.5">
                                    <div className="bg-[#20BF55] h-2.5 rounded-full transition-all ease-in-out" style={{ width: `${progress}%` }}></div>
                                </div>
                            </div>
                            <div className="mt-5 grid grid-cols-3 items-center gap-3">
                                <div className="rounded-lg border px-4 py-3 flex-grow">
                                    <div className="inline-flex space-x-1 items-center justify-start w-14 h-3.5">
                                        <p className="text-gray-500 text-sm">Reward</p>
                                        <div>
                                            <HTooltip
                                                id="asdfa"
                                                position="right"
                                                content="Total rewards given during annual period"
                                            >
                                                <HelpIcon />
                                            </HTooltip>
                                        </div>
                                    </div>

                                    <h4 className="text-primary font-semibold">{project.onchainData.apy}%</h4>
                                </div>
                                <div className="rounded-lg border px-4 py-3 flex-grow">
                                    <p className="text-gray-500 text-sm">Supply NFT</p>
                                    <p className="text-secondary font-semibold">{supply}/{limit}</p>
                                </div>
                                <div className="rounded-lg border px-4 py-3 flex-grow">
                                    <p className="text-gray-500 text-sm hidden md:block">Project Duration</p>
                                    <p className="text-gray-500 text-sm block md:hidden">Duration</p>
                                    <div className="text-secondary font-semibold">{ProjectTerms[project.onchainData.term]}</div>
                                </div>
                            </div>
                            <div className="mt-5">
                                <p className="text-gray-500">Minimum Investment</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <TetherIcon />
                                    <div className="flex items-center gap-2">
                                        <p className="text-lg font-semibold text-secondary">{parseFloat(`${project.onchainData.price}`).toMoney()} USDT</p>
                                        <span className="text-gray-500">≈ Rp{toIDR(`${project.onchainData.price * tetherPrice}`)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5">
                                <Button
                                    onClick={invest}
                                    prefix={project.whitelisted ? (
                                        <WhitelistIcon />
                                    ) : undefined}
                                    disabled={disableInvestBtn()}
                                    title="Invest Now"
                                    className="w-full justify-center"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:grid md:grid-cols-[1fr,.75fr] gap-[20px] mt-[20px]">
                        <div className="flex flex-col gap-8 md:gap-20">
                            <CollapsibleContainer title="Desription">
                                <div className="prose lg:prose-lg min-w-full py-[16px] px-[24px]" dangerouslySetInnerHTML={{ __html: project.description }} />
                            </CollapsibleContainer>
                            <div>
                                <h5 className="font-semibold text-xl mb-4 text-secondary">Specifications</h5>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
                                    {project.specifications.map((item, i) => {
                                        return (
                                            <div key={i} className="bg-primary-light bg-primary bg-opacity-10 border border-primary px-3 py-2 rounded-md">
                                                <p className="text-sm text-gray-500 mb-1.5">{item.name}</p>
                                                <div className="flex gap-2 items-center">
                                                    <div className="-ml-[1px]">{ProjectSpecs.find(val => item.name == val.text) ? React.createElement(ProjectSpecs.find(val => item.name == val.text)!.icon!, {}) : ''}</div>
                                                    <p className="text-secondary font-semibold">{item.value}</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div>
                                <h5 className="font-semibold text-xl mb-4 text-secondary">Building Plan</h5>
                                <img src={project.blueprint} alt="" className="w-full rounded" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-[20px]">
                            <CollapsibleContainer title="Raising Info">
                                <div className="body py-6 px-6">
                                    <ul className="flex flex-col">
                                        {meta.map((item, i) => {
                                            return (
                                                <li key={i}>
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-14 h-14 border flex items-center justify-center border-primary bg-primary bg-opacity-10 rounded-md">
                                                            {React.createElement(item.icon, {})}
                                                        </div>
                                                        <div>
                                                            <h5 className="font-semibold text-base text-secondary">{item.title}</h5>
                                                            <p className="text-gray-500 text-sm">{item.subitle}</p>
                                                        </div>
                                                    </div>
                                                    {i < meta.length - 1 && <div className="border-b my-4" />}
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            </CollapsibleContainer>

                            <CollapsibleContainer title="Selling Points">
                                <div className="body py-[16px] px-[24px]">
                                    <ul className="flex flex-col gap-[10px]">
                                        {project.selling_points.map((v, i) => {
                                            return (
                                                <li key={i} className="text-gray-500">
                                                    <span>{v}</span>
                                                    {i < project.selling_points.length - 1 && <div className="border-b py-2" />}
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            </CollapsibleContainer>

                            <div>
                                <div className="title mb-2 flex justify-between items-center ">
                                    <h2 className="font-semibold text-xl text-secondary">Project location</h2>
                                </div>
                                <p className="text-gray-500 mb-4">{project.location.fullAddress}. <a href={project.location.maps_url} target="_blank" rel="noreferrer" className="text-primary hover:underline">View on Google Maps</a></p>

                                <iframe
                                    src={`https://maps.google.com/maps?q=${project.location.longitude ?? 0},${project.location.latitude ?? 0}&output=embed&z=15`}
                                    width="100%"
                                    height="450"
                                    className="border-none rounded-lg"
                                    allowFullScreen={false}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="gmap_canvas"
                                />
                            </div>

                            <div className="bg-primary-light border border-primary bg-primary bg-opacity-10 rounded-lg p-[24px]">
                                <h2 className="font-semibold text-xl text-secondary mb-4">{project.name}</h2>
                                <p className="text-gray-500 mb-[24px]">
                                    Read more about this project in the official developer prospectus.
                                </p>
                                <a href={project.prospectus} rel="noreferrer" target="_blank" className="flex transition-all ease-in-out hover:bg-opacity-80 gap-2 items-center w-fit rounded px-4 py-2 bg-primary text-white">
                                    <DirectInboxIcon />
                                    <p className="font-semibold">Download Prospectus</p>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
    try {
        await db.createConnection()

        const user = req.cookies['user'] ? JSON.parse(req.cookies['user']) : null
        let addressIsWhitelisted = false

        const redis = await createRedisConnection()
        const isInWhitelistPeriod = await whitelistRepo.isInWhitelistPeriod(redis)
        if (user) {
            addressIsWhitelisted = await whitelistRepo.addressIsWhitelisted(redis, user.address)
        }

        const whitelistActive = isInWhitelistPeriod && addressIsWhitelisted

        const id = params!.id!.toString()
        let project = await projectRepo.getProjectById(id)
        project.whitelisted = whitelistActive && project.whitelisted

        return { props: { project: JSON.parse(JSON.stringify(project)) } }
    } catch (error) {
        return {
            notFound: true,
        }
    }
}

export default ProjectDetailPage