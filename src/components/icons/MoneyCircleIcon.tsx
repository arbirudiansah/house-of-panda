import * as React from "react";
import { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {

}

const MoneyCircleIcon = (props: Props) => (
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
            <g clipPath="url(#clip0_567_20570)">
                <path
                    d="M34 19.0002H20C18.6744 19.0018 17.4036 19.5291 16.4662 20.4665C15.5289 21.4038 15.0016 22.6746 15 24.0002V30.0002C15.0016 31.3258 15.5289 32.5967 16.4662 33.534C17.4036 34.4714 18.6744 34.9987 20 35.0002H34C35.3256 34.9987 36.5964 34.4714 37.5338 33.534C38.4711 32.5967 38.9984 31.3258 39 30.0002V24.0002C38.9984 22.6746 38.4711 21.4038 37.5338 20.4665C36.5964 19.5291 35.3256 19.0018 34 19.0002V19.0002ZM19 32.0002C18.8022 32.0002 18.6089 31.9416 18.4444 31.8317C18.28 31.7218 18.1518 31.5657 18.0761 31.3829C18.0004 31.2002 17.9806 30.9991 18.0192 30.8052C18.0578 30.6112 18.153 30.433 18.2929 30.2931C18.4327 30.1533 18.6109 30.058 18.8049 30.0195C18.9989 29.9809 19.2 30.0007 19.3827 30.0764C19.5654 30.1521 19.7216 30.2802 19.8315 30.4447C19.9414 30.6091 20 30.8025 20 31.0002C20 31.2655 19.8946 31.5198 19.7071 31.7074C19.5196 31.8949 19.2652 32.0002 19 32.0002ZM19 24.0002C18.8022 24.0002 18.6089 23.9416 18.4444 23.8317C18.28 23.7218 18.1518 23.5657 18.0761 23.3829C18.0004 23.2002 17.9806 22.9991 18.0192 22.8052C18.0578 22.6112 18.153 22.433 18.2929 22.2931C18.4327 22.1533 18.6109 22.058 18.8049 22.0195C18.9989 21.9809 19.2 22.0007 19.3827 22.0764C19.5654 22.1521 19.7216 22.2802 19.8315 22.4447C19.9414 22.6091 20 22.8025 20 23.0002C20 23.2655 19.8946 23.5198 19.7071 23.7074C19.5196 23.8949 19.2652 24.0002 19 24.0002ZM27 31.0002C26.2089 31.0002 25.4355 30.7656 24.7777 30.3261C24.1199 29.8866 23.6072 29.2619 23.3045 28.531C23.0017 27.8001 22.9225 26.9958 23.0769 26.2199C23.2312 25.444 23.6122 24.7312 24.1716 24.1718C24.731 23.6124 25.4437 23.2314 26.2196 23.0771C26.9956 22.9228 27.7998 23.002 28.5307 23.3047C29.2616 23.6075 29.8864 24.1202 30.3259 24.778C30.7654 25.4358 31 26.2091 31 27.0002C31 28.0611 30.5786 29.0785 29.8284 29.8287C29.0783 30.5788 28.0609 31.0002 27 31.0002ZM35 32.0002C34.8022 32.0002 34.6089 31.9416 34.4444 31.8317C34.28 31.7218 34.1518 31.5657 34.0761 31.3829C34.0004 31.2002 33.9806 30.9991 34.0192 30.8052C34.0578 30.6112 34.153 30.433 34.2929 30.2931C34.4327 30.1533 34.6109 30.058 34.8049 30.0195C34.9989 29.9809 35.2 30.0007 35.3827 30.0764C35.5654 30.1521 35.7216 30.2802 35.8315 30.4447C35.9414 30.6091 36 30.8025 36 31.0002C36 31.2655 35.8946 31.5198 35.7071 31.7074C35.5196 31.8949 35.2652 32.0002 35 32.0002ZM35 24.0002C34.8022 24.0002 34.6089 23.9416 34.4444 23.8317C34.28 23.7218 34.1518 23.5657 34.0761 23.3829C34.0004 23.2002 33.9806 22.9991 34.0192 22.8052C34.0578 22.6112 34.153 22.433 34.2929 22.2931C34.4327 22.1533 34.6109 22.058 34.8049 22.0195C34.9989 21.9809 35.2 22.0007 35.3827 22.0764C35.5654 22.1521 35.7216 22.2802 35.8315 22.4447C35.9414 22.6091 36 22.8025 36 23.0002C36 23.2655 35.8946 23.5198 35.7071 23.7074C35.5196 23.8949 35.2652 24.0002 35 24.0002ZM29 27.0002C29 27.3958 28.8827 27.7825 28.6629 28.1114C28.4432 28.4403 28.1308 28.6966 27.7654 28.848C27.3999 28.9994 26.9978 29.039 26.6098 28.9618C26.2219 28.8846 25.8655 28.6942 25.5858 28.4145C25.3061 28.1348 25.1156 27.7784 25.0384 27.3904C24.9613 27.0025 25.0009 26.6003 25.1522 26.2349C25.3036 25.8694 25.56 25.5571 25.8889 25.3373C26.2178 25.1175 26.6044 25.0002 27 25.0002C27.5304 25.0002 28.0391 25.211 28.4142 25.586C28.7893 25.9611 29 26.4698 29 27.0002Z"
                    fill="white"
                />
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

export default MoneyCircleIcon;