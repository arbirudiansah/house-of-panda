import * as React from "react";
import { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {

}

const StepMinusIcon = (props: Props) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M16.5 13.5H7.5C7.10218 13.5 6.72064 13.342 6.43934 13.0607C6.15804 12.7794 6 12.3978 6 12C6 11.6022 6.15804 11.2206 6.43934 10.9393C6.72064 10.658 7.10218 10.5 7.5 10.5H16.5C16.8978 10.5 17.2794 10.658 17.5607 10.9393C17.842 11.2206 18 11.6022 18 12C18 12.3978 17.842 12.7794 17.5607 13.0607C17.2794 13.342 16.8978 13.5 16.5 13.5Z"
      fill="currentColor"
    />
  </svg>
);

export default StepMinusIcon;
