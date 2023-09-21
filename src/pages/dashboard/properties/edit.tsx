import FormProjectStep1 from "@/components/forms/FormProjectStep1";
import FormProjectStep2 from "@/components/forms/FormProjectStep2";
import FormProjectStep3 from "@/components/forms/FormProjectStep3";
import StepWizard from "@/components/widgets/StepWizard";
import { getProjectById } from "@/lib/repository/ProjectRepository";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useMemo, useState } from "react";
import * as db from "@/lib/Database"
import IProject from "@/lib/types/Project";
import NotFound from "@/components/widgets/NotFound";
import { useAppDispatch } from "@/lib/store/hooks";
import { formProjectActions } from "@/lib/store/slices/formProject";
import { wilayahActions } from "@/lib/store/slices/wilayah";
import moment from "moment";
import dynamic from "next/dynamic"
const DashboardLayout = dynamic(() => import('@/components/layout/DashboardLayout'), { ssr: false })

const Properties: NextPage<{ project: IProject }> = ({ project }) => {
    const dispatch = useAppDispatch()
    const [rendered, setRendered] = useState(false)
    const { step1, step2, step3 } = useMemo(() => ({
        step1: {
            name: project.name,
            description: project.description,
            location: project.location as any,
            typeId: project.onchainData.typeId.toString(),
            image_urls: project.image_urls,
        },
        step2: {
            specifications: project.specifications,
            sellingPoints: project.selling_points,
            prospectus: project.prospectus,
            blueprint: project.blueprint,
        },
        step3: {
            term: project.onchainData.term.toString(),
            amount: project.amountRequired,
            price: project.onchainData.price,
            authorizedOnly: project.onchainData.authorizedOnly,
            supplyLimit: project.onchainData.supplyLimit,
            apy: project.onchainData.apy,
            stakedApy: project.onchainData.stakedApy,
            project_start: moment(project.timeline.project_start).format("YYYY-MM-DD"),
            funding_start: moment(project.timeline.funding_start).format("YYYY-MM-DD"),
            funding_end: moment(project.timeline.funding_end).format("YYYY-MM-DD"),
        },
    }), [project])

    useEffect(() => {
        Promise.allSettled([
            dispatch(wilayahActions.getProvinces({})).unwrap(),
            dispatch(wilayahActions.getRegencies(project.location.province)).unwrap(),
            dispatch(wilayahActions.getDistricts(project.location.city)).unwrap(),
            dispatch(formProjectActions.saveStep1([step1, true])).unwrap(),
            dispatch(formProjectActions.saveStep2([step2, true])).unwrap(),
            dispatch(formProjectActions.saveStep3([step3, true])).unwrap(),
        ]).then(() => setRendered(true))
    }, [dispatch, step1, step2, step3, project])


    return (
        <>
            <Head>
                <title>Edit Project | House of Panda</title>
            </Head>

            <DashboardLayout
                breadcrumbs={[
                    { title: 'My Properties', link: '/properties' },
                    { title: 'Edit Project' },
                    { title: project?.name ?? 'Project Not Found' },
                ]}>
                {project ? (
                    <div className="max-w-3xl mx-auto">
                        <div className="flex justify-between mb-12">
                            <div>
                                <h1 className="text-2xl font-semibold leading-loose text-gray-800">Edit Project</h1>
                            </div>
                            <div></div>
                        </div>
                        {rendered && (
                            <StepWizard>
                                <FormProjectStep1 editMode data={step1} />
                                <FormProjectStep2 editMode data={step2} />
                                <FormProjectStep3 editMode data={step3} />
                            </StepWizard>
                        )}
                    </div>
                ) : (
                    <div><NotFound /></div>
                )}
            </DashboardLayout>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const id = context.query.id!.toString()
        await db.createConnection()
        const project = await getProjectById(id)

        if (!project) return { notFound: true }

        return {
            props: {
                project: JSON.parse(JSON.stringify(project)),
            }
        }
    } catch (error) {
        console.log("🚀 ~ file: edit.tsx:100 ~ constgetServerSideProps:GetServerSideProps= ~ error:", error)
        return {
            props: {
                project: undefined,
            },
        }
    }
}

export default Properties;

