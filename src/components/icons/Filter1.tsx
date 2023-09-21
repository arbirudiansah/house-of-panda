import { SVGProps } from "react";

const Filter1 = (props: SVGProps<SVGSVGElement>) => (
    <svg
        width={18}
        height={18}
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <g clipPath="url(#clip0_1503_1307)">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1.01056 2.61396C1.13161 2.3672 1.3931 2.20932 1.68073 2.20932H16.4566C16.7442 2.20932 17.0057 2.3672 17.1267 2.61396C17.2478 2.86073 17.2064 3.1515 17.0207 3.35922L11.285 9.77374V15.485C11.285 15.7271 11.1525 15.952 10.9346 16.0793C10.7168 16.2066 10.4449 16.2182 10.2158 16.1099L7.26067 14.7125C7.01038 14.5941 6.85227 14.3522 6.85227 14.0875V9.77374L1.11661 3.35922C0.930877 3.1515 0.889498 2.86073 1.01056 2.61396ZM3.27305 3.60676L8.15519 9.06673C8.26797 9.19287 8.32986 9.35272 8.32986 9.51791V13.6557L9.80744 14.3544V9.51791C9.80744 9.35272 9.86933 9.19287 9.98212 9.06673L14.8643 3.60676H3.27305Z"
                fill="currentColor"
            />
        </g>
        <defs>
            <clipPath>
                <rect
                    width={17.731}
                    height={16.7692}
                    fill="white"
                    transform="translate(0.203156 0.81189)"
                />
            </clipPath>
        </defs>
    </svg>
);

export default Filter1;
