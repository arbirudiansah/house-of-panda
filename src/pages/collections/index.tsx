/* eslint-disable @next/next/no-img-element */
import Footer from "@/components/Footer";
import FormFilter from "@/components/forms/FormFilter";
import { FilterIcon, HomeCircleIcon } from "@/components/icons";
import MainNavbar from "@/components/layout/MainNavbar";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import * as db from "@/lib/Database"
import { useRouter } from "next/router";
import { useWeb3React } from "@web3-react/core";
import { getEthTetherPrice, maskAddress, toIDR, toQueryString } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { getMyCollections, getTotalInvestment } from "@/lib/repository/TransactionRepository";
import { ResultEntries } from "@/lib/types/data";
import { Collection } from "@/lib/types/Transaction";
import CollectionCard from "@/components/cards/CollectionCard";
import NotFound from "@/components/widgets/NotFound";
import { useCallback, useEffect, useState } from "react";
import '@/lib/utils/extensions'
import { Pagination } from "@/components/widgets/Pagination";
import OnViewTransition from "@/components/animations/OnViewTransition";
import CopyToClipboard from "@/components/widgets/CopyToClipboard";
import { web3Actions } from "@/lib/store/slices/web3Provider";
import useComponentVisible from "@/components/UseVisible";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
    data: ResultEntries<Collection>
    totalInvest: number
}

const perPage = 4
const dropIn = {
    hidden: {
        y: "-20px",
        opacity: 0,
    },
    visible: {
        y: "0",
        opacity: 1,
        transition: {
            duration: 0.9,
            type: "spring",
            damping: 25,
            stiffness: 500,
        },
    },
    exit: {
        y: "-20px",
        opacity: 0,
    },
}

const CollectionPage: NextPage<Props> = ({ data, totalInvest }) => {
    const { account } = useWeb3React()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const web3 = useAppSelector(({ web3Provider }) => web3Provider.web3)

    const { entries, count } = data
    const [ethPrice, setEthPrice] = useState(0)
    const [tetherPrice, setTetherPrice] = useState(0)
    const [tokenBalance, setTokenBalance] = useState(0)
    const [ethBalance, setEthBalance] = useState(0)
    const vis = useComponentVisible(false)

    const [page, setPage] = useState(router.query.page ? parseInt(router.query.page.toString()) : 1)

    const onSortChanged = (e: any) => {
        const query = {
            ...router.query,
            page: 1,
            sort: e.target.value,
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

    const updateQuery = (query: Object) => {
        router.replace(router.pathname + `?${toQueryString(query)}`)
    }

    const getBalances = useCallback(() => {
        getEthTetherPrice()
            .then(([eth, usdt]) => {
                setEthPrice(eth)
                setTetherPrice(usdt)
            })
        if (web3) {
            dispatch(web3Actions.getBalances())
                .unwrap()
                .then(([eth, usdt]) => {
                    setEthBalance(eth)
                    setTokenBalance(usdt)
                })
        }
    }, [dispatch, web3])

    useEffect(() => {
        getBalances()
    }, [getBalances])

    return (
        <>
            <Head>
                <title>Collections |  House of Panda</title>
            </Head>

            <div>
                <MainNavbar />
                <main className="py-6 md:py-8">
                    <div className="px-4 md:px-16 mb-10 max-w-7xl mx-auto">
                        <div className="">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 md:mb-8">
                                <div className="px-4 md:px-7 py-4 md:py-5 bg-pink-500 bg-opacity-10 border rounded-lg border-pink-500 border-opacity-60 flex flex-col justify-center">
                                    <div className="flex flex-col md:flex-row h-full items-center gap-3">
                                        <div>
                                            <img
                                                className="w-[40px] h-[40px] md:w-[54px] md:h-[54px] rounded-full hover:cursor-pointer hover:opacity-75 transition-all ease-in-out"
                                                src={`https://effigy.im/a/${account}.png`}
                                                alt={account ?? ''}
                                            />
                                        </div>
                                        <div className="flex flex-col items-center md:items-start">
                                            <p className="text-primary text-base font-medium">{maskAddress(account ?? '')}</p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <CopyToClipboard data={account!}>
                                                    <div className="inline-flex items-center space-x-1 text-xs text-secondary hover:text-primary transition-all ease-in-out">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                                                        </svg>
                                                        <span>Copy</span>
                                                    </div>
                                                </CopyToClipboard>
                                                <a href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}address/${account}`} target="_blank" rel="noreferrer" className="inline-flex -mt-1 items-center space-x-1 text-xs text-secondary hover:text-primary transition-all ease-in-out">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                                    </svg>

                                                    <span>Explore</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-4 md:px-7 py-4 md:py-5 bg-pink-500 bg-opacity-10 border rounded-lg border-pink-500 border-opacity-60">
                                    <div className="flex flex-col md:flex-row items-center gap-3">
                                        <div>
                                            <div className="w-[40px] h-[40px] md:w-[54px] md:h-[54px] bg-primary rounded-full flex items-center justify-center">
                                                <svg
                                                    viewBox="0 0 30 29"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-[1.5em] h-[1.5em] md:w-[2em] md:h-[2em]"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M18.052 15.5506C17.8815 15.564 17.0008 15.619 15.0362 15.619C13.4737 15.619 12.3642 15.5699 11.975 15.5506C5.93636 15.2725 1.42904 14.1721 1.42904 12.8545C1.42904 11.5369 5.93636 10.438 11.975 10.1554V14.4546C12.3699 14.4844 13.5006 14.5543 15.0632 14.5543C16.9383 14.5543 17.8773 14.4725 18.0463 14.4561V10.1584C24.0722 10.4394 28.5695 11.5399 28.5695 12.8545C28.5695 14.1691 24.0736 15.2695 18.0463 15.5491L18.052 15.5506ZM18.052 9.71374V5.86661H26.4615V0H3.56551V5.86661H11.9736V9.71225C5.13945 10.0409 0 11.4581 0 13.1564C0 14.8546 5.13945 16.2704 11.9736 16.6005V28.9286H18.0506V16.596C24.8691 16.2674 30 14.8517 30 13.1549C30 11.4581 24.8733 10.0424 18.0506 9.71225L18.052 9.71374Z"
                                                        fill="white"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center md:items-start">
                                            <p className="text-sm leading-none mb-2 text-center text-gray-700">USDT Balance</p>
                                            <p className="text-primary text-base font-medium">{tokenBalance.toMoney()} USDT</p>
                                            <p className="text-sm leading-tight text-center text-gray-400">≈ Rp{toIDR(`${tokenBalance * tetherPrice}`)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-4 md:px-7 py-4 md:py-5 bg-pink-500 bg-opacity-10 border rounded-lg border-pink-500 border-opacity-60">
                                    <div className="flex flex-col md:flex-row items-center gap-3">
                                        <div>
                                            <div className="w-[40px] h-[40px] md:w-[54px] md:h-[54px] bg-primary rounded-full flex items-center justify-center">
                                                <svg
                                                    viewBox="0 0 22 34"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-[2em] h-[2em] md:w-[2.5em] md:h-[2.5em]"
                                                >
                                                    <path
                                                        d="M10.624 0V12.5682L21.2468 17.315L10.624 0Z"
                                                        fill="white"
                                                        fillOpacity={0.602}
                                                    />
                                                    <path d="M10.6242 0L0 17.315L10.6242 12.5682V0Z" fill="white" />
                                                    <path
                                                        d="M10.624 25.46V33.9998L21.2539 19.2935L10.624 25.46Z"
                                                        fill="white"
                                                        fillOpacity={0.602}
                                                    />
                                                    <path
                                                        d="M10.6242 33.9998V25.4585L0 19.2935L10.6242 33.9998Z"
                                                        fill="white"
                                                    />
                                                    <path
                                                        d="M10.624 23.4831L21.2468 17.3152L10.624 12.5713V23.4831Z"
                                                        fill="white"
                                                        fillOpacity={0.2}
                                                    />
                                                    <path
                                                        d="M0 17.3152L10.6242 23.4831V12.5713L0 17.3152Z"
                                                        fill="white"
                                                        fillOpacity={0.602}
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center md:items-start">
                                            <p className="text-sm leading-none mb-2 text-center text-gray-700">ETH Balance</p>
                                            <p className="text-primary text-base font-medium">{ethBalance.toMoney()} ETH</p>
                                            <p className="text-sm leading-tight text-center text-gray-400">≈ Rp{toIDR(`${ethBalance * ethPrice}`)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-4 md:px-7 py-4 md:py-5 bg-pink-500 bg-opacity-10 border rounded-lg border-pink-500 border-opacity-60">
                                    <div className="flex flex-col md:flex-row items-center gap-3">
                                        <div>
                                            <HomeCircleIcon className="w-[40px] h-[40px] md:w-[54px] md:h-[54px]" />
                                        </div>
                                        <div className="flex flex-col items-center md:items-start">
                                            <p className="text-sm leading-none mb-2 text-center text-gray-700">Total Investment</p>
                                            <p className="text-primary text-base font-medium">{totalInvest.toMoney()} USDT</p>
                                            <p className="text-sm leading-tight text-center text-gray-400">≈ Rp{toIDR(`${totalInvest * tetherPrice}`)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-0 justify-between mb-6 w-full">
                                <div>
                                    <h1 className="text-xl md:text-2xl font-semibold leading-7 text-gray-700">My Invesment</h1>
                                </div>
                                <div className="inline-flex items-center space-x-3">
                                    <div className="relative" ref={vis.ref}>
                                        <button onClick={vis.toggle} className="">
                                            <div className="py-3 px-5 bg-gray-100 hover:bg-gray-200 rounded-lg text-secondary hover:text-primary transition-all ease-in-out">
                                                <div className="flex space-x-3 items-center justify-end flex-1 h-full">
                                                    <FilterIcon />
                                                    <p className="text-base font-medium">Filters</p>
                                                </div>
                                            </div>
                                        </button>
                                        <AnimatePresence>
                                            {vis.isComponentVisible && (
                                                <motion.div
                                                    className="absolute mt-2 left-0 md:right-0 top-full w-[330px] z-10 shadow-md rounded-lg"
                                                    variants={dropIn}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="exit"
                                                    key="filter-menu"
                                                >
                                                    <FormFilter />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <select onChange={onSortChanged} className="border-none bg-gray-100 py-3 rounded-lg w-[200px] px-6 focus:ring-primary hover:cursor-pointer hover:bg-gray-200 transition-all ease-in-out">
                                        <option value={JSON.stringify({ "lastTrx": -1 })}>Latest Investment</option>
                                        <option value={JSON.stringify({ "lastTrx": 1 })}>Oldest Investment</option>
                                        <option value={JSON.stringify({ "amount": 1 })}>Lower Investment</option>
                                        <option value={JSON.stringify({ "amount": -1 })}>Highest Investment</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                {entries.length ? entries.map((item, i) => (
                                    <OnViewTransition key={i} transition={{ delay: 0.1 + ((i + 5) / 10) }}>
                                        <CollectionCard item={item} />
                                    </OnViewTransition>
                                )) : (
                                    <NotFound />
                                )}
                            </div>
                            <Pagination page={page} perPage={perPage} dataCount={count} onPageChanged={onPageChanged} />
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        await db.createConnection()
        const user = JSON.parse(context.req.cookies.user!)

        const { sort, page, keyword, location, startPrice, endPrice, propertyType } = context.query

        const offset = page ? (parseInt(page.toString()) - 1) * perPage : 0

        const result = await getMyCollections({
            userId: user.id,
            sort: sort?.toString(),
            keyword: keyword?.toString(),
            limit: perPage,
            offset,
            location: location?.toString(),
            startPrice: startPrice ? parseFloat(startPrice.toString()) : undefined,
            endPrice: endPrice ? parseFloat(endPrice.toString()) : undefined,
            propertyType: propertyType ? parseInt(propertyType.toString()) : undefined,
        })
        const { amount } = await getTotalInvestment(user.id)

        return {
            props: {
                data: JSON.parse(JSON.stringify(result)),
                totalInvest: amount,
            }
        }
    } catch (error) {
        return {
            props: {
                data: { entries: [], count: 0 },
                totalInvest: 0,
            }
        }
    }
}


export default CollectionPage