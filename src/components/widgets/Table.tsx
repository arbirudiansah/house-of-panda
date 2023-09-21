import { FC } from "react";

interface Header<T> {
    title: string;
    accessor: string;
    width?: string | number;
    contentRender?: (row: T) => JSX.Element;
}

interface Props<T> {
    headers: Header<T>[];
    data: T[];
    renderAction?: (row: T) => JSX.Element;
    isLoading?: boolean;
    bgColor?: string;
    minHeight?: number;
    light?: boolean;
    actionTitle?: string;
}

export const Table = <T extends unknown>({ headers, data, isLoading = false, actionTitle = "Action", renderAction, bgColor = "bg-white", light }: Props<T>) => {

    return (
        <div id="table" className="overflow-x-scroll lg:overflow-visible z-[1] relative border rounded-lg">
            <table className="w-full overflow-visible rounded-t-lgw-full rounded-lg">
                <thead className="rounded-t-lg">
                    <tr className="rounded-t-lg border-b">
                        {headers.map((header) => (
                            <th className="bg-white first:rounded-tl-lg last:rounded-tr-lg text-base font-medium leading-normal py-5 px-6 min-w-fit text-left" key={header.accessor}>{header.title}</th>
                        ))}
                        {renderAction && (
                            <th className="py-5 px-6 bg-white text-center text-base rounded-tr-lg font-medium leading-normal">{actionTitle}</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {!isLoading && data.map((row, idx) => {
                        type ObjectKey = keyof typeof row;
                        return (
                            <tr className={`${bgColor} rounded-b-lg border-b last:border-none hover:bg-opacity-10 hover:bg-[#E7F8F3]`} key={idx}>
                                {headers.map((header) => (
                                    <td width={header.width} className="py-3 px-6 min-w-fit text-base text-left" key={header.accessor}>
                                        <>
                                            {header.contentRender ? header.contentRender(row) : row[header.accessor as ObjectKey]}
                                        </>
                                    </td>
                                ))}
                                {renderAction && (
                                    <td className="py-3 px-6 text-center h-full">
                                        {renderAction(row)}
                                    </td>
                                )}
                            </tr>
                        )
                    })}
                    {(!isLoading && data.length == 0) && (
                        <tr className={bgColor}>
                            <td colSpan={renderAction ? headers.length + 1 : headers.length}>
                                <div className={`${light ? '' : 'h-[475px]'} w-full flex justify-center items-center`}>
                                    <div className={`text-center mt-4 ${light ? 'py-6' : 'py-24'}`}>
                                        <div className="inline-flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 opacity-20" fill="none" viewBox="0 0 24 24" stroke="grey" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                        </div>
                                        <h1 className="text-base font-medium mt-3">No data...</h1>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    )}
                    {isLoading && (
                        <tr className={bgColor}>
                            <td colSpan={renderAction ? headers.length + 1 : headers.length}>
                                <div className={`${light ? '' : 'h-[475px]'} w-full flex justify-center items-center`}>
                                    <div className={`text-center mt-4 ${light ? 'py-6' : 'py-24'}`}>
                                        <div className="inline-flex items-center">
                                            <svg className="w-20 h-20 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none"
                                                viewBox="0 0 24 24">
                                                <circle className="opacity-20" cx="12" cy="12" r="10" stroke="grey" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="#FF3392"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                                </path>
                                            </svg>
                                        </div>
                                        <h1 className="text-base font-medium mt-3">Loading data...</h1>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}