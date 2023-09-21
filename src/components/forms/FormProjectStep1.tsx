import Button from "../widgets/Button";
import FormInput from "../widgets/FormInput";
import FormSelect from "../widgets/FormSelect";
import FormTextarea from "../widgets/FormTextarea";
import ImageUploadPreview from "../widgets/ImageUpload";
import { useStepWizard } from "../widgets/StepWizard";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FormProjectStep1 as FormType, FormProjectStep1Schema } from "@/lib/types/Project";
import { ProjectTypes } from "@/lib/consts";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { formProjectActions } from "@/lib/store/slices/formProject";
import { wilayahActions } from "@/lib/store/slices/wilayah";
import FormEditor from "../widgets/FormEditor";
import { extractLatLng } from "@/lib/utils";

const FormProjectStep1: FC<{ editMode?: boolean; data?: FormType }> = ({ editMode = false, data }) => {
    const { step1Data, isLoading } = useAppSelector(state => state.formProject)
    const { provinces, regencies, districts } = useAppSelector(state => state.wilayah)
    const defaultValues = useMemo(() => step1Data ?? data, [data, step1Data])

    const dispatch = useAppDispatch()
    const step = useStepWizard()
    const forms = useForm<FormType>({
        defaultValues,
        resolver: zodResolver(FormProjectStep1Schema),
    })
    
    const mapsUrl = forms.watch('location.maps_url')
    const defaultLocation = useMemo(() => extractLatLng(mapsUrl), [mapsUrl])

    const [showMap, setShowMap] = useState(false)

    const saveState = useCallback((e: any) => {
        e.preventDefault()
        dispatch(formProjectActions.saveStep1([forms.getValues(), editMode]))
    }, [dispatch, editMode, forms])

    const onSubmit = async (data: FormType) => {
        dispatch(formProjectActions.saveStep1([data, editMode]))
            .unwrap()
            .then(ok => ok && step.next())
    }

    const getRegencies = async (e: any) => {
        const provinceId = e.target.value;
        forms.setValue('location.city', "")
        forms.setValue('location.district', "")
        dispatch(wilayahActions.getRegencies(provinceId))
    }

    const getDistricts = async (e: any) => {
        const regencyId = e.target.value;
        forms.setValue('location.district', "")
        dispatch(wilayahActions.getDistricts(regencyId))
    }

    useEffect(() => {
        dispatch(wilayahActions.getProvinces({}))

        if (defaultValues?.location) {
            const { province, city, district } = defaultValues.location

            Promise
                .allSettled([
                    dispatch(wilayahActions.getRegencies(province)).unwrap(),
                    dispatch(wilayahActions.getDistricts(city)).unwrap(),
                ])
                .then(() => {
                    forms.setValue('location.province', province)
                    forms.setValue('location.city', city)
                    forms.setValue('location.district', district)
                })
        }

        let timer = setTimeout(() => {
            setShowMap(true)
        }, 3000)

        window.addEventListener("beforeunload", saveState);

        return () => {
            clearTimeout(timer)
            window.removeEventListener("beforeunload", saveState);
        }
    }, [defaultValues?.location, dispatch, forms, saveState])

    return (
        <>
            <FormProvider {...forms}>
                <form onSubmit={forms.handleSubmit(onSubmit)}>
                    <div className="w-full bg-white border border-outer rounded-lg">
                        <div className="px-6 py-4 border-b border-outer">
                            <p className="text-base font-medium leading-normal text-primary">General Information</p>
                        </div>
                        <div className="px-6 py-6 border-b border-outer">
                            <ImageUploadPreview name="image_urls" currentImages={defaultValues?.image_urls} />
                            <FormInput
                                type="text"
                                label="Project Name"
                                name="name"
                                className="mb-6"
                                required
                            />
                            <FormSelect
                                label="Property Type"
                                name="typeId"
                                className="w-full mb-6"
                                options={ProjectTypes.map((label, value) => ({ value, label, }))}
                                readonly={editMode}
                                required
                            />
                            <FormEditor
                                label="Project Description"
                                name="description"
                                rows={5}
                                required
                            />
                        </div>
                        <div className="px-6 py-4 border-b border-outer">
                            <p className="text-base font-medium leading-normal text-secondary">Project Location</p>
                        </div>
                        <div className="px-6 py-6">
                            <FormTextarea
                                label="Full Address"
                                name="location.fullAddress"
                                rows={3}
                                className="mb-6"
                                required
                            />
                            <div className="mb-6 flex items-start gap-4 w-full">
                                <FormSelect
                                    label="Province"
                                    name="location.province"
                                    className="w-full"
                                    options={provinces}
                                    onChange={getRegencies}
                                    currentOption={defaultValues?.location.province}
                                    required
                                />
                                <FormSelect
                                    label="Regency"
                                    name="location.city"
                                    className="w-full"
                                    options={regencies}
                                    onChange={getDistricts}
                                    currentOption={defaultValues?.location.city}
                                    required
                                />
                            </div>
                            <div className="mb-6 flex items-start gap-4 w-full">
                                <FormSelect
                                    label="District"
                                    name="location.district"
                                    className="w-full"
                                    options={districts}
                                    currentOption={defaultValues?.location.district}
                                    required
                                />
                                <FormInput
                                    type="text"
                                    label="Postal Code"
                                    name="location.postalCode"
                                    className="w-full"
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <FormInput
                                    type="text"
                                    label="Google Maps Url"
                                    name="location.maps_url"
                                    className="mb-4"
                                    required
                                />
                                <FormInput type="hidden" label="" name="location.latitude" currentValue={defaultLocation.lat} />
                                <FormInput type="hidden" label="" name="location.longitude" currentValue={defaultLocation.lng} />

                                <iframe
                                    src={`https://maps.google.com/maps?q=${defaultLocation.lng},${defaultLocation.lat}&output=embed&z=15`}
                                    width="100%"
                                    height="450"
                                    className="border-none rounded-lg"
                                    allowFullScreen={false}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                            <Button title="Next" className="w-full justify-center" isLoading={isLoading} />
                        </div>
                    </div>
                </form>
            </FormProvider>
        </>
    );
}

export default FormProjectStep1;