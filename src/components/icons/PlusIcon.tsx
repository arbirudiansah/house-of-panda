import * as React from "react";
import { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {

}

const PlusIcon = (props: Props) => (
    <svg
        width={18}
        height={18}
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <g clipPath="url(#clip0_391_720)">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.99998 2.40001C5.3549 2.40001 2.39998 5.35493 2.39998 9.00001C2.39998 12.6451 5.3549 15.6 8.99998 15.6C12.6451 15.6 15.6 12.6451 15.6 9.00001C15.6 5.35493 12.6451 2.40001 8.99998 2.40001ZM0.599976 9.00001C0.599976 4.36081 4.36078 0.600006 8.99998 0.600006C13.6392 0.600006 17.4 4.36081 17.4 9.00001C17.4 13.6392 13.6392 17.4 8.99998 17.4C4.36078 17.4 0.599976 13.6392 0.599976 9.00001Z"
                fill="white"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.99998 5.10001C9.49703 5.10001 9.89998 5.50295 9.89998 6.00001V12C9.89998 12.4971 9.49703 12.9 8.99998 12.9C8.50292 12.9 8.09998 12.4971 8.09998 12V6.00001C8.09998 5.50295 8.50292 5.10001 8.99998 5.10001Z"
                fill="white"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.09998 9.00001C5.09998 8.50295 5.50292 8.10001 5.99998 8.10001H12C12.497 8.10001 12.9 8.50295 12.9 9.00001C12.9 9.49706 12.497 9.90001 12 9.90001H5.99998C5.50292 9.90001 5.09998 9.49706 5.09998 9.00001Z"
                fill="white"
            />
        </g>
        <defs>
            <clipPath>
                <rect width={18} height={18} fill="white" />
            </clipPath>
        </defs>
    </svg>
);

export default PlusIcon;
