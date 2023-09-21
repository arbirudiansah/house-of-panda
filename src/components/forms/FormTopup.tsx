import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { adminActions } from "@/lib/store/slices/adminTools";
import { FC, useEffect, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import CloseBorderedIcon from "../icons/CloseBorderedIcon";
import Button from "../widgets/Button";
import FormInput from "../widgets/FormInput";
import { z } from "zod";
import { maskAddress, transformNumber } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import '@/lib/utils/extensions'
import { notify } from "@/lib/store/slices/message";
import { modal } from "@/lib/store/slices/modal";
import { TetherIcon } from "../icons";
import { useWeb3React } from "@web3-react/core";
import connectors from "@/lib/web3/Connectors";

interface Props {
    ownerAddress: string;
    callback: () => void;
}

const FormTopup: FC<Props> = ({ ownerAddress, callback }) => {
    const { account, activate, deactivate, active } = useWeb3React()
    const [useWallet, setUseWallet] = useState(false)
    const { isLoading, trxHash, allowance, balance } = useAppSelector(state => state.adminTools)

    const formSchema = z
        .object({
            amount: z.any().transform(transformNumber),
        })
        .refine(data => data.amount >= 1, {
            message: 'Minimum Stake Amount is 1',
            path: ['amount'],
        })
        .refine(data => data.amount <= balance, {
            message: 'Insufficient Balance',
            path: ['amount'],
        })
    type FormType = z.infer<typeof formSchema>

    const forms = useForm<FormType>({ resolver: zodResolver(formSchema) })
    const amount = useWatch({ control: forms.control, name: 'amount', defaultValue: 0 })
    const dispatch = useAppDispatch()

    const onSubmit = (data: FormType) => {
        dispatch(adminActions.topup({
            amount: data.amount,
            from: useWallet ? account! : ownerAddress,
            useWallet,
        }))
            .unwrap()
            .then(() => {
                forms.reset()
                notify.success("Topup success")
                callback()
                if (account) {
                    dispatch(adminActions.getBalance(account))
                } else {
                    dispatch(adminActions.getBalance(ownerAddress))
                }
            })
    }

    const onUseWallet = async () => {
        setUseWallet(true)
        try {
            await activate(connectors.injected)
        } catch (error: any) {
            notify.error(error)
        }
    }

    const onUseOwner = () => {
        setUseWallet(false)
        deactivate()
    }

    const approveToken = async (e: any) => {
        e.preventDefault()
        dispatch(adminActions.approveToken({
            amount,
            account: account ?? ownerAddress,
        }))
    }

    const close = () => {
        modal.hideModal()
        dispatch(adminActions.clear())
        deactivate()
    }

    useEffect(() => {
        if (account) {
            dispatch(adminActions.getBalance(account))
        } else {
            dispatch(adminActions.getBalance(ownerAddress))
        }
    }, [account, dispatch, ownerAddress])

    return (
        <div className="px-4 md:px-10 py-6 md:py-8 bg-white rounded-lg w-[90%] md:w-[434px] mx-auto relative">
            <div className="absolute top-3 right-3">
                <button onClick={close} className="text-gray-800 hover:text-primary">
                    <CloseBorderedIcon width={24} height={24} />
                </button>
            </div>
            <div className="mb-8">
                <h1 className="text-xl font-semibold text-secondary mb-1">Topup</h1>
            </div>
            <div className="rounded-xl px-4 py-4 border-2 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div>
                        <TetherIcon size={46} />
                    </div>
                    <div className="flex flex-col">
                        <p className="text-secondary text-base font-medium">{maskAddress(account ?? ownerAddress)}</p>
                        <span className="text-gray-700 text-xs">{balance?.toMoney()} USDT</span>
                    </div>
                </div>
                {!useWallet ? (
                    <button onClick={onUseWallet} className="inline-flex items-start justify-start px-1.5 py-0.5 bg-orange-50 hover:bg-orange-100 rounded">
                        <p className="flex-1 h-full text-sm text-orange-600 hover:text-orange-700">Use Wallet</p>
                    </button>
                ) : (
                    <button onClick={onUseOwner} className="inline-flex items-start justify-start px-1.5 py-0.5 bg-blue-50 hover:bg-blue-100 rounded">
                        <p className="flex-1 h-full text-sm text-blue-600 hover:text-blue-700">Use Owner</p>
                    </button>
                )}
            </div>
            <FormProvider {...forms}>
                <form onSubmit={forms.handleSubmit(onSubmit)}>
                    <FormInput
                        name="amount"
                        type="text"
                        label="Topup Amount"
                        placeholder="0"
                        className="mb-4"
                        suffix={<span>USDT</span>}
                    />
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
                    <div className="mt-10">
                        {(allowance < amount || allowance === 0) && (
                            <Button isLoading={isLoading} disabled={amount === 0} onClick={approveToken} title="Approve Token" className="w-full justify-center my-2 bg-secondary" />
                        )}
                        <Button title="Topup" disabled={(allowance < amount || allowance === 0)} isLoading={isLoading && (allowance > 0 && amount > 0)} className="w-full justify-center" />
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}

export default FormTopup;