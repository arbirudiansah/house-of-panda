import * as React from "react";
import { SVGProps } from "react";

const EthIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        width="1.4em"
        height="1.4em"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <g clipPath="url(#clip0_961_21372)">
            <g>
                <path
                    d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z"
                    fill="#627EEA"
                />
                <g>
                    <path
                        d="M10.5862 2.5V8.04375L15.2718 10.1375L10.5862 2.5Z"
                        fill="white"
                        fillOpacity={0.602}
                    />
                    <path
                        d="M9.58615 2.5L4.8999 10.1375L9.58615 8.04375V2.5Z"
                        fill="white"
                    />
                    <path
                        d="M10.5862 13.73V17.4969L15.2749 11.01L10.5862 13.73Z"
                        fill="white"
                        fillOpacity={0.602}
                    />
                    <path
                        d="M9.58615 17.4969V13.7294L4.8999 11.01L9.58615 17.4969Z"
                        fill="white"
                    />
                    <path
                        d="M10.5862 12.8581L15.2718 10.1375L10.5862 8.04501V12.8581Z"
                        fill="white"
                        fillOpacity={0.2}
                    />
                    <path
                        d="M4.8999 10.1375L9.58615 12.8581V8.04501L4.8999 10.1375Z"
                        fill="white"
                        fillOpacity={0.602}
                    />
                </g>
            </g>
        </g>
        <defs>
            <clipPath>
                <rect width={20} height={20} fill="white" />
            </clipPath>
        </defs>
    </svg>
);

export default EthIcon;
