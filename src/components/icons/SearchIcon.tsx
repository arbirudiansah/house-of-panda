import * as React from "react";
import { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {

}

const SearchIcon = (props: Props) => (
    <svg
        width={20}
        height={20}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.16667 3.33332C5.94501 3.33332 3.33333 5.945 3.33333 9.16666C3.33333 12.3883 5.94501 15 9.16667 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16667 3.33332ZM1.66667 9.16666C1.66667 5.02452 5.02453 1.66666 9.16667 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16667 16.6667C5.02453 16.6667 1.66667 13.3088 1.66667 9.16666Z"
            fill="currentColor"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4643 13.2857L18.0893 16.9107C18.4147 17.2362 18.4147 17.7638 18.0893 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
            fill="currentColor"
        />
    </svg>
);

export default SearchIcon;
