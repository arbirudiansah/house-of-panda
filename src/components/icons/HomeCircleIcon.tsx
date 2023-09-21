import * as React from "react";
import { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {

}

const HomeCircleIcon = (props: Props) => (
    <svg
        width={54}
        height={54}
        viewBox="0 0 54 54"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <g>
            <circle cx={27} cy={27} r={27} fill="#FF3392" />
            <g clipPath="url(#clip0_567_20569)">
                <g>
                    <path
                        d="M27 29.9917C25.3432 29.9917 24 31.3349 24 32.9917V38.9917H30V32.9917C30 31.3349 28.6568 29.9917 27 29.9917Z"
                        fill="white"
                    />
                    <g>
                        <path
                            d="M32 32.9921V38.9921H36C37.6568 38.9921 39 37.649 39 35.9921V26.8712C39.0002 26.3516 38.7983 25.8524 38.437 25.4792L29.939 16.2921C28.4396 14.6698 25.9089 14.5702 24.2865 16.0696C24.2095 16.1409 24.1352 16.2151 24.064 16.2921L15.581 25.4762C15.2087 25.851 14.9999 26.3579 15 26.8862V35.9921C15 37.649 16.3432 38.9921 18 38.9921H22V32.9921C22.0187 30.2653 24.2203 28.0386 26.8784 27.9745C29.6255 27.9082 31.9791 30.1728 32 32.9921Z"
                            fill="white"
                        />
                        <path
                            d="M27 29.9917C25.3432 29.9917 24 31.3349 24 32.9917V38.9917H30V32.9917C30 31.3349 28.6568 29.9917 27 29.9917Z"
                            fill="white"
                        />
                    </g>
                </g>
            </g>
        </g>
        <defs>
            <clipPath>
                <rect
                    width={24}
                    height={24}
                    fill="white"
                    transform="translate(15 15)"
                />
            </clipPath>
        </defs>
    </svg>
);

export default HomeCircleIcon;
