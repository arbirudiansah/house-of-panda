import classNames from "classnames";
import { FC } from "react";

interface Props {
    title: string;
    prefix?: JSX.Element;
    suffix?: JSX.Element;
    className?: string;
    onClick?: (event: any) => void;
    isLoading?: boolean;
    disabled?: boolean;
}

const OutlinedButton: FC<Props> = ({ title, onClick, prefix, suffix, className, isLoading, disabled }) => {
    const classes = classNames(
        "text-gray-600 transition-all ease-in-out hover:text-white transition-all ease-in-out border transition-all ease-in-out hover:border-primary px-8 py-3 rounded-lg font-medium transition-all ease-in-out hover:bg-primary text-base",
        "flex items-center gap-3",
        className,
    )

    return (
        <button
            className={classes}
            onClick={(event) => onClick && onClick(event)}
            disabled={isLoading || disabled}
        >
            {isLoading ? (
                <div className="inline-flex items-center">
                    <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke={"white"} strokeWidth="4"></circle>
                        <path className="opacity-75" fill={'white'}
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                    Loading...
                </div>
            ) : (
                <>
                    {prefix && <div>{prefix}</div>}
                    <div>{title}</div>
                    {suffix && <div>{suffix}</div>}
                </>
            )}

        </button>
    );
};

export default OutlinedButton;


