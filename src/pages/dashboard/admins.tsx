/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import dynamic from "next/dynamic"
const DashboardLayout = dynamic(() => import('@/components/layout/DashboardLayout'), { ssr: false })

const Properties: NextPage = () => {
    return (
        <>
            <Head>
                <title>Admins | House of Panda</title>
            </Head>

            <DashboardLayout>
                <div className="flex justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold leading-loose text-gray-800">Admins</h1>
                    </div>
                    <div></div>
                </div>
            </DashboardLayout>
        </>
    )
};

export default Properties;

