import * as React from "react";
import { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {

}

const DotsIcon = (props: Props) => (
    <svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <g>
            <path
                d="M21.5 14.5C22.8807 14.5 24 13.3807 24 12C24 10.6193 22.8807 9.50003 21.5 9.50003C20.1193 9.50003 19.0001 10.6193 19.0001 12C19.0001 13.3807 20.1193 14.5 21.5 14.5Z"
                fill="currentColor"
            />
            <path
                d="M12 14.5C13.3807 14.5 14.5 13.3807 14.5 12C14.5 10.6193 13.3807 9.50003 12 9.50003C10.6193 9.50003 9.5 10.6193 9.5 12C9.5 13.3807 10.6193 14.5 12 14.5Z"
                fill="currentColor"
            />
            <path
                d="M2.49998 14.5C3.88069 14.5 4.99997 13.3807 4.99997 12C4.99997 10.6193 3.88069 9.50003 2.49998 9.50003C1.11928 9.50003 0 10.6193 0 12C0 13.3807 1.11928 14.5 2.49998 14.5Z"
                fill="currentColor"
            />
        </g>
    </svg>
);

export default DotsIcon;
