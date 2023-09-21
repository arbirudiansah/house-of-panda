/* eslint-disable @next/next/no-img-element */
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState, useCallback } from "react";
import { ReactNode } from "react";
import { DashboardIcon, PropertyIcon, SettingIcon, TransactionIcon, UserIcon } from "../icons";
import HopLogo from "../icons/HopLogo";
import * as profile from "@/lib/store/slices/profile";
import generateAvatar from "@/lib/utils/avatar";
import useComponentVisible from "../UseVisible";
import "@/lib/utils/extensions"
import FadeTransition from "../animations/FadeTransition";
import { AnimatePresence, motion } from "framer-motion";
import { formProjectActions } from "@/lib/store/slices/formProject";
import { trpc } from "@/lib/utils/trpc";
import { NextComponentType } from "next";
import WhitelistIcon from "../icons/WhitelistIcon";

const dropIn = {
    hidden: {
        y: "-30px",
        opacity: 0,
    },
    visible: {
        y: "0",
        opacity: 1,
        transition: {
            duration: 0.9,
            type: "spring",
            damping: 25,
            stiffness: 500,
        },
    },
    exit: {
        y: "-30px",
        opacity: 0,
    },
}

interface Props {
    children: ReactNode;
    breadcrumbs?: {
        title: string;
        link?: string;
    }[]
}

const menus = [
    {
        icon: DashboardIcon,
        title: "Dashboard",
        link: "/dashboard"
    },
    {
        icon: PropertyIcon,
        title: "My Properties",
        link: "/dashboard/properties"
    },
    {
        icon: WhitelistIcon,
        title: "Whitelist",
        link: "/dashboard/whitelist"
    },
    {
        icon: TransactionIcon,
        title: "Transactions",
        link: "/dashboard/transactions"
    },
]

const profileMenus = [
    {
        icon: PropertyIcon,
        title: "My Properties",
        link: "/dashboard/properties"
    },
    {
        icon: TransactionIcon,
        title: "Transactions",
        link: "/dashboard/transactions"
    },
    {
        icon: UserIcon,
        title: "Profile",
        link: "/dashboard/profile"
    },
    // {
    //     icon: SettingIcon,
    //     title: "Settings",
    //     link: "/dashboard/settings"
    // },
]

const DashboardLayout = ({ children, breadcrumbs = [] }: Props) => {
    const { asPath, pathname, push, events } = useRouter()
    const { user } = useAppSelector((state) => state.profile);
    const dispatch = useAppDispatch()
    const vis = useComponentVisible(false)

    const [mounted, setMounted] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(typeof window !== 'undefined' ? JSON.parse(window.localStorage.getItem('sidebarOpen') ?? 'true') : true)

    const isActive = (path: string): boolean => {
        return asPath === path || pathname === path || (pathname.startsWith(path) && path !== '/dashboard')
    }

    const logout = () => {
        dispatch(profile.logout({}))
            .unwrap()
            .then(() => push('/auth/login'))
    }

    const clearFormState = useCallback((url: any) => {
        dispatch(formProjectActions.clearData())
    }, [dispatch])

    useEffect(() => {
        dispatch(profile.loadProfile({})).unwrap()
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('sidebarOpen', sidebarOpen.toString())
        }

        events.on('routeChangeStart', clearFormState)

        return () => {
            events.off('routeChangeStart', clearFormState)
        }
    }, [clearFormState, dispatch, events, sidebarOpen])

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <div className="grid grid-cols-12 w-full" >
            <aside className={classNames(
                "bg-sidebar text-white h-screen top-0 left-0 transition-all ease-in-out",
                {
                    ["col-span-2 sticky"]: sidebarOpen,
                    ["col-span-0 fixed w-[80px]"]: !sidebarOpen,
                }
            )}>
                <div className={classNames(
                    "py-10 px-4 transition-all ease-in-out",
                    {
                        ["md:px-8"]: sidebarOpen,
                        ["md:px-5"]: !sidebarOpen,
                    }
                )}>
                    <HopLogo white className="mx-auto md:mx-0 transition-all ease-in-out hover:cursor-pointer hover:opacity-70" onClick={() => push('/dashboard')} />
                </div>
                <ul className="px-4">
                    {menus.map((item, i) => {
                        const classes = classNames(
                            "mb-2 inline-flex justify-center md:justify-start items-center md:space-x-2 text-base font-medium transition-all ease-in-out",
                            "hover:text-opacity-100 text-white text-opacity-50 w-full px-4 py-3 rounded-md transition-all",
                            "ease-in-out hover:bg-white transition-all ease-in-out hover:bg-opacity-10",
                            { ["text-opacity-100 bg-white bg-opacity-10"]: isActive(item.link) }
                        )

                        return (
                            <li key={i}>
                                <Link href={item.link}>
                                    <a className={classes}>
                                        <div>{React.createElement(item.icon, { className: '' })}</div>
                                        <div className={classNames(
                                            "hidden md:block transition-all ease-in-out",
                                            {
                                                ["md:block"]: sidebarOpen,
                                                ["md:hidden"]: !sidebarOpen,
                                            }
                                        )}>{item.title}</div>
                                    </a>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </aside>
            <section className={classNames(
                "bg-dashboard",
                {
                    ["col-span-10"]: sidebarOpen,
                    ["col-span-12 ml-[80px] min-h-screen"]: !sidebarOpen,
                }
            )}>
                <div className="bg-white px-10 py-4 flex justify-between shadow sticky top-0 z-10">
                    <div>
                        <button
                            type="button"
                            className={`px-3 py-3 -ml-4 items-center justify-center text-gray-500 transition-all ease-in-out hover:text-gray-300 focus:outline-none`}
                            aria-expanded="false"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
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
                    </div>
                    <div>
                        {user && (
                            <div ref={vis.ref} className="relative">
                                <div onClick={vis.toggle} className="inline-flex transition-all ease-in-out hover:cursor-pointer space-x-4 items-center justify-end w-48 h-12">
                                    <div className="inline-flex select-none flex-col space-y-0.5 items-end justify-end w-24 h-9">
                                        <p className="text-base font-medium leading-tight text-right text-gray-800">{user.fullName}</p>
                                        <p className="text-xs leading-none text-right text-gray-500">Administrator</p>
                                    </div>
                                    <div className="flex space-x-2.5 items-center justify-end w-20 h-full z-10">
                                        <img className="w-12 h-full rounded-full" src={generateAvatar(user.id)} alt="avatar" />
                                        <svg
                                            width={20}
                                            height={20}
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M4.41076 6.91073C4.7362 6.5853 5.26384 6.5853 5.58928 6.91073L10 11.3215L14.4108 6.91073C14.7362 6.5853 15.2638 6.5853 15.5893 6.91073C15.9147 7.23617 15.9147 7.76381 15.5893 8.08924L10.5893 13.0892C10.2638 13.4147 9.7362 13.4147 9.41077 13.0892L4.41076 8.08924C4.08533 7.76381 4.08533 7.23617 4.41076 6.91073Z"
                                                fill="#637381"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <AnimatePresence initial>
                                    {vis.isComponentVisible && (
                                        <motion.div
                                            className="absolute top-full right-0 mt-9 -z-10"
                                            key="admin-menu"
                                            variants={dropIn}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                        >
                                            <div className="bg-white rounded-xl shadow-menu w-[256px] px-3 py-3 relative">
                                                <div className="absolute bottom-full right-9 z-10">
                                                    <svg width="32" height="13" viewBox="0 0 32 13" fill="none" xmlns="http://www.w3.org/2000/svg" style={{
                                                        filter: 'drop-shadow(0px -5px 4px rgb(0 0 0 / 0.1))'
                                                    }}>
                                                        <path d="M10.3432 2.65685L0 13H32L21.6569 2.65686C18.5327 -0.467339 13.4673 -0.467344 10.3432 2.65685Z" fill="#FFFFFF" />
                                                    </svg>
                                                </div>
                                                <ul className="flex flex-col">
                                                    {profileMenus.map((menu, i) => {
                                                        return (
                                                            <li key={i} className="border-b py-1 border-gray-100">
                                                                <Link href={menu.link}>
                                                                    <a className="py-1.5 px-2 hover:bg-gray-100 transition-all ease-in-out hover:rounded-md text-base font-medium hover:text-primary text-secondary inline-flex items-center w-full space-x-2">
                                                                        <span className="w-6">{React.createElement(menu.icon, {})}</span>
                                                                        <span>{menu.title}</span>
                                                                    </a>
                                                                </Link>
                                                            </li>
                                                        )
                                                    })}
                                                    <li className="py-1">
                                                        <button onClick={logout} className="inline-flex py-1.5 hover:rounded-md px-2 items-center space-x-2 w-full hover:bg-gray-100 transition-all ease-in-out text-base font-medium hover:text-primary text-secondary">
                                                            <span className="w-6">
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 -ml-[3px]">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                                                </svg>
                                                            </span>
                                                            <span>Logout</span>
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
                <main className="p-10">
                    {breadcrumbs.length > 0 && (
                        <div className="border-b pb-3 mb-6">
                            <nav className="flex" aria-label="Breadcrumb">
                                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                                    <li className="inline-flex items-center">
                                        <Link href="/dashboard">
                                            <a className="inline-flex items-center text-sm font-medium text-[#637381] hover:text-primary">
                                                <svg
                                                    width={15}
                                                    height={16}
                                                    viewBox="0 0 15 16"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <g>
                                                        <path
                                                            d="M13.3503 15.1503H10.2162C9.51976 15.1503 8.93937 14.5697 8.93937 13.8729V11.3182C8.93937 11.0627 8.73043 10.8537 8.47505 10.8537H6.54816C6.29279 10.8537 6.08385 11.0627 6.08385 11.3182V13.8497C6.08385 14.5464 5.50346 15.127 4.80699 15.127H1.62646C0.929989 15.127 0.349599 14.5464 0.349599 13.8497V5.74431C0.349599 5.39594 0.535324 5.0708 0.837127 4.885L6.96604 1.0065C7.29106 0.797479 7.73216 0.797479 8.05717 1.0065L14.1861 4.885C14.4879 5.0708 14.6504 5.39594 14.6504 5.74431V13.8265C14.6504 14.5697 14.07 15.1503 13.3503 15.1503ZM6.52495 10.0409H8.45184C9.14831 10.0409 9.7287 10.6215 9.7287 11.3182V13.8497C9.7287 14.1052 9.93764 14.3142 10.193 14.3142H13.3503C13.6057 14.3142 13.8146 14.1052 13.8146 13.8497V5.76754C13.8146 5.69786 13.7682 5.62819 13.7218 5.58174L7.61608 1.70324C7.54643 1.65679 7.45357 1.65679 7.40714 1.70324L1.27822 5.58174C1.20858 5.62819 1.18536 5.69786 1.18536 5.76754V13.8729C1.18536 14.1284 1.3943 14.3374 1.64967 14.3374H4.80699C5.06236 14.3374 5.2713 14.1284 5.2713 13.8729V11.3182C5.24809 10.6215 5.82848 10.0409 6.52495 10.0409Z"
                                                            fill="currentColor"
                                                        />
                                                        <path
                                                            fillRule="evenodd"
                                                            clipRule="evenodd"
                                                            d="M7.51145 2.05106L13.465 5.83294V13.8497C13.465 13.912 13.4126 13.9644 13.3503 13.9644H10.193C10.1307 13.9644 10.0783 13.912 10.0783 13.8497V11.3182C10.0783 10.4283 9.34138 9.69112 8.45184 9.69112H6.52495C5.63986 9.69112 4.89529 10.4252 4.9217 11.3237V13.8729C4.9217 13.9352 4.86929 13.9877 4.80699 13.9877H1.64967C1.58738 13.9877 1.53496 13.9352 1.53496 13.8729V5.83311L7.51145 2.05106ZM1.27822 5.58174L7.40714 1.70324C7.45357 1.65679 7.54643 1.65679 7.61608 1.70324L13.7218 5.58174C13.7682 5.62819 13.8146 5.69786 13.8146 5.76754V13.8497C13.8146 14.1052 13.6057 14.3142 13.3503 14.3142H10.193C9.93764 14.3142 9.7287 14.1052 9.7287 13.8497V11.3182C9.7287 10.6215 9.14831 10.0409 8.45184 10.0409H6.52495C5.82848 10.0409 5.24809 10.6215 5.2713 11.3182V13.8729C5.2713 14.1284 5.06236 14.3374 4.80699 14.3374H1.64967C1.3943 14.3374 1.18536 14.1284 1.18536 13.8729V5.76754C1.18536 5.69786 1.20858 5.62819 1.27822 5.58174ZM13.3503 15.5H10.2162C9.32668 15.5 8.58977 14.7628 8.58977 13.8729V11.3182C8.58977 11.2559 8.53735 11.2035 8.47505 11.2035H6.54816C6.48587 11.2035 6.43345 11.2559 6.43345 11.3182V13.8497C6.43345 14.7396 5.69654 15.4768 4.80699 15.4768H1.62646C0.736911 15.4768 0 14.7396 0 13.8497V5.74431C0 5.27131 0.251303 4.83591 0.651944 4.58836L6.77814 0.711575C7.21781 0.429475 7.80541 0.429475 8.24508 0.711576C8.24546 0.711821 8.24584 0.712066 8.24622 0.712311L14.3713 4.58838C14.7853 4.84424 15 5.28759 15 5.74431V13.8265C15 14.7587 14.2671 15.5 13.3503 15.5ZM14.1861 4.885L8.05717 1.0065C7.73216 0.797479 7.29106 0.797479 6.96604 1.0065L0.837127 4.885C0.535324 5.0708 0.349599 5.39594 0.349599 5.74431V13.8497C0.349599 14.5464 0.929989 15.127 1.62646 15.127H4.80699C5.50346 15.127 6.08385 14.5464 6.08385 13.8497V11.3182C6.08385 11.0627 6.29279 10.8537 6.54816 10.8537H8.47505C8.73043 10.8537 8.93937 11.0627 8.93937 11.3182V13.8729C8.93937 14.5697 9.51976 15.1503 10.2162 15.1503H13.3503C14.07 15.1503 14.6504 14.5697 14.6504 13.8265V5.74431C14.6504 5.39594 14.4879 5.0708 14.1861 4.885Z"
                                                            fill="currentColor"
                                                        />
                                                    </g>
                                                </svg>
                                            </a>
                                        </Link>
                                    </li>
                                    {breadcrumbs.map((item, i) => {
                                        return (
                                            <li key={i} className="text-base font-medium leading-normal text-gray-500 last:text-black">
                                                <div className="flex items-center">
                                                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                                                    {item.link ? (
                                                        <Link href={`/dashboard${item.link}`}><a className="ml-1 hover:text-primary">{item.title}</a></Link>
                                                    ) : <span className="ml-1">{item.title}</span>}
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ol>
                            </nav>
                        </div>
                    )}
                    <FadeTransition key={pathname}>
                        {children}
                    </FadeTransition>
                </main>
            </section>
        </div>
    )
}

export default trpc.withTRPC(DashboardLayout) as NextComponentType<any, any, Props>;