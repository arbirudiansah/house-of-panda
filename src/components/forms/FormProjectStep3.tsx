import { ProjectTerms } from "@/lib/consts";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { formProjectActions } from "@/lib/store/slices/formProject";
import { notify } from "@/lib/store/slices/message";
import { FormProjectStep3 as FormType, FormProjectStep3Schema } from "@/lib/types/Project";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { FC, useMemo, useState } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import Button from "../widgets/Button";
import FormCheckbox from "../widgets/FormCheckbox";
import FormInput from "../widgets/FormInput";
import FormSelect from "../widgets/FormSelect";
import { useStepWizard } from "../widgets/StepWizard";
import moment from "moment";
import { trpc } from "@/lib/utils/trpc";
import { errorHandler } from "@/lib/ErrorHandler";
import { NextComponentType } from "next";

interface Props { editMode?: boolean; data?: FormType }

const FormProjectStep3: FC<Props> = ({ editMode = false, data }) => {
    const dispatch = useAppDispatch()
    const [isLoading, setIsLoading] = useState(false)
    const { step3Data } = useAppSelector(state => state.formProject)
    const defaultValues = useMemo(() => step3Data ?? data, [data, step3Data])

    const router = useRouter()
    const step = useStepWizard()
    const forms = useForm<FormType>({
        defaultValues,
        resolver: zodResolver(FormProjectStep3Schema)
    })

    const createProject = trpc.project.createProject.useMutation()

    const amount = useWatch({ control: forms.control, name: 'amount' })
    const price = useWatch({ control: forms.control, name: 'price' })
    const term = useWatch({ control: forms.control, name: 'term' })
    const fundingStart = useWatch({ control: forms.control, name: 'funding_start' })

    const maxSupply = useMemo(() => {
        const supply = Math.round(amount / price)
        if (isNaN(supply)) return 0
        return supply
    }, [amount, price])
    const fundingEnd = useMemo(() => {
        if (term === 'null') return null
        if (term && fundingStart) {
            const endTime = moment(fundingStart).add(term, 'months').add(-1, 'day')
            return endTime.format('yyyy-MM-DD')
        }
        return null
    }, [fundingStart, term])

    const onSubmit = async (data: FormType) => {
        setIsLoading(true)

        try {
            formProjectActions.saveStep3([forms.getValues(), editMode])
            if (editMode && router.query.id) {
                dispatch(formProjectActions.updateProject([router.query.id.toString(), data]))
                    .unwrap()
                    .then(() => {
                        notify.success('Project successfully updated')
                        router.replace(`/dashboard/properties/${router.query.id}`)
                    })
            } else {
                const payload = await dispatch(formProjectActions.createProject(data)).unwrap()
                await createProject.mutateAsync(payload)
            }
        } catch (e) {
            notify.error(errorHandler(e))
        } finally {
            setIsLoading(false)
        }
    }

    const saveState = (e: any) => {
        e.preventDefault()
        dispatch(formProjectActions.saveStep3([forms.getValues(), editMode]))
            .then(() => step.prev())
    }

    trpc.project.onDeployProject.useSubscription(undefined, {
        onData: async (_) => {
            notify.success('Project successfully created! Deploying project to blockchain...')
            router.replace(`/dashboard/properties`)
        },
        onError: async (err) => {
            notify.error(errorHandler(err))
        },
    })

    return (
        <FormProvider {...forms}>
            <form onSubmit={forms.handleSubmit(onSubmit)}>
                <div className="w-full bg-white border border-outer rounded-lg">
                    <div className="px-6 py-4 border-b border-outer">
                        <p className="text-base font-medium leading-normal text-primary">Fundraising Details</p>
                    </div>
                    <div className="px-6 py-4">
                        <div className="mb-6 flex items-start gap-4 w-full">
                            <FormInput
                                type="text"
                                label="Total Funding Needs"
                                name="amount"
                                suffix={<p className="px-2">USDT</p>}
                                className="w-full"
                                readOnly={editMode}
                                required
                            />
                            <FormInput
                                type="text"
                                label="Investment Price"
                                name="price"
                                suffix={<p className="px-2">USDT</p>}
                                className="w-full"
                                readOnly={editMode}
                                required
                            />
                        </div>
                        <div className="mb-6 flex items-start gap-4 w-full">
                            <FormInput
                                type="text"
                                label="Reward"
                                name="apy"
                                suffix={<p className="px-2">%</p>}
                                className="w-full"
                                readOnly={editMode}
                                required
                            />
                            <FormInput
                                type="text"
                                label="Staking Reward"
                                name="stakedApy"
                                suffix={<p className="px-2">%</p>}
                                className="w-full"
                                readOnly={editMode}
                                required
                            />
                        </div>
                        <div className="mb-6 flex items-start gap-4 w-full">
                            <FormInput
                                type="text"
                                label="Max NFT Supply"
                                name="supplyLimit"
                                className="w-full"
                                currentValue={maxSupply.toString()}
                                readOnly
                            />
                            <FormSelect
                                label="Project Duration"
                                name="term"
                                className="w-full"
                                options={Object.entries(ProjectTerms).map(([value, label]) => ({ value, label }))}
                                readonly={editMode}
                                required
                            />
                        </div>
                        <div className="mb-4 flex items-start gap-4 w-full">
                            <FormInput
                                type="date"
                                label="Starting Fundraising"
                                name="funding_start"
                                className="w-full"
                                required
                                readOnly={editMode}
                            />
                            <FormInput
                                type="date"
                                label="End of Fundraising"
                                name="funding_end"
                                className="w-full"
                                currentValue={fundingEnd}
                                required
                                readOnly={editMode}
                            />
                            <FormInput
                                type="date"
                                label="Project Started"
                                name="project_start"
                                className="w-full"
                                required
                            />
                        </div>
                        <FormCheckbox label={"Only Admin/Owner can Mint the NFT"} name="authorizedOnly" disabled={editMode} />
                    </div>
                    <div className="px-6 py-5">
                        <div className="inline-flex w-full space-x-4">
                            <Button title="Back" onClick={saveState} disabled={isLoading} className="w-full justify-center bg-secondary" />
                            <Button title={editMode ? "Update Project" : "Listing Project"} isLoading={isLoading} className="w-full justify-center" />
                        </div>
                    </div>
                </div>
            </form>
        </FormProvider>
    );
}

export default trpc.withTRPC(FormProjectStep3) as NextComponentType<any, any, Props>;