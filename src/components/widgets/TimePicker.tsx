// create reactjs TimePicker component input with popup which used tailwindcss

import { FC, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import useComponentVisible from "../UseVisible";
import { MessageError } from "./MessageError";
import { RemoveIcon } from "../icons";
import classNames from "classnames";

interface Props {
    name: string;
    currentValue?: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    className?: string;
    readOnly?: boolean;
}

const TimePicker: FC<Props> = ({ name, currentValue, label, placeholder, required, className, readOnly }) => {
    const {
        register,
        formState: { errors },
        setValue,
        trigger,
    } = useFormContext();
    const isInvalid = (): boolean => {
        const params = name.split('.')
        if (params.length === 2) {
            const [arg0, arg1] = params
            const field: any | undefined = errors[arg0];
            return field?.[arg1] !== undefined
        }

        return errors[name] !== undefined
    }

    const renderMessage = (): any => {
        const params = name.split('.')
        if (params.length === 2) {
            const [arg0, arg1] = params
            const field: any | undefined = errors[arg0];
            return field?.[arg1]?.message
        }

        return errors[name]?.message
    }

    const [time, setTime] = useState<string | undefined>();
    const vis = useComponentVisible(false)

    const onTimeSelected = (time: string) => {
        setTime(time)
        setValue(name, time)
        vis.setIsComponentVisible(false)
    }

    const removeTime = (e: any) => {
        e.preventDefault()
        setTime(undefined)
        setValue(name, undefined)
    }

    useEffect(() => {
        if (currentValue) {
            setValue(name, currentValue)
        }
    }, [currentValue, name, setValue])

    return (
        <div className={className}>
            <label className="font-medium text-secondary" htmlFor={name}>
                {label} {label && (required && <span className="text-red-500">*</span>)}
            </label>

            <div className="relative" ref={vis.ref}>
                {vis.isComponentVisible && (
                    <div className="absolute bottom-full z-20 mb-1 right-0">

                    </div>
                )}
                <input
                    type="time"
                    id={name}
                    placeholder={placeholder ?? '00:00'}
                    className={classNames(`mt-2 mb-2 h-11 block focus:ring focus:ring-opacity-50 read-only:cursor-default read-only:bg-gray-50 appearance-none w-full rounded-md shadow-sm`, {
                        ["border-red-500 invalid:ring-red-200 focus:border-red-500 focus:ring-red-200"]: isInvalid(),
                        ["border-gray-300 focus:border-gray-300 focus:ring-gray-200"]: !isInvalid(),
                    })}
                    {...register(name, {
                        required: required && "This field is required",
                        onChange: (_) => {
                            trigger(name)
                        }
                    })}
                    readOnly={readOnly}
                    onClick={vis.toggle}
                />
                <div className="w-fit h-6 absolute top-3.5 right-2.5">
                    {!time ? (
                        <svg
                            width={18}
                            height={18}
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-1"
                        >
                            <g clipPath="url(#clip0_1504_1447)">
                                <path
                                    d="M9 0C7.21997 0 5.47991 0.527841 3.99987 1.51677C2.51983 2.50571 1.36627 3.91131 0.685084 5.55585C0.00389576 7.20038 -0.174334 9.00998 0.172933 10.7558C0.5202 12.5016 1.37737 14.1053 2.63604 15.364C3.89471 16.6226 5.49836 17.4798 7.24419 17.8271C8.99002 18.1743 10.7996 17.9961 12.4442 17.3149C14.0887 16.6337 15.4943 15.4802 16.4832 14.0001C17.4722 12.5201 18 10.78 18 9C17.9974 6.61384 17.0484 4.32616 15.3611 2.63889C13.6738 0.951621 11.3862 0.00258081 9 0V0ZM9 15.75C7.66498 15.75 6.35993 15.3541 5.2499 14.6124C4.13987 13.8707 3.2747 12.8165 2.76381 11.5831C2.25292 10.3497 2.11925 8.99251 2.3797 7.68314C2.64015 6.37377 3.28302 5.17103 4.22703 4.22703C5.17103 3.28302 6.37377 2.64015 7.68314 2.3797C8.99251 2.11925 10.3497 2.25292 11.5831 2.76381C12.8165 3.2747 13.8707 4.13987 14.6124 5.2499C15.3541 6.35993 15.75 7.66498 15.75 9C15.748 10.7896 15.0362 12.5053 13.7708 13.7708C12.5053 15.0362 10.7896 15.748 9 15.75Z"
                                    fill="#637381"
                                />
                                <path
                                    d="M7.87498 8.29119L6.07498 9.41619C5.94972 9.49461 5.84114 9.59695 5.75544 9.71735C5.66974 9.83775 5.6086 9.97385 5.57552 10.1179C5.54243 10.2619 5.53805 10.4111 5.56263 10.5568C5.5872 10.7025 5.64024 10.842 5.71873 10.9672C5.79715 11.0924 5.89949 11.201 6.01988 11.2867C6.14028 11.3724 6.27639 11.4336 6.42042 11.4667C6.56446 11.4997 6.7136 11.5041 6.85932 11.4795C7.00505 11.455 7.14451 11.4019 7.26973 11.3234L9.42148 9.97344C9.63737 9.83816 9.81525 9.65011 9.93833 9.42704C10.0614 9.20397 10.1256 8.95322 10.125 8.69844V5.82895C10.125 5.53058 10.0065 5.24443 9.79548 5.03345C9.5845 4.82248 9.29835 4.70395 8.99998 4.70395C8.70161 4.70395 8.41546 4.82248 8.20448 5.03345C7.99351 5.24443 7.87498 5.53058 7.87498 5.82895V8.29119Z"
                                    fill="#637381"
                                />
                            </g>
                            <defs>
                                <clipPath>
                                    <rect width={18} height={18} fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    ) : (
                        <button onClick={removeTime} className="p-0 -mt-1 transition-all ease-in-out hover:opacity-75">
                            <RemoveIcon />
                        </button>
                    )}
                </div>
            </div>

            <MessageError message={renderMessage()} />
        </div>
    );
}

export default TimePicker;