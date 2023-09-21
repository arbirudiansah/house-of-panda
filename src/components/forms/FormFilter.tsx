import { ProjectTypes } from "@/lib/consts";
import { pickBy, toQueryString } from "@/lib/utils";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import Button from "../widgets/Button";
import FormInput from "../widgets/FormInput";
import FormSelect from "../widgets/FormSelect";

const priceFilters = ["5 - 99", "100 - 499", "500 - 999", "1000 - 1499", "1500 - 2000"]

const FormFilter = () => {
    const router = useRouter()
    const forms = useForm()

    const onSubmit = (data: any) => {
        const propertyType = data.type !== 'All Property' ? data.type : null
        const rawPrice = `${data.price}`.split(' - ')
        const price = rawPrice.length === 2 ? { startPrice: rawPrice[0], endPrice: rawPrice[1] } : null
        let query: any = {
            ...router.query,
            location: data.location,
            propertyType,
            ...price,
        }

        query = pickBy(query, (x: any) => x !== null && x !== '')

        updateQuery(query)
    }

    const reset = (e: any) => {
        e.preventDefault()
        forms.reset()
        router.replace(window.location.pathname)
    }

    const updateQuery = (query: Object) => {
        router.replace(router.pathname + `?${toQueryString(query)}`)
    }

    return (
        <div className="w-full py-5 px-4 bg-white border rounded-lg border-gray-900 border-opacity-20">
            <FormProvider {...forms}>
                <form onSubmit={forms.handleSubmit(onSubmit)}>
                    <FormSelect
                        label="Type Properties"
                        name="type"
                        placeholder="All Property"
                        options={ProjectTypes.map((label, value) => ({ value, label }))}
                        className="mb-6"
                        currentOption={router.query.propertyType}
                    />
                    <FormInput
                        type="text"
                        label="Project Location"
                        name="location"
                        className="mb-6"
                        placeholder="Enter location"
                        currentValue={router.query.location}
                    />
                    <FormSelect
                        label="Investment Price"
                        name="price"
                        placeholder="All Price"
                        options={priceFilters.map((value) => ({ value, label: value + ' USDT' }))}
                        className="mb-6"
                        currentOption={`${router.query.startPrice} - ${router.query.endPrice}`}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Button onClick={reset} title="Clear" className="justify-center py-4 text-gray-600 bg-white hover:bg-secondary hover:text-white" />
                        <Button title="Apply" className="justify-center py-4" />
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}

export default FormFilter