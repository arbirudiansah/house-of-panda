import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { notify } from "@/lib/store/slices/message"
import { modal } from "@/lib/store/slices/modal"
import { updateProfile } from "@/lib/store/slices/profile"
import { zodResolver } from "@hookform/resolvers/zod"
import { FC } from "react"
import { FormProvider, useForm } from "react-hook-form"
import * as z from 'zod'
import CloseBorderedIcon from "../icons/CloseBorderedIcon"
import Button from "../widgets/Button"
import FormInput from "../widgets/FormInput"
import OutlinedButton from "../widgets/OutlinedButton"

const schema = z.object({
    password: z.string({
        required_error: 'Password is required'
    }).min(8, {
        message: 'Password requires 8 characters',
    }).trim(),
    newPassword: z
        .string({ required_error: 'Password is required' })
        .min(8, { message: 'Password requires 8 characters' })
        .regex(/^(?=.*[a-z])/, { message: 'Password must contain 1 lowercase alphabetical character' })
        .regex(/^(?=.*[A-Z])/, { message: 'Password must contain 1 uppercase alphabetical character' })
        .regex(/^(?=.*[0-9])/, { message: 'Password must contain 1 numeric character' })
        // .regex(/^(?=.*[!@#$%^&*])/, { message: 'Password must contain 1 special character' })
        .trim(),
    confirmPassword: z
        .string({ required_error: 'Confirmation Password is required' })
        .min(8, { message: 'Confirmation Password requires 8 characters' })
        .trim(),
}).refine((data: any) => data.newPassword === data.confirmPassword, {
    message: 'Confirmation Password doesn\'t match',
    path: ["confirmPassword"],
})

type FormType = z.infer<typeof schema>

const ChangePasswordForm: FC = () => {
    const dispatch = useAppDispatch()
    const { isLoading } = useAppSelector((state) => state.profile)
    const forms = useForm({ resolver: zodResolver(schema) })

    const onSubmit = async (data: any) => {
        const payload = {
            password: data.password,
            newPassword: data.newPassword,
        }

        dispatch(updateProfile(payload))
            .unwrap()
            .then(() => {
                notify.info("Password changed")
                modal.hideModal()
            })
    }

    const close = async (e: any) => {
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
                <h1 className="text-xl font-semibold text-secondary mb-1">Change Password</h1>
            </div>
            <FormProvider {...forms}>
                <form onSubmit={forms.handleSubmit(onSubmit)} autoComplete="off">
                    <FormInput type="password" label="Old Password" name="password" className="mb-4" />
                    <FormInput type="password" label="New Password" name="newPassword" className="mb-4" />
                    <FormInput type="password" label="Confirm Password" name="confirmPassword" className="mb-10" />
                    <div className="w-full inline-flex items-start space-x-5">
                        <Button onClick={close} title="Cancel" className="w-full justify-center bg-secondary" />
                        <Button title="Change" isLoading={isLoading} className="w-full justify-center" />
                    </div>
                </form>
            </FormProvider>
        </div>
    )
}

export default ChangePasswordForm