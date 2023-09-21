/* eslint-disable @next/next/no-img-element */
import Button from "@/components/widgets/Button";
import { PlusIcon, SearchIcon } from "@/components/icons";
import { Pagination } from "@/components/widgets/Pagination";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { Table } from "@/components/widgets/Table";
import Link from "next/link";
import { fundsPeriode, maskAddress, toTitleCase } from "@/lib/utils";
import { ProjectStatus, ProjectTerms, ProjectTypes } from "@/lib/consts";
import moment from "moment";
import DateRangePicker, { DateRange } from "@/components/widgets/DateRangePicker";
import '@/lib/utils/extensions'
import classNames from "classnames";
import TableAction from "@/components/widgets/TableAction";
import { modal } from "@/lib/store/slices/modal";
import FormChangeStatus from "@/components/forms/FormChangeStatus";
import { trpc } from '@/lib/utils/trpc';
import { notify } from "@/lib/store/slices/message";
import { errorHandler } from "@/lib/ErrorHandler";
import { LoadingIcon } from "@/components/widgets/LoadingIcon";
import { useAppDispatch } from "@/lib/store/hooks";
import { projectActions } from "@/lib/store/slices/project";
import dynamic from "next/dynamic"
const DashboardLayout = dynamic(() => import('@/components/layout/DashboardLayout'), { ssr: false })

const perPage = 10

const Properties: NextPage = () => {
    const router = useRouter()
    const [page, setPage] = useState(1)
    const utils = trpc.useContext();
    const dispatch = useAppDispatch()

    const { data, error, isInitialLoading } = trpc.project.list.useQuery({
        limit: perPage,
        offset: (page - 1) * perPage,
        keyword: router.query.keyword?.toString(),
        sort: router.query.sort?.toString(),
        startDate: router.query.startDate?.toString(),
        endDate: router.query.endDate?.toString(),
    }, {
        staleTime: 3000,
    });

    trpc.project.onDeployProject.useSubscription(undefined, {
        onData: async (d) => {
            console.log(d)
            await utils.project.list.invalidate()
        },
        onError: async (err) => {
            console.log(err)
            await utils.project.list.invalidate()
        },
    })

    const redeployProject = trpc.project.redeployProject.useMutation()

    const onSortChanged = (e: any) => {
        const query = {
            ...router.query,
            offset: 0,
            limit: perPage,
            sort: e.target.value,
        }

        updateQuery(query)
    }

    const onPageChanged = (page: number) => {
        setPage(page)
        const query = {
            ...router.query,
            page,
            perPage,
        }

        updateQuery(query)
    }

    const onSearch = (e: React.FormEvent<any>) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement);
        const keyword = formData.get("keyword");
        if (!keyword) return;

        const query = {
            ...router.query,
            page: 1,
            perPage,
            keyword,
        };

        updateQuery(query);
    }

    const onRangeSelected = ({ startDate, endDate }: DateRange) => {
        const query = {
            ...router.query,
            page: 1,
            perPage,
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

    const getCurrentRange = useMemo(() => {
        const { startDate, endDate } = router.query
        return startDate && endDate ? {
            startDate: new Date(startDate.toString()),
            endDate: new Date(endDate.toString()),
        } : null
    }, [router.query])

    const updateQuery = (query: any) => {
        router.push({
            pathname: router.pathname,
            query,
        });
    }

    useEffect(() => {
        dispatch(projectActions.checkPending())
    }, [dispatch])

    return (
        <>
            <Head>
                <title>My Properties | House of Panda</title>
            </Head>

            <DashboardLayout breadcrumbs={[{ title: 'My Properties' }]}>
                <div className="flex justify-between mb-12">
                    <div>
                        <h1 className="text-2xl font-semibold leading-loose text-gray-800">Property List</h1>
                    </div>
                    <Button
                        title="Add New Project"
                        suffix={<PlusIcon />}
                        onClick={(e) => router.push('/dashboard/properties/create')}
                    />
                </div>
                <div>
                    <div className="flex items-center justify-between px-4 py-3 bg-white border rounded-lg border-gray-200 w-full mb-4">
                        <form onSubmit={onSearch} onReset={() => updateQuery({})} className="rounded-lg text-[#637381] focus-within:text-primary focus-within:border-primary border border-gray-300 relative overflow-hidden group w-[300px]">
                            <input type="text" name="keyword" className="border-none ring-1 focus:pl-4 bg-transparent px-4 py-3 pl-12 w-full transition-all ease-in-out" placeholder="Search here..." defaultValue={router.query.keyword} />
                            <div className="absolute left-0 top-0 h-full flex items-center px-4 group-focus-within:left-[-100%] transition-all duration-1s ease-in-out">
                                <SearchIcon />
                            </div>
                            <div className="h-full px-3 hidden group-focus-within:inline-flex transition-all ease-in-out absolute right-0 top-0 space-x-2 items-center">
                                <div>
                                    <kbd className="py-1 px-2 bg-gray-100 rounded text-xs">&#x23CE;</kbd>
                                </div>
                                {router.query.keyword && (
                                    <button type='reset'>
                                        <kbd className="py-1 px-2 bg-gray-100 rounded text-xs hover:bg-opacity-90 cursor-pointer">&#x2715;</kbd>
                                    </button>
                                )}
                            </div>
                        </form>
                        <div className="inline-flex items-center space-x-4">
                            <DateRangePicker
                                range={getCurrentRange}
                                onRangeSelected={onRangeSelected}
                                onDateRangeReset={onRangeCleared}
                            />
                            <select onChange={onSortChanged} defaultValue={router.query.sort} className="border border-gray-300 py-3 rounded-lg w-[200px] px-6 focus:outline-none focus:ring-primary">
                                <option value={JSON.stringify({ "createdAt": -1 })}>Latest Project</option>
                                <option value={JSON.stringify({ "createdAt": 1 })}>Oldest Project</option>
                                <option value={JSON.stringify({ "amountRequired": 1 })}>Lower Funds Needed</option>
                                <option value={JSON.stringify({ "amountRequired": -1 })}>Highest Funds Needed</option>
                            </select>
                        </div>
                    </div>
                    <Table
                        data={data?.entries ?? []}
                        isLoading={isInitialLoading}
                        headers={[
                            {
                                title: 'Property Name', accessor: 'projectName', contentRender: (row) => (
                                    <div className="flex items-center gap-4">
                                        <div className="min-w-[80px] max-w-[80px] min-h-[50px] max-h-[50px] bg-red-300">
                                            <img className="object-cover" src={row.image_urls[0]} alt={row.name} style={{
                                                width: 80,
                                                height: 50,
                                            }} />
                                        </div>
                                        <div>
                                            <Link href={`/dashboard/properties/${row.id}`}>
                                                <a className="text-base hover:text-primary font-medium leading-normal text-gray-700">{row.name}</a>
                                            </Link>
                                            <p className="text-sm leading-tight text-gray-500">{toTitleCase(row.meta.location)}</p>
                                        </div>
                                    </div>
                                ),
                            },
                            {
                                title: 'Onchain', accessor: 'onc', contentRender: ({ onchainData: { trxHash, status } }) => (
                                    <div>
                                        {trxHash && (
                                            <div>
                                                <a className="text-base hover:text-primary font-medium leading-normal text-gray-700" href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}tx/${trxHash}`} target="_blank" rel="noreferrer">{maskAddress(trxHash)}</a>
                                            </div>
                                        )}
                                        <div className={classNames("inline-flex items-center space-x-1 px-[6px] py-1 rounded-md font-medium", {
                                            ["bg-orange-100 text-orange-500"]: status === 'pending',
                                            ["bg-slate-100 text-gray-500"]: status === 'creating',
                                            ["bg-green-100 text-green-800"]: status === 'success',
                                            ["bg-red-100 text-red-500"]: status === 'failed',
                                        })}>
                                            <LoadingIcon w={15} h={15} show={['pending', 'creating'].includes(status)} fill="#FF3392" stroke="#a1a1a1" />
                                            <p className="text-xs leading-none">{toTitleCase(status)}</p>
                                        </div>
                                    </div>
                                ),
                            },
                            {
                                title: 'Property Type', accessor: 'a', contentRender: (row) => (
                                    <p className="text-base leading-normal text-gray-500">{ProjectTypes[row.onchainData.typeId]}</p>
                                ),
                            },
                            {
                                title: 'Project Duration', accessor: 'c', contentRender: (row) => (
                                    <div>
                                        <p className="text-base leading-normal text-gray-700">{ProjectTerms[row.onchainData.term]}</p>
                                        <p className="text-sm leading-tight text-gray-500">{fundsPeriode(row.timeline.funding_start, row.timeline.funding_end)}</p>
                                    </div>
                                ),
                            },
                            {
                                title: 'Reward', accessor: 'd', contentRender: (row) => (
                                    <p className="text-base leading-normal text-gray-500">{row.onchainData.apy}%</p>
                                ),
                            },
                            {
                                title: 'Funds Needed', accessor: 'e', contentRender: (row) => (
                                    <p className="text-base leading-normal text-gray-500">{row.amountRequired.toMoney()} USDT</p>
                                ),
                            },
                            {
                                title: 'Status', accessor: 'st', contentRender: ({ onchainData, status }) => {
                                    if (onchainData.status !== 'success') {
                                        return (<span>-</span>)
                                    }

                                    return <div>{ProjectStatus[status]}</div>
                                },
                            },
                        ]}
                        renderAction={(item) => {
                            const { id, onchainData } = item
                            let menus = undefined
                            if (onchainData.status === 'failed') {
                                menus = [
                                    {
                                        label: 'Redeploy',
                                        onClick: () => {
                                            notify.info('Redeploying project...')
                                            redeployProject.mutateAsync({ id })
                                                .then(async (_) => await utils.project.list.invalidate())
                                                .catch(e => notify.error(errorHandler(e)))
                                        },
                                    }
                                ]
                            } else if (onchainData.status === 'success') {
                                menus = [
                                    {
                                        label: 'Change Status',
                                        onClick: () => modal.showModal(<FormChangeStatus
                                            item={item}
                                            cb={async () => await utils.project.list.invalidate()}
                                        />)
                                    }
                                ]
                            }

                            return (
                                <TableAction
                                    menus={menus}
                                    onEdit={() => router.push(`/dashboard/properties/edit?id=${id}`)}
                                    onDetail={() => router.push(`/dashboard/properties/${id}`)}
                                />
                            )
                        }}
                    />
                    <Pagination
                        page={page}
                        perPage={perPage}
                        dataCount={data?.count ?? 0}
                        onPageChanged={onPageChanged}
                    />
                </div>
            </DashboardLayout>
        </>
    )
}

export default trpc.withTRPC(Properties)

