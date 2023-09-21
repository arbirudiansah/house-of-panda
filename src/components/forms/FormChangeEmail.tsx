import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { FC } from "react"
import { FormProvider, useForm } from "react-hook-form"
import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import Button from "../widgets/Button"
import OutlinedButton from "../widgets/OutlinedButton"
import { updateProfile } from "@/lib/store/slices/profile"
import FormInput from "../widgets/FormInput"
import CloseBorderedIcon from "../icons/CloseBorderedIcon"
import { modal } from "@/lib/store/slices/modal"
import { notify } from "@/lib/store/slices/message"

const schema = z.object({
    email: z.string().email({
        message: 'Invalid Email address'
    }).trim(),
    confirmEmail: z.string().email({
        message: 'Invalid Email address'
    }).trim(),
    password: z.string({
        required_error: 'Password is required'
    }).min(8, {
        message: 'Password requires 8 characters',
    }).trim(),
}).refine((data: any) => data.email === data.confirmEmail, {
    message: 'Confirmation Email doesn\'t match',
    path: ["confirmEmail"],
})

type FormType = z.infer<typeof schema>

const ChangeEmailForm: FC = () => {
    const dispatch = useAppDispatch()
    const { isLoading } = useAppSelector((state) => state.profile)
    const forms = useForm<FormType>({ resolver: zodResolver(schema) })

    const onSubmit = async (data: FormType) => {
        const payload = {
            email: data.email,
            password: data.password,
        }

        dispatch(updateProfile(payload))
            .unwrap()
            .then(() => {
                notify.info("Email address changed")
                modal.hideModal()
            })
    }

    const close = (e: any) => {
        e.preventDefault()
        modal.hideModal()
    }

    return (
        <div className="px-4 md:px-10 py-6 md:py-8 bg-white rounded-lg w-[90%] md:w-[434px] mx-auto relative">
            <div className="absolute top-3 right-3">
                <button onClick={close} className="text-gray-800 hover:text-primary">
                    <CloseBorderedIcon width={24} height={24} />
                </button>
            </div>
            <div className="mb-8">
                <h1 className="text-xl font-semibold text-secondary mb-1">Change Email</h1>
            </div>
            <FormProvider {...forms}>
                <form onSubmit={forms.handleSubmit(onSubmit)} autoComplete="off">
                    <FormInput type="email" label="New Email Address" name="email" className="mb-4" />
                    <FormInput type="email" label="Confirm Email Address" name="confirmEmail" className="mb-4" />
                    <FormInput type="password" label="Verify Password" name="password" className="mb-10" />
                    <div className="w-full inline-flex items-start space-x-5">
                        <Button onClick={close} title="Cancel" className="w-full justify-center bg-secondary" />
                        <Button title="Change" isLoading={isLoading} className="w-full justify-center" />
                    </div>
                </form>
            </FormProvider>
        </div>
    )
}

export default ChangeEmailForm