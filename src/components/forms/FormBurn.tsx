import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { modal } from "@/lib/store/slices/modal";
import { ProjectOnchainData } from "@/lib/types/Project";
import { Collection } from "@/lib/types/Transaction";
import { useWeb3React } from "@web3-react/core";
import { FC, useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import CloseBorderedIcon from "../icons/CloseBorderedIcon";
import Button from "../widgets/Button";
import FormInput from "../widgets/FormInput";
import { z } from "zod";
import { maskAddress, transformNumber } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import '@/lib/utils/extensions'
import { stakeActions } from "@/lib/store/slices/stake";
import { notify } from "@/lib/store/slices/message";

interface Props {
    pid: string
    projectName: string
    item: ProjectOnchainData
    account: string
    callback?: () => void
}

const FormBurnInner: FC<Props> = ({ pid, projectName, item, account, callback }) => {
    const { freeBalance, isLoading, trxHash } = useAppSelector(state => state.stake)
    const formSchema = z
        .object({ qty: z.any().transform(transformNumber) })
        .refine(data => data.qty >= 1, {
            message: 'Minimum Burn Amount is 1',
            path: ['qty'],
        })
        .refine(data => data.qty <= freeBalance, {
            message: 'Insufficient Balance',
            path: ['qty'],
        })
    type FormType = z.infer<typeof formSchema>

    const dispatch = useAppDispatch()
    const forms = useForm<FormType>({ resolver: zodResolver(formSchema) })
    const qty = useWatch({ control: forms.control, name: 'qty', defaultValue: 0 })

    const onSubmit = (data: FormType) => {
        const project = {
            pid,
            id: item.projectId,
            name: projectName,
            price: item.price,
        }
        dispatch(stakeActions.burn([account, project, data.qty]))
            .unwrap()
            .then(() => {
                notify.success("Burning NFT success")
                dispatch(stakeActions.getInfo([account, item.projectId]))
                forms.reset()
                callback?.()
            })
    }

    return (
        <FormProvider {...forms}>
            <form onSubmit={forms.handleSubmit(onSubmit)}>
                <div className="flex justify-between items-center">
                    <p className="text-sm font-medium leading-normal text-secondary">Free Balance</p>
                    <p className="text-sm font-medium leading-normal text-secondary">{freeBalance} NFT</p>
                </div>
                <FormInput
                    name="qty"
                    type="text"
                    label=""
                    placeholder="0"
                    className="mb-4"
                    readOnly={isLoading}
                />
                <div className="flex justify-between mb-2 items-center w-full h-12 px-4 py-4 bg-gray-100 rounded-lg">
                    <p className="text-sm leading-tight text-gray-400">Burn Value</p>
                    <p className="text-sm font-medium leading-tight text-right text-gray-700">{Number(qty * item.price).toMoney()} USDT</p>
                </div>
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
                <Button title="Burn" isLoading={isLoading} className="w-full justify-center mt-12" />
            </form>
        </FormProvider>
    )
}

const FormBurn: FC<{ item: Collection, callback?: () => void }> = ({ item, callback }) => {
    const { onchainData } = item.project
    const { account } = useWeb3React()
    const dispatch = useAppDispatch()

    const close = () => {
        modal.hideModal()
        dispatch(stakeActions.clear())
    }

    useEffect(() => {
        if (account) {
            dispatch(stakeActions.getInfo([account, onchainData.projectId]))
        }
    }, [account, dispatch, onchainData.projectId])

    return (
        <div className="px-4 md:px-10 py-6 md:py-8 bg-white rounded-lg w-[90%] md:w-[434px] mx-auto relative">
            <div className="absolute top-3 right-3">
                <button onClick={close} className="text-gray-800 hover:text-primary">
                    <CloseBorderedIcon width={24} height={24} />
                </button>
            </div>
            <div className="mb-8">
                <h1 className="text-xl font-semibold text-secondary mb-1">Burn NFT</h1>
                <h3 className="text-base font-medium leading-normal text-gray-400">{item.project.name}</h3>
            </div>
            <FormBurnInner
                item={onchainData}
                account={account!}
                callback={callback}
                pid={item.project._id}
                projectName={item.project.name}
            />
        </div>
    )
}

export default FormBurn;