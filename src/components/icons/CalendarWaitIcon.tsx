import * as React from "react";
import { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {

}

const CalendarIcon = (props: Props) => (
  <svg
    width={28}
    height={28}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_170_175)">
      <path
        d="M28 8.16667V9.33333H0V8.16667C0 4.9455 2.61217 2.33333 5.83333 2.33333H7V1.16667C7 0.522667 7.52267 0 8.16667 0C8.81067 0 9.33333 0.522667 9.33333 1.16667V2.33333H18.6667V1.16667C18.6667 0.522667 19.1893 0 19.8333 0C20.4773 0 21 0.522667 21 1.16667V2.33333H22.1667C25.3878 2.33333 28 4.9455 28 8.16667ZM28 19.8333C28 24.3367 24.3355 28 19.8333 28C15.3312 28 11.6667 24.3367 11.6667 19.8333C11.6667 15.33 15.3312 11.6667 19.8333 11.6667C24.3355 11.6667 28 15.33 28 19.8333ZM22.1667 20.517L21 19.3503V17.5C21 16.856 20.4773 16.3333 19.8333 16.3333C19.1893 16.3333 18.6667 16.856 18.6667 17.5V19.8333C18.6667 20.1425 18.7892 20.44 19.0085 20.6582L20.517 22.1667C20.972 22.6217 21.7117 22.6217 22.1667 22.1667C22.6217 21.7117 22.6217 20.972 22.1667 20.517ZM9.33333 19.8333C9.33333 16.5328 10.8593 13.5917 13.2405 11.6667H0V22.1667C0 25.3878 2.61217 28 5.83333 28H13.2405C10.8593 26.075 9.33333 23.1338 9.33333 19.8333Z"
        fill="#FF3392"
      />
    </g>
    <defs>
      <clipPath>
        <rect width={28} height={28} fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default CalendarIcon;