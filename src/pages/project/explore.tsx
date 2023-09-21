import Footer from "@/components/Footer";
import FormFilter from "@/components/forms/FormFilter";
import { ArrowUpIcon, FilterIcon, SearchIcon } from "@/components/icons";
import MainNavbar from "@/components/layout/MainNavbar";
import IProject from "@/lib/types/Project";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import * as db from "@/lib/Database"
import ProjectCard from "@/components/cards/ProjectCard";
import { useRouter } from "next/router";
import { getProjectList } from "@/lib/repository/ProjectRepository";
import { ResultEntries } from "@/lib/types/data";
import { Pagination } from "@/components/widgets/Pagination";
import { useCallback, useEffect, useState } from "react";
import { toQueryString } from "@/lib/utils";
import classNames from "classnames";
import NotFound from "@/components/widgets/NotFound";
import OnViewTransition from "@/components/animations/OnViewTransition";
import { useForm } from "react-hook-form";
import whitelistRepo from "@/lib/repository/WhitelistRepository";

const perPage = 9
type SearchForm = {
    keyword?: string
}

const ExplorePage: NextPage<{ data: ResultEntries<IProject> }> = ({ data = { entries: [], count: 0 } }) => {
    const router = useRouter()
    const { entries, count } = data
    const forms = useForm<SearchForm>()

    const [page, setPage] = useState(router.query.page ? parseInt(router.query.page.toString()) : 1)
    const [showFilter, setShowFilter] = useState(true && !isMobile())

    function isMobile() {
        if (typeof window !== 'undefined') {
            return window.innerWidth < 720
        }

        return false
    }

    const changeFilterVis = () => {
        if (!isMobile()) return;
        setShowFilter(!showFilter)
    }

    const handleResize = useCallback(() => {
        setShowFilter(!isMobile())
    }, [])

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

    const onSearch = ({ keyword }: SearchForm) => {
        const query = {
            ...router.query,
            page: 1,
            keyword,
        }

        updateQuery(query)
    }

    const updateQuery = (query: Object) => {
        router.replace(router.pathname + `?${toQueryString(query)}`)
    }

    useEffect(() => {
        window.addEventListener("resize", handleResize)
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [handleResize])


    return (
        <>
            <Head>
                <title>Explore Project | House of Panda</title>
            </Head>

            <div className="overflow-x-hidden">
                <MainNavbar />
                <main className="px-4 mt-4 md:mt-0 md:px-4 lg:px-16 py-4 md:py-8 mb-10 flex flex-col md:grid md:grid-cols-12 gap-5 overflow-x-hidden">
                    <div className="col-span-3">
                        <div onClick={changeFilterVis} className="col-span-3 bg-gray-100 md:bg-transparent rounded-lg">
                            <div className="w-full flex justify-between items-center pr-5 md:pr-0">
                                <div className="flex w-full space-x-3 items-center justify-items-stretch justify-start py-3 px-5 bg-gray-100 rounded-lg md:mb-6">
                                    <FilterIcon />
                                    <p className="text-base font-semibold select-none text-secondary">Filters</p>
                                </div>
                                <div className={classNames("transition-all block md:hidden ease-in", { ["rotate-180"]: !showFilter })}><ArrowUpIcon /></div>
                            </div>
                            {showFilter && (
                                <div className="px-4 py-2 pb-6 md:pb-0 md:px-0 md:py-0">
                                    <FormFilter />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-span-9">
                        <div className="flex items-center gap-4 mb-6">
                            <form className="rounded-lg bg-gray-100 relative overflow-hidden w-full col-span-3" onSubmit={forms.handleSubmit(onSearch)}>
                                <input {...forms.register('keyword')} type="text" className="border-none ring-1 bg-transparent px-4 py-3 pl-12 w-full" placeholder="Search property..." />
                                <div className="absolute left-0 top-0 h-full flex items-center px-4">
                                    <SearchIcon />
                                </div>
                            </form>
                            <div className="col-span-2">
                                <select onChange={onSortChanged} className="border-none cselect bg-gray-100 py-3 rounded-lg w-[20px] lg:w-[200px] px-5 lg:px-6 focus:ring-primary">
                                    <option value={JSON.stringify({ "createdAt": -1 })}>Latest Project</option>
                                    <option value={JSON.stringify({ "createdAt": 1 })}>Oldest Project</option>
                                    <option value={JSON.stringify({ "onchainData.price": 1 })}>Lower Price</option>
                                    <option value={JSON.stringify({ "onchainData.price": -1 })}>Highest Price</option>
                                </select>
                            </div>
                        </div>

                        {entries.length ? (
                            <>
                                <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {entries.map((item, i) => {
                                        return (
                                            <OnViewTransition key={i} transition={{ delay: 0.05 + ((i + 5) / 10) }}>
                                                <ProjectCard item={item} />
                                            </OnViewTransition>
                                        )
                                    })}
                                </div>
                                <Pagination page={page} perPage={perPage} dataCount={count} onPageChanged={onPageChanged} />
                            </>
                        ) : <NotFound />}
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    try {
        await db.createConnection()
        const user = req.cookies['user'] ? JSON.parse(req.cookies['user']) : null
        let addressIsWhitelisted = false

        const redis = await db.createRedisConnection()
        const isInWhitelistPeriod = await whitelistRepo.isInWhitelistPeriod(redis)
        if (user) {
            addressIsWhitelisted = await whitelistRepo.addressIsWhitelisted(redis, user.address)
        }

        const whitelistActive = isInWhitelistPeriod && addressIsWhitelisted

        const { sort, page, keyword, location, startPrice, endPrice, propertyType } = query

        const offset = page ? (parseInt(page.toString()) - 1) * perPage : 0

        const { entries, count } = await getProjectList({
            active: true,
            public: true,
            sort: sort?.toString(),
            keyword: keyword?.toString(),
            limit: perPage,
            offset,
            location: location?.toString(),
            startPrice: startPrice ? parseFloat(startPrice.toString()) : undefined,
            endPrice: endPrice ? parseFloat(endPrice.toString()) : undefined,
            propertyType: propertyType ? parseInt(propertyType.toString()) : undefined,
        })

        const result = {
            count,
            entries: entries.map((item) => {
                return {
                    ...item,
                    whitelisted: whitelistActive && item.whitelisted,
                }
            })
        }

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


export default ExplorePage