import moment from "moment";
import React, { FC, useEffect, useState } from "react";
import { Calendar, Range } from "react-date-range"
import ComboBox from "react-responsive-combo-box";

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import useComponentVisible from "../UseVisible";
import { RemoveIcon } from "../icons";

interface Props {
    range?: Range | null;
    onRangeSelected?: (range: Range) => void;
    onDateRangeReset?: () => void;
}

export type DateRange = Range

const DateRangePicker: FC<Props> = ({ range, onRangeSelected, onDateRangeReset }) => {
    const vis = useComponentVisible(false);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const updateRange = (newRange: DateRange) => {
        if (newRange.startDate && newRange.endDate) {
            setStartDate(newRange.startDate)
            setEndDate(newRange.endDate)
        }
    }

    const resetDateRange = () => {
        vis.setIsComponentVisible(false)
        setStartDate(null)
        setEndDate(null)
        onDateRangeReset?.()
    }

    const isEqual = (left: Date | null, right: Date | null): boolean => {
        return moment(left).isSame(right);
    }

    const toDateDisplay = (date: Date | null): string => {
        if (!date) return "";
        return moment(date).format("DD/MM/YYYY");
    }

    const rangeValue = (): string => {
        if (!startDate || !endDate) return 'Select Date Range';
        return `${toDateDisplay(startDate)} - ${toDateDisplay(endDate)}`;
    }

    useEffect(() => {
        if (range && range.startDate && range.endDate) {
            setStartDate(range.startDate);
            setEndDate(range.endDate);
        }
    }, [range])

    return (
        <div className="relative" ref={vis.ref}>
            {startDate && (
                <button onClick={resetDateRange} className="absolute right-2 top-3 hover:opacity-80">
                    <RemoveIcon />
                </button>
            )}
            <button className="w-full" onClick={vis.toggle}>
                <div className="border border-gray-300 py-3 rounded-lg px-3 focus:ring-primary inline-flex items-center space-x-4">
                    <div>
                        <svg
                            width={18}
                            height={18}
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M6.48674 1.51062C6.87263 1.51062 7.18546 1.82345 7.18546 2.20934V2.90806H11.3778V2.20934C11.3778 1.82345 11.6906 1.51062 12.0765 1.51062C12.4624 1.51062 12.7752 1.82345 12.7752 2.20934V2.90806H14.1726C15.3303 2.90806 16.2688 3.84654 16.2688 5.00421V14.7863C16.2688 15.9439 15.3303 16.8824 14.1726 16.8824H4.39059C3.23291 16.8824 2.29443 15.9439 2.29443 14.7863V5.00421C2.29443 3.84654 3.23291 2.90806 4.39059 2.90806H5.78802V2.20934C5.78802 1.82345 6.10085 1.51062 6.48674 1.51062ZM5.78802 4.30549H4.39059C4.0047 4.30549 3.69187 4.61832 3.69187 5.00421V7.10036H14.8714V5.00421C14.8714 4.61832 14.5585 4.30549 14.1726 4.30549H12.7752V5.00421C12.7752 5.3901 12.4624 5.70293 12.0765 5.70293C11.6906 5.70293 11.3778 5.3901 11.3778 5.00421V4.30549H7.18546V5.00421C7.18546 5.3901 6.87263 5.70293 6.48674 5.70293C6.10085 5.70293 5.78802 5.3901 5.78802 5.00421V4.30549ZM14.8714 8.4978H3.69187V14.7863C3.69187 15.1722 4.0047 15.485 4.39059 15.485H14.1726C14.5585 15.485 14.8714 15.1722 14.8714 14.7863V8.4978Z"
                                fill="#637381"
                            />
                        </svg>
                    </div>
                    <p className="text-base leading-normal text-gray-500">{rangeValue()}</p>
                    <div>{startDate && endDate ? (
                        <div className="w-4" />
                    ) : (
                        <svg width="15" height="9" viewBox="0 0 15 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 1L7.5 8L1 0.999999" stroke="#7C7C7C" />
                        </svg>
                    )}</div>
                </div>
            </button>
            {vis.isComponentVisible && (
                <div id="datePicker" className="absolute z-10 mt-1 right-0 shadow-lg bg-white">
                    <div className="flex border-b border-[#EEEDF0]">
                        <Calendar
                            className="tip3-calendar"
                            displayMode={'dateRange'}
                            color="#FF3392"
                            showMonthAndYearPickers={false}
                            onChange={(d) => {
                                if (!startDate) {
                                    setStartDate(d);
                                } else if (startDate && !endDate) {
                                    if (d < startDate) {
                                        setStartDate(d);
                                        setEndDate(startDate);
                                    } else {
                                        setEndDate(d);
                                    }
                                } else if (startDate && endDate) {
                                    setStartDate(d);
                                    setEndDate(null);
                                }
                            }}
                            months={2}
                            monthDisplayFormat={'MMMM'}
                            updateRange={(rng) => {
                                console.log(rng);
                                updateRange(rng);
                            }}
                            dayContentRenderer={(d) => {
                                if (startDate && endDate) {
                                    if (d > startDate && d < endDate) {
                                        return (
                                            <div className="text-[#FF3392] w-full font-semibold h-fit bg-[#F8F7FA]">
                                                {moment(d).format('D')}
                                            </div>
                                        )
                                    }
                                }

                                if (isEqual(d, startDate) || isEqual(d, endDate)) {
                                    return (
                                        <div className="text-white w-full font-semibold h-fit bg-[#FF3392]">
                                            {moment(d).format('D')}
                                        </div>
                                    )
                                }

                                return (
                                    <span>{moment(d).format('D')}</span>
                                )
                            }}
                            dragSelectionEnabled={true}
                            direction={'horizontal'}
                        />
                    </div>
                    <div className="px-6 py-4">
                        <div className="flex justify-between">
                            <div className="inline-flex items-center space-x-1">
                                <input placeholder="Start Date" value={toDateDisplay(startDate)} className="px-3 w-32 py-2 bg-[#F8F7FA] text-black" />
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.73755 12.0125L17.2375 12.0125M12.7625 16.2625L17.2625 12.0125L12.7625 7.76245" stroke="#19181A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <input placeholder="End Date" value={toDateDisplay(endDate)} className="px-3 w-32 py-2 bg-[#F8F7FA] text-black" />
                            </div>
                            <div className="inline-flex items-center space-x-2">
                                <button onClick={() => vis.setIsComponentVisible(false)} className="px-3 py-2 bg-[#F8F7FA] text-black">Cancel</button>
                                <button
                                    onClick={() => {
                                        vis.setIsComponentVisible(false);
                                        if (startDate && endDate && onRangeSelected) {
                                            onRangeSelected({ startDate, endDate });
                                        }
                                    }}
                                    className="px-3 py-2 bg-[#FF3392] text-white font-semibold">Set Date</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DateRangePicker;