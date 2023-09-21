/* eslint-disable @next/next/no-img-element */
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import * as db from "@/lib/Database"
import { getTransactions } from "@/lib/repository/TransactionRepository";
import { ResultEntries } from "@/lib/types/data";
import { GroupedTransaction } from "@/lib/types/Transaction";
import { Table } from "@/components/widgets/Table";
import { ProjectTypes } from "@/lib/consts";
import Link from "next/link";
import { SearchIcon } from "@/components/icons";
import { useRouter } from "next/router";
import { Pagination } from "@/components/widgets/Pagination";
import '@/lib/utils/extensions'

import dynamic from "next/dynamic"
const DashboardLayout = dynamic(() => import('@/components/layout/DashboardLayout'), { ssr: false })

interface Props {
    data: ResultEntries<GroupedTransaction>,
}

const perPage = 10;

const Properties: NextPage<Props> = ({ data }) => {
    const { entries, count } = data

    const router = useRouter()

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

    const updateQuery = (query: any) => {
        router.push({
            pathname: router.pathname,
            query,
        });
    }

    return (
        <>
            <Head>
                <title>Transactions | House of Panda</title>
            </Head>

            <DashboardLayout breadcrumbs={[{ title: 'Transactions' }]}>
                <div className="flex justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-semibold leading-loose text-gray-800">Transactions</h1>
                    </div>
                    <div>
                    </div>
                </div>
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
                    <div>
                        <select onChange={onSortChanged} defaultValue={router.query.sort} className="border border-gray-300 py-3 rounded-lg w-[200px] px-6 focus:ring-primary">
                            <option value={JSON.stringify({ "lastTrx": -1 })}>Latest Transaction</option>
                            <option value={JSON.stringify({ "lastTrx": 1 })}>Oldest Transaction</option>
                            <option value={JSON.stringify({ "amount": 1 })}>Lower Funds</option>
                            <option value={JSON.stringify({ "amount": -1 })}>Highest Funds</option>
                        </select>
                    </div>
                </div>
                <Table
                    headers={[
                        {
                            title: 'Property Name', accessor: 'projectName', contentRender(row) {
                                return <p className="text-base font-medium leading-normal text-secondary">{row.projectName}</p>
                            },
                        },
                        {
                            title: 'Property Type', accessor: 'projectTypeId', contentRender(row) {
                                return <p className="text-base leading-normal text-gray-500">{ProjectTypes[row.projectTypeId]}</p>
                            },
                        },
                        {
                            title: 'Transaction(s)', accessor: 'totalTrx', contentRender(row) {
                                return <p className="text-base leading-normal text-gray-500">{row.totalTrx}</p>
                            }
                        },
                        {
                            title: 'Total Funds', accessor: 'amount', contentRender(row) {
                                return <p className="text-base leading-normal text-gray-500">{row.amount.toMoney()} USDT</p>
                            }
                        },
                    ]}
                    renderAction={(row) => {
                        return (
                            <Link href={`/dashboard/properties/${row.projectId}#trx`}>
                                <a className="px-3 py-2.5 bg-blue-500 rounded-md hover:bg-opacity-75 transition-all ease-in-out inline-block">
                                    <p className="text-base font-medium tracking-wide text-center text-white">View Transaction</p>
                                </a>
                            </Link>
                        )
                    }}
                    data={entries} />
                <Pagination page={page} perPage={perPage} dataCount={count} onPageChanged={onPageChanged} />
            </DashboardLayout>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        await db.createConnection()

        const { sort, page, keyword } = context.query

        const offset = page ? (parseInt(page.toString()) - 1) * perPage : 0

        const result = await getTransactions({
            sort: sort?.toString(),
            keyword: keyword?.toString(),
            limit: perPage,
            offset,
        })

        return {
            props: {
                data: JSON.parse(JSON.stringify(result)),
            }
        }
    } catch (error) {
        return {
            props: {
                data: { entries: [], count: 0 }
            },
        }
    }
}

export default Properties;

