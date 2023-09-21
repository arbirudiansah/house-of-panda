import * as React from "react"
import { SVGProps } from "react"

const FailedIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1000 1000"
    xmlSpace="preserve"
    width="1.4em"
    height="1.4em"
    {...props}
  >
    <path d="M500 10C229.4 10 10 229.4 10 500s219.4 490 490 490 490-219.4 490-490S770.6 10 500 10zm-40.9 279.7h81.6v245h-81.6v-245zM500 710.3c-29.3 0-53.1-23.8-53.1-53.1s23.8-53.1 53.1-53.1 53.1 23.8 53.1 53.1c0 29.4-23.8 53.1-53.1 53.1z" />
  </svg>
)

export default FailedIcon
