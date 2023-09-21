import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { modal } from "@/lib/store/slices/modal";
import IProject from "@/lib/types/Project";
import { FC, useState } from "react";
import CloseBorderedIcon from "../icons/CloseBorderedIcon";
import Button from "../widgets/Button";
import '@/lib/utils/extensions'
import { FormProvider, useForm } from "react-hook-form";
import FormSelect from "../widgets/FormSelect";
import { ProjectStatus } from "@/lib/consts";
import { notify } from "@/lib/store/slices/message";
import { trpc } from "@/lib/utils/trpc";
import { TRPCError } from "@trpc/server";
import { NextComponentType } from "next";

interface Props { item: IProject, cb?: () => void }

const FormChangeStatus: FC<Props> = ({ cb, item }) => {
    const forms = useForm()
    const setStatus = trpc.project.setStatus.useMutation()
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = (data: any) => {
        setIsLoading(true)
        setStatus.mutateAsync({ id: item.id, status: data.status })
            .then((tx) => {
                console.log('txHash:', tx)
                notify.success("Project status changed")
                modal.hideModal()
                cb?.()
            })
            .catch((e: TRPCError) => {
                notify.error(`Failed to change project status: ${e.message}`)
            })
            .finally(() => setIsLoading(false))
    }

    return (
        <div className="px-4 md:px-10 py-6 md:py-8 bg-white rounded-lg w-[90%] md:w-[434px] mx-auto relative">
            <div>
                <div className="absolute top-3 right-3">
                    <button onClick={modal.hideModal} className="text-gray-800 hover:text-primary">
                        <CloseBorderedIcon width={24} height={24} />
                    </button>
                </div>
                <div className="mb-6">
                    <p className="text-xl font-semibold text-gray-700 mb-3">Project Status</p>
                    <p className="w-full text-base leading-normal text-gray-400">You are about to change the status of <span className="text-secondary">{item.name}</span></p>
                </div>

                <FormProvider {...forms}>
                    <form onSubmit={forms.handleSubmit(onSubmit)}>
                        <FormSelect
                            name="status"
                            placeholder="Change status"
                            label={""}
                            currentOption={item.status}
                            options={Object.entries(ProjectStatus).map(([value, label]) => ({ value, label }))}
                            className="mb-7"
                        />
                        <Button isLoading={isLoading} title="Save" className="w-full justify-center py-4" />
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}

export default trpc.withTRPC(FormChangeStatus) as NextComponentType<any, any, Props>;