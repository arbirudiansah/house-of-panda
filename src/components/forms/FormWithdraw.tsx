import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { adminActions } from "@/lib/store/slices/adminTools";
import { FC, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import CloseBorderedIcon from "../icons/CloseBorderedIcon";
import Button from "../widgets/Button";
import FormInput from "../widgets/FormInput";
import { z } from "zod";
import { maskAddress, transformNumber } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ethUtil from 'ethereumjs-util';
import '@/lib/utils/extensions'
import { notify } from "@/lib/store/slices/message";
import { modal } from "@/lib/store/slices/modal";
import FormCheckbox from "../widgets/FormCheckbox";
import { BlackRoof, createProvider } from "@/lib/web3/BlackRoof";

interface Props {
    ownerAddress: string;
    balance: number;
    callback: () => void;
}

const blackRoof = new BlackRoof(createProvider())

const FormWithdraw: FC<Props> = ({ ownerAddress, balance, callback }) => {
    const [usdtBalance, setBalance] = useState(balance)
    const formSchema = z
        .object({
            amount: z.any().transform(transformNumber),
            to: z.string(),
        })
        .refine(data => data.amount >= 1, {
            message: 'Minimum Stake Amount is 1',
            path: ['amount'],
        })
        .refine(data => data.amount <= usdtBalance, {
            message: 'Insufficient Balance',
            path: ['amount'],
        })
        .refine(({ to }) => ethUtil.isValidAddress(to), {
            message: 'Invalid target address',
            path: ['to'],
        })
    type FormType = z.infer<typeof formSchema>

    const { isLoading, trxHash } = useAppSelector(state => state.adminTools)
    const forms = useForm<FormType>({ resolver: zodResolver(formSchema) })
    const dispatch = useAppDispatch()

    const onSubmit = (data: FormType) => {
        dispatch(adminActions.withdraw(data))
            .unwrap()
            .then(() => {
                notify.success("Withdraw success")
                blackRoof.getSCBalance().then(setBalance)
                forms.reset()
                callback()
            })
    }

    const onChecked = (state: boolean) => {
        if (state) {
            forms.setValue("to", ownerAddress)
        } else {
            forms.setValue("to", "")
        }
    }

    const wdAll = (e: any) => {
        e.preventDefault()
        forms.setValue("amount", usdtBalance)
    }

    const close = () => {
        modal.hideModal()
    }

    useEffect(() => {
		blackRoof.getSCBalance().then(setBalance)
	}, [])

    return (
        <div className="px-4 md:px-10 py-6 md:py-8 bg-white rounded-lg w-[90%] md:w-[434px] mx-auto relative">
            <div className="absolute top-3 right-3">
                <button onClick={close} className="text-gray-800 hover:text-primary">
                    <CloseBorderedIcon width={24} height={24} />
                </button>
            </div>
            <div className="mb-8">
                <h1 className="text-xl font-semibold text-secondary mb-1">Withdraw</h1>
            </div>
            <FormProvider {...forms}>
                <form onSubmit={forms.handleSubmit(onSubmit)}>
                    <div className="flex flex-col items-center mb-4">
                        <p className="text-sm font-medium leading-normal text-gray-400">Current Balance</p>
                        <p className="text-2xl font-semibold leading-normal text-primary">{usdtBalance.toMoney()} USDT</p>
                    </div>
                    <FormInput
                        name="amount"
                        type="text"
                        label="Withdraw Amount"
                        placeholder="0"
                        className="mb-4"
                        suffix={<button onClick={wdAll} className="text-primary hover:text-secondary">MAX</button>}
                        required
                    />
                    <FormInput
                        name="to"
                        type="text"
                        label="To Address"
                        placeholder="Address"
                        className="mb-4"
                        required
                    >
                        <FormCheckbox label="Same as Owner Address" name="same" onChecked={onChecked} />
                    </FormInput>
                    {trxHash && (
                        <div className="flex justify-between items-center w-full h-12 px-4 py-4 bg-gray-100 rounded-lg mt-2">
                            <p className="text-sm leading-tight text-gray-400">Trx Hash</p>
                            <a
                                href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}/tx/${trxHash}`}
                                className="text-sm font-medium leading-tight text-right text-gray-700 hover:text-primary"
                                target="_blank"
                                rel="noreferrer"
                            >
                                {maskAddress(trxHash)}
                            </a>
                        </div>
                    )}
                    <Button title="Withdraw" isLoading={isLoading} className="w-full justify-center mt-12" />
                </form>
            </FormProvider>
        </div>
    );
}

export default FormWithdraw;