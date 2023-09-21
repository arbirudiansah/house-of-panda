import * as React from "react";
import { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {

}

const DirectInboxIcon = (props: Props) => (
    <svg
        width={22}
        height={23}
        viewBox="0 0 22 23"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <g>
            <g>
                <path
                    d="M11 2.33334V8.75L12.8333 6.91667"
                    stroke="white"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M10.9998 8.75L9.1665 6.91666"
                    stroke="white"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M1.81494 12.4167H5.85744C6.20577 12.4167 6.51744 12.6092 6.67327 12.9208L7.74577 15.0658C8.05744 15.6892 8.68994 16.0833 9.38661 16.0833H12.6224C13.3191 16.0833 13.9516 15.6892 14.2633 15.0658L15.3358 12.9208C15.4916 12.6092 15.8124 12.4167 16.1516 12.4167H20.1483"
                    stroke="white"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M6.41683 4.28584C3.17183 4.7625 1.8335 6.66917 1.8335 10.5833V14.25C1.8335 18.8333 3.66683 20.6667 8.25016 20.6667H13.7502C18.3335 20.6667 20.1668 18.8333 20.1668 14.25V10.5833C20.1668 6.66917 18.8285 4.7625 15.5835 4.28584"
                    stroke="white"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
        </g>
    </svg>
);

export default DirectInboxIcon;
