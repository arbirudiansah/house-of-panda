import * as React from "react";
import { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {

}

const ArrowUpIcon = (props: Props) => (
    <svg
        width={20}
        height={20}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <g>
            <g>
                <path
                    d="M16.5999 12.5417L11.1666 7.10833C10.5249 6.46666 9.4749 6.46666 8.83324 7.10833L3.3999 12.5417"
                    stroke="#272E38"
                    strokeWidth={2.5}
                    strokeMiterlimit={10}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
        </g>
    </svg>
);

export default ArrowUpIcon;
