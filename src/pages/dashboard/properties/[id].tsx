/* eslint-disable @next/next/no-img-element */
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import * as db from "@/lib/Database"
import IProject from "@/lib/types/Project";
import { getProjectById } from "@/lib/repository/ProjectRepository";
import { ProjectTerms, ProjectTypes } from "@/lib/consts";
import { DownloadIcon, PinIcon, SearchIcon } from "@/components/icons";
import { fundsPeriode, maskAddress, toQueryString, toTitleCase } from "@/lib/utils";
import classNames from "classnames";
import { useRouter } from "next/router";
import { Table } from "@/components/widgets/Table";
import { getTransactionsByProjectId } from "@/lib/repository/TransactionRepository";
import { ProjectTransaction } from "@/lib/types/Transaction";
import { ResultEntries } from "@/lib/types/data";
import moment from "moment";
import { Pagination } from "@/components/widgets/Pagination";
import DateRangePicker, { DateRange } from "@/components/widgets/DateRangePicker";
import NotFound from "@/components/widgets/NotFound";
import '@/lib/utils/extensions'

import dynamic from "next/dynamic"
const DashboardLayout = dynamic(() => import('@/components/layout/DashboardLayout'), { ssr: false })

interface Props {
    project: IProject | null
    data: ResultEntries<ProjectTransaction>
}

const perPage = 10

const ProjectDetail: NextPage<Props> = ({ project, data }) => {
    const router = useRouter()

    const { entries, count } = data

    const [tabActive, setTabActive] = useState(0)
    const [page, setPage] = useState(router.query.page ? parseInt(router.query.page.toString()) : 1)

    const onSortChanged = (e: any) => {
        const query = {
            ...router.query,
            sort: e.target.value,
            page: 1,
        }

        updateQuery(query)
    }

    const onPageChanged = (p: number) => {
        setPage(p)
        const query = {
            ...router.query,
            page: p,
        }

        updateQuery(query)
    }

    const onSearch = (e: any) => {
        const keyword = e.target.value?.toLowerCase()
        const query = {
            ...router.query,
            page: 1,
            keyword,
        }

        updateQuery(query)
    }

    const onRangeSelected = ({ startDate, endDate }: DateRange) => {
        const query = {
            ...router.query,
            page: 1,
            startDate: startDate ? moment(startDate).format("YYYY-MM-DD") : undefined,
            endDate: endDate ? moment(endDate).format("YYYY-MM-DD") : undefined,
        }

        updateQuery(query)
    }

    const onRangeCleared = () => {
        let query = { ...router.query }

        delete query.startDate
        delete query.endDate

        updateQuery(query)
    }

    const getCurrentRange = () => {
        const { startDate, endDate } = router.query
        return startDate && endDate ? {
            startDate: new Date(startDate.toString()),
            endDate: new Date(endDate.toString()),
        } : null
    }

    const updateQuery = (query: Object) => {
        router.replace(router.pathname + `?${toQueryString(query)}`)
    }

    return (
        <>
            <Head>
                <title>{project ? project.name : 'Project Not Found'} | House of Panda</title>
            </Head>

            <DashboardLayout
                breadcrumbs={[
                    { title: 'My Properties', link: '/properties' },
                    { title: 'Detail Project' },
                    { title: project?.name ?? 'Project Not Found' }
                ]}
            >
                {project ? (
                    <div>
                        <div className="grid grid-cols-2 gap-10 mb-7">
                            <div className="relative rounded-lg">
                                <img className="w-full object-cover h-[325px] rounded-md" src={project.image_urls[0]} alt={project.name} />
                            </div>
                            <div>
                                <div className="mb-8">
                                    <div className="flex items-center gap-[15px] uppercase mb-4">
                                        <p className="text-primary">{ProjectTypes[project.onchainData.typeId]}</p>
                                        <span className="bg-primary text-white px-4 py-2 rounded-full">{fundsPeriode(project.timeline.funding_start, project.timeline.funding_end)}</span>
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
                                            <p className="text-sm font-bold text-green-500">{project.meta.gain} USDT</p>
                                            <p className="opacity-60 text-sm text-gray-800">Collected</p>
                                        </div>
                                        <p className="opacity-60 text-sm text-right text-gray-800">{parseFloat(`${project.meta.progress}`).toFixed(2)}%</p>
                                    </div>
                                    <div className="w-full bg-[#ECECED] rounded-full h-2.5">
                                        <div className="bg-[#20BF55] h-2.5 rounded-full" style={{ width: `${project.meta.progress}%` }}></div>
                                    </div>
                                </div>
                                <div className="mt-5 grid grid-cols-3 items-center gap-3">
                                    <div className="rounded-lg border px-4 py-3 flex-grow">
                                        <p className="text-gray-500 text-sm">Reward</p>
                                        <h4 className="text-primary font-semibold">{project.onchainData.apy}%</h4>
                                    </div>
                                    <div className="rounded-lg border px-4 py-3 flex-grow">
                                        <p className="text-gray-500 text-sm">Supply NFT</p>
                                        <p className="text-secondary font-semibold">{project.meta.minted}/{project.onchainData.supplyLimit}</p>
                                    </div>
                                    <div className="rounded-lg border px-4 py-3 flex-grow">
                                        <p className="text-gray-500 text-sm hidden md:block">Project Duration</p>
                                        <p className="text-gray-500 text-sm block md:hidden">Duration</p>
                                        <div className="text-secondary font-semibold">{ProjectTerms[project.onchainData.term]}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-4 py-3 bg-white border rounded-lg border-gray-200 w-full mb-4">
                            <div className="rounded-lg text-[#637381] focus-within:text-primary focus-within:border-primary border border-gray-300 relative overflow-hidden w-fit">
                                <input onChange={onSearch} type="text" className="border-none ring-1 bg-transparent px-4 py-3 pl-12 w-full" placeholder="Search here..." />
                                <div className="absolute left-0 top-0 h-full flex items-center px-4">
                                    <SearchIcon />
                                </div>
                            </div>
                            <div className="inline-flex items-center space-x-4">
                                <DateRangePicker
                                    range={getCurrentRange()}
                                    onRangeSelected={onRangeSelected}
                                    onDateRangeReset={onRangeCleared} />
                                <select onChange={onSortChanged} defaultValue={router.query.sort} className="border border-gray-300 py-3 rounded-lg w-[200px] px-6 focus:outline-none focus:ring-primary">
                                    <option value={JSON.stringify({ "createdAt": -1 })}>Latest Transaction</option>
                                    <option value={JSON.stringify({ "createdAt": 1 })}>Oldest Transaction</option>
                                    <option value={JSON.stringify({ "amount": 1 })}>Lower Investment</option>
                                    <option value={JSON.stringify({ "amount": -1 })}>Highest Investment</option>
                                </select>
                            </div>
                        </div>

                        <Table
                            headers={[
                                {
                                    title: 'From', accessor: 'address', contentRender: (row) => (
                                        <a
                                            href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}address/${row.user.address}`}
                                            className="text-base font-medium leading-normal text-gray-500 hover:text-primary"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {maskAddress(row.user.address)}
                                        </a>
                                    ),
                                },
                                {
                                    title: 'Qty', accessor: 'minted', contentRender({ minted, meta: { action } }) {
                                        return (
                                            <p className={classNames("text-base leading-normal")}>
                                                <span className={classNames({
                                                    ["text-blue-700"]: action === 'Mint',
                                                    ["text-orange-700"]: action === 'Burn',
                                                })}>[{action}]</span>
                                                &nbsp;{minted} Item
                                            </p>
                                        )
                                    },
                                },
                                {
                                    title: 'Total Investment', accessor: 'amount', contentRender(row) {
                                        return <p className="text-base leading-normal text-gray-500">{row.amount.toMoney()} USDT</p>
                                    },
                                },
                                {
                                    title: 'Date & Time', accessor: 'createdAt', contentRender(row) {
                                        const dt = new Date(row.createdAt)
                                        return (
                                            <div className="text-base leading-normal text-gray-500">
                                                <p>{moment(row.createdAt).format("DD MMM yyyy")}</p>
                                                <p className="text-sm">at {moment(dt).format("HH:mm")}</p>
                                            </div>
                                        )
                                    },
                                },
                                {
                                    title: 'Status', accessor: 'status', contentRender: (row) => (
                                        <a
                                            href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}tx/${row.trxHash}`}
                                            className="text-base font-medium leading-normal text-[#2D69DC] hover:underline"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            View Block Explorer
                                        </a>
                                    )
                                },
                                {
                                    title: 'NFT', accessor: 'projectId', contentRender: (row) => (
                                        <a
                                            href={`${process.env.NEXT_PUBLIC_NFT_URL}/${process.env.NEXT_PUBLIC_SMARTCONTRACT_ADDRESS}/${project.onchainData.projectId}`}
                                            className="text-base font-medium leading-normal border rounded border-blue-700 text-blue-700 px-3 py-2 transition-all ease-in-out hover:bg-blue-700 hover:text-white"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            View NFT
                                        </a>
                                    )
                                },
                            ]}
                            data={entries} />
                        <Pagination page={page} perPage={perPage} dataCount={count} onPageChanged={onPageChanged} />
                    </div>
                ) : (
                    <div>
                        <NotFound />
                    </div>
                )}
            </DashboardLayout>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const id = context.params!.id!.toString()
        await db.createConnection()
        const project = await getProjectById(id)

        const { sort, page, keyword, startDate, endDate } = context.query
        const offset = page ? (parseInt(page.toString()) - 1) * perPage : 0

        const data = await getTransactionsByProjectId(id, {
            sort: sort?.toString(),
            keyword: keyword?.toString(),
            startDate: startDate?.toString(),
            endDate: endDate?.toString(),
            limit: perPage,
            offset,
        })

        return {
            props: {
                project: JSON.parse(JSON.stringify(project)),
                data: JSON.parse(JSON.stringify(data)),
            }
        }
    } catch (error) {
        return {
            props: { project: null, data: { entries: [], count: 0 } },
        }
    }
}

export default ProjectDetail;

