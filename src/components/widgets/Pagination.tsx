import React, { FC, useCallback, useEffect } from "react"

interface Props {
    page: number
    perPage: number
    dataCount: number
    pageLimit?: number
    onPageChanged: (page: number) => void
}

export const Pagination: FC<Props> = ({ page, dataCount, perPage, onPageChanged, pageLimit = 5 }) => {
    const totalPages = Math.ceil(dataCount / perPage)

    const getPaginationGroup = () => {
        let start = page > 3 ? page - 3 : 0
        return new Array(pageLimit).fill(1).map((_, idx) => start + idx + 1)
    }

    const changePage = (page: number) => {
        scrollToTop()
        onPageChanged(page)
    }

    const GeneratePagination = (): JSX.Element => {
        const pageNumbers: any[] = []
        getPaginationGroup().forEach(i => {
            if (i <= totalPages) {
                if (i === page) {
                    pageNumbers.push(<button onClick={() => changePage(i)} className="text-base rounded-md w-10 h-10 bg-primary text-white" key={i}>{i}</button>)
                } else {
                    pageNumbers.push(<button onClick={() => changePage(i)} className="text-base border transition-all ease-in-out hover:border-primary rounded-md w-10 h-10 hover:bg-primary hover:text-white text-black" key={i}>{i}</button>)
                }
            }
        })

        return (
            <div className="inline-flex space-x-2 items-center">
                {pageNumbers.map((item) => item)}
            </div>
        )
    }

    const onClickPrev = (e: any) => {
        e.preventDefault()
        if (page > 1) {
            scrollToTop()
            onPageChanged(page - 1)
        }
    }

    const onClickNext = (e: any) => {
        e.preventDefault()
        if (page < totalPages) {
            scrollToTop()
            onPageChanged(page + 1)
        }
    }

    const scrollToTop = () => {
        const section = document.querySelector('#table')
        const top = section?.getBoundingClientRect().top ?? 0
        window.scrollBy(0, top - 120)
    }

    if (totalPages < 2) return null;

    return (
        <div className="w-full flex justify-center my-10">
            <div className="bg-white px-2 md:px-2 py-2 border rounded-md w-fit">
                <div className="flex justify-between md:inline-flex text-base items-center space-x-2">
                    <button
                        disabled={page === 1}
                        className="h-10 w-10 border rounded-md hover:cursor-pointer hover:border-primary stroke-black hover:bg-primary flex justify-center items-center transition-all ease-in-out hover:stroke-white"
                        onClick={onClickPrev}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="h-6 w-6" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <GeneratePagination />
                    <button
                        className="h-10 w-10 stroke-black border rounded-md hover:cursor-pointer hover:border-primary hover:bg-primary flex justify-center items-center transition-all ease-in-out hover:stroke-white"
                        onClick={onClickNext}
                        disabled={page === totalPages}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="h-6 w-6" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                </div>
            </div>
        </div>
    )
}