import { FC, useMemo } from "react"
import { useForm } from "react-hook-form"
import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import Button from "../widgets/Button"
import CloseBorderedIcon from "../icons/CloseBorderedIcon"
import { modal } from "@/lib/store/slices/modal"
import classNames from "classnames"
import { MessageError } from "../widgets/MessageError"
import { trpc, withTRPC } from "@/lib/utils/trpc"
import { notify } from "@/lib/store/slices/message"
import { errorHandler } from "@/lib/ErrorHandler"

const schema = z.object({
    addresses: z
        .string()
        .trim()
        .transform(val => val.split("\n"))
        .refine((val) => val.length > 0, {
            message: 'Addresses is required',
            path: ["addresses"],
        }),
})

type FormType = z.infer<typeof schema>
type Props = { callback?: () => void }

const FormAddress: FC<Props> = ({ callback }) => {
    const { formState, watch, setError, setValue } = useForm<FormType>({ resolver: zodResolver(schema) })
    const inputError = useMemo(() => formState.errors.addresses?.message !== undefined, [formState.errors.addresses?.message])
    const addresses = watch("addresses", [])

    const { isLoading, mutateAsync } = trpc.whitelist.addAddresses.useMutation()

    const onSubmit = async (e: any) => {
        e.preventDefault()
        try {
            await mutateAsync({ addresses: addresses.reverse() })
            notify.success('Addresses added successfully')
            modal.hideModal()
            callback?.()
        } catch (error) {
            notify.error(errorHandler(error))
        }
    }

    const close = (e: any) => {
        e.preventDefault()
        modal.hideModal()
    }

    function handleKeyDown(e: any) {
        if (e.key !== 'Enter') return
        const value = e.target.value
        if (!value.trim()) return
        if (value.includes('\n')) {
            const values = value.split('\n')
            const addrs = values.map((val: string) => val.trim()).filter(validateAddr)
            if (addrs.length === 0) return
            setValue('addresses', [...addresses, ...addrs])
        } else if (value.trim().includes(' ')) {
            const values = value.split(' ')
            const addrs = values.map((val: string) => val.trim()).filter(validateAddr)
            if (addrs.length === 0) return
            setValue('addresses', [...addresses, ...addrs])
        } else {
            if (!validateAddr(value)) return
            setValue('addresses', [...addresses, value])
        }

        setError('addresses', {})

        e.target.focus()
        e.target.value = ''

        setTimeout(() => {
            const textarea = document.getElementById('textarea')! as HTMLTextAreaElement
            textarea.scrollTop = textarea.scrollHeight
        }, 0)
    }

    function validateAddr(addr: string) {
        // check if address already exists
        if (addresses.includes(addr.trim())) {
            setError('addresses', {
                type: 'manual',
                message: 'Address already exists',
            }, { shouldFocus: true })

            return false
        }

        const regex = /^0x[a-fA-F0-9]{40}$/g
        const isValid = regex.test(addr.trim())

        if (!isValid) {
            setError('addresses', {
                type: 'manual',
                message: 'Invalid address',
            }, { shouldFocus: true })

            return false
        }

        return true
    }

    function removeAddr(index: number) {
        if (isLoading) return
        const addrs = addresses.filter((el, i) => i !== index)
        setValue('addresses', addrs)
    }

    return (
        <div className="bg-white rounded-lg w-[90%] md:w-[434px] mx-auto relative">
            <div className="w-full inline-flex justify-between items-center px-4 py-3 border-b">
                <h1 className="text-xl font-semibold text-secondary mb-1">Add Whitelist Addresses</h1>
                <button onClick={close} className="text-gray-800 hover:text-primary">
                    <CloseBorderedIcon width={24} height={24} />
                </button>
            </div>
            <div className="px-4 py-6">
                <div className="text-slate-700 text-base font-medium leading-normal">ETH Address</div>
                <div className="text-sm text-gray-600">
                    Press enter to add multiple addresses. Each address should be on a new line.
                </div>
                <div className="mb-4">
                    <div id="textarea" className={classNames(`p-2 hover:cursor-text h-[280px] overflow-y-auto mt-2 mb-2 resize-none focus-within:ring focus-within:ring-opacity-50 border w-full rounded-md shadow-sm block`, {
                        ["border-red-500 invalid:ring-red-200 focus-within:border-red-500 focus-within:ring-red-200"]: inputError,
                        ["border-gray-300 focus-within:border-gray-300 focus-within:ring-gray-200"]: !inputError,
                    })} onClick={(e) => {
                        const input = document.getElementById('addr')!
                        input.focus()
                    }}>
                        {addresses.map((addr, index) => (
                            <div className="inline-flex items-center py-1 px-2 text-sm space-x-2 rounded-md bg-gray-100 mb-1" key={index}>
                                <span>{addr}</span>
                                <span onClick={() => removeAddr(index)} className="bg-primary rounded-full select-none h-5 w-5 flex items-center justify-center leading-none text-white text-base hover:opacity-75 cursor-pointer">&times;</span>
                            </div>
                        ))}
                        <input type="text" className="border-none p-0 bg-transparent focus:border-none focus:ring-0 text-[15px] resize-none w-full" onKeyDown={handleKeyDown} disabled={isLoading} placeholder="Enter address" id="addr" />
                    </div>
                    <MessageError message={formState.errors.addresses?.message} />
                </div>
                <div className="w-full inline-flex items-start justify-end">
                    <Button title="Add" onClick={onSubmit} isLoading={isLoading} className="w-1/2 justify-center" />
                </div>
            </div>
        </div>
    )
}

export default withTRPC<Props>(FormAddress)