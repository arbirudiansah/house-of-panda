/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { FC, useEffect, useState } from "react";
import NavLink from "./NavLink";
import useComponentVisible from "../UseVisible";
import HopLogo from "../icons/HopLogo";
import { useWeb3React } from "@web3-react/core";
import classNames from "classnames";
import AuthButton from "../widgets/AuthButton";
import { useAppSelector } from "@/lib/store/hooks";
import FaucetButton from "../widgets/FaucetButton";
import PendingTransaction from "../widgets/PendingTransaction";

interface Props {

}

export const menus = [
    {
        label: "Explore",
        href: "/project/explore",
        auth: false,
        gradient: false,
    },
    {
        label: "About Us",
        href: "/about-us",
        auth: false,
        gradient: false,
    },
    {
        label: "How it Works",
        href: "/how-it-works",
        auth: false,
        gradient: false,
    },
    {
        label: "Collections",
        href: "/collections",
        auth: true,
        gradient: true,
    },
];

const MainNavbar: FC<Props> = ({ }) => {
    const { active, chainId } = useWeb3React()
    const vis = useComponentVisible(false)
    const [isScroll, setScroll] = useState(false)
    const { isLoggedIn } = useAppSelector(state => state.userAuth)

    const auth = active && isLoggedIn

    useEffect(() => {
        const handleScroll = (_: any) => {
            setScroll(window.scrollY > 40)
        }

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    })

    return (
        <div className={classNames("navbar sticky top-0 bg-white w-full z-40", { ["shadow-md"]: isScroll })}>
            <div className="max-w-full mx-auto px-3 lg:px-16">
                <div
                    className="flex justify-between items-center py-3 md:py-5 lg:py-6 lg:justify-start lg:space-x-10"
                >
                    <div ref={vis.ref} className="flex justify-start items-center lg:w-0 lg:flex-1">
                        <div className=" -my-2 pr-1 lg:hidden">
                            <button
                                type="button"
                                className={`inline-flex -ml-2 p-2 md:mr-2 items-center justify-center text-gray-500 transition-all ease-in-out hover:text-gray-300 focus:outline-none`}
                                aria-expanded="false"
                                onClick={() => vis.setIsComponentVisible(!vis.isComponentVisible)}
                            >
                                <span className="sr-only">Open menu</span>
                                <svg
                                    className="h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            </button>
                            {vis.isComponentVisible && (
                                <div className="absolute left-0 top-full px-4 w-full lg:block lg:w-auto z-50" id="mobile-nav">
                                    <div className="bg-gray-50 mt-2 rounded-lg lg:bg-white shadow-lg">
                                        <nav className="flex flex-col py-4 lg:flex-row lg:space-x-8 lg:mt-0 lg:text-sm lg:font-medium lg:border-0">
                                            {menus.map((menu, index) => {
                                                if (!menu.auth || menu.auth === active) {
                                                    const wrapperClasses = classNames(
                                                        "text-sm py-3 px-6 font-medium transition-all ease-in-out hover:cursor-pointer uppercase",
                                                        {
                                                            ["text-transparent bg-clip-text bg-gradient-to-r from-[#40C9FF] to-[#E81CFF]"]: menu.gradient,
                                                        }
                                                    );

                                                    return (
                                                        <NavLink href={menu.href} key={index}>
                                                            <a className={wrapperClasses}>
                                                                {menu.label}
                                                            </a>
                                                        </NavLink>
                                                    )
                                                }
                                            })}
                                        </nav>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link href="/">
                            <a><HopLogo /></a>
                        </Link>
                    </div>

                    <nav className={`hidden lg:flex items-center space-x-10`}>
                        {menus.map((menu, index) => {
                            if (!menu.auth || menu.auth === auth) {
                                const wrapperClasses = classNames(
                                    "text-base font-medium transition-all ease-in-out hover:text-primary transition-all ease-in-out hover:cursor-pointer",
                                    {
                                        ["text-transparent bg-clip-text bg-gradient-to-r from-[#40C9FF] to-[#E81CFF]"]: menu.gradient,
                                    }
                                );

                                return (
                                    <NavLink href={menu.href} key={index}>
                                        <a className={wrapperClasses}>
                                            {menu.label}
                                        </a>
                                    </NavLink>
                                )
                            }
                        })}
                    </nav>

                    {auth && (
                        <div className="flex gap-4">
                            <PendingTransaction />
                            {chainId !== 1 && <FaucetButton />}
                        </div>
                    )}

                    <AuthButton />
                </div>
            </div>
        </div>
    );
};

export default MainNavbar;

