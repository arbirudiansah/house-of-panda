import FormProjectStep1 from "@/components/forms/FormProjectStep1";
import FormProjectStep2 from "@/components/forms/FormProjectStep2";
import FormProjectStep3 from "@/components/forms/FormProjectStep3";
import EthIcon from "@/components/icons/EthIcon";
import StepWizard from "@/components/widgets/StepWizard";
import { useAppDispatch } from "@/lib/store/hooks";
import { adminActions } from "@/lib/store/slices/adminTools";
import type { NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic"
const DashboardLayout = dynamic(() => import('@/components/layout/DashboardLayout'), { ssr: false })

const Properties: NextPage = () => {
    const dispatch = useAppDispatch()
    const [balance, setBalance] = useState(0)

    useEffect(() => {
        dispatch(adminActions.getAdminBalance())
            .unwrap()
            .then(setBalance)
    }, [dispatch])

    return (
        <>
            <Head>
                <title>Create New Project | House of Panda</title>
            </Head>

            <DashboardLayout
                breadcrumbs={[
                    { title: 'My Properties', link: '/properties' },
                    { title: 'Create New Project' },
                ]}>
                <div className="max-w-3xl mx-auto">
                    <div className="flex justify-between mb-12">
                        <div>
                            <h1 className="text-2xl font-semibold leading-loose text-gray-800">Create New Project</h1>
                            <div className="bg-white border rounded-lg border-gray-200">
                                <div className="inline-flex space-x-2 items-center justify-start px-5 py-2.5">
                                    <p className="text-base leading-normal text-secondary">Balance</p>
                                    <div className="flex space-x-1 items-center justify-end w-28 h-full">
                                        <div><EthIcon /></div>
                                        <p className="text-base font-medium leading-normal text-gray-800">{balance.toMoney()} ETH</p>
                                    </div>
                                </div>
                                <div className="border-t px-5 py-4">
                                    <p className="text-base leading-normal"><span className="text-primary font-medium">Attention!</span> This process takes a longer time, due to the processing into the blockchain. Make sure you have enough ETH balances!</p>
                                </div>
                            </div>
                        </div>
                        <div></div>
                    </div>
                    <StepWizard>
                        <FormProjectStep1 />
                        <FormProjectStep2 />
                        <FormProjectStep3 />
                    </StepWizard>
                </div>
            </DashboardLayout>
        </>
    )
};

export default Properties;

