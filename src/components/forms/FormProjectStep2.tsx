import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { formProjectActions } from "@/lib/store/slices/formProject";
import { FormProjectStep2 as FormType, FormProjectStep2Schema } from "@/lib/types/Project";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Button from "../widgets/Button";
import FormFile from "../widgets/FormFile";
import FormSellingPoint from "../widgets/FormSellingPont";
import FormSpecification from "../widgets/FormSpecification";
import ImageUploadSingle from "../widgets/ImageUploadSingle";
import { useStepWizard } from "../widgets/StepWizard";

const FormProjectStep2: FC<{ editMode?: boolean; data?: FormType }> = ({ editMode = false, data }) => {
    const { step2Data, isLoading } = useAppSelector(state => state.formProject)
    const defaultValues = useMemo(() => step2Data ?? data, [data, step2Data])

    const dispatch = useAppDispatch()
    const step = useStepWizard()
    const forms = useForm<FormType>({
        defaultValues,
        resolver: zodResolver(FormProjectStep2Schema),
    })

    const onSubmit = async (data: FormType) => {
        dispatch(formProjectActions.saveStep2([data, editMode]))
            .unwrap()
            .then(ok => {
                if (ok) step.next()
            })
    }

    const saveState = (e: any) => {
        e.preventDefault()
        dispatch(formProjectActions.saveStep2([forms.getValues(), editMode]))
            .then(() => step.prev())
    }

    return (
        <FormProvider {...forms}>
            <form onSubmit={forms.handleSubmit(onSubmit)}>
                <div className="w-full bg-white border border-outer rounded-lg">
                    <div className="px-6 py-4 border-b border-outer">
                        <p className="text-base font-medium leading-normal text-primary">Selling Points & Specifications</p>
                    </div>
                    <div className="px-6 py-4 border-b border-outer">
                        <FormSpecification
                            name="specifications"
                            label="Specifications"
                            currentValues={defaultValues?.specifications}
                            required
                        />
                    </div>
                    <div className="px-6 py-4 border-b border-outer">
                        <FormSellingPoint
                            name="sellingPoints"
                            label="Selling Points"
                            currentValues={defaultValues?.sellingPoints}
                            required
                        />
                    </div>
                    <div className="px-6 py-4">
                        <ImageUploadSingle
                            label="Building Plan"
                            name={"blueprint"}
                            currentValue={defaultValues?.blueprint}
                            required
                        />
                        <FormFile
                            label={"Upload Prospectus (PDF)"}
                            name={"prospectus"}
                            className="mb-4"
                            accept="application/pdf"
                            currentValue={defaultValues?.prospectus}
                            required
                        />
                        <div className="inline-flex w-full space-x-4">
                            <Button
                                title="Back"
                                onClick={saveState}
                                className="w-full justify-center bg-secondary"
                                disabled={isLoading}
                            />
                            <Button title="Next" isLoading={isLoading} className="w-full justify-center" />
                        </div>
                    </div>
                </div>
            </form>
        </FormProvider>
    );
}

export default FormProjectStep2;