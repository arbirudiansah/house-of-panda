import { ProjectSpecification } from "@/lib/types/Project"
import { useEffect, useState } from "react"
import { useFieldArray, useFormContext } from "react-hook-form"
import { AddSpecIcon, RemoveIcon } from "../icons"
import { MessageError } from "./MessageError"
import { ProjectSpecs } from "./ProjectSpecs"

interface Props {
    label: string;
    name: string;
    placeholder?: string;
    required?: boolean;
    className?: string;
    pattern?: {
        value: RegExp;
        message: string;
    };
    prefix?: JSX.Element;
    suffix?: JSX.Element;
    children?: any;
    readOnly?: boolean;
    currentValues?: ProjectSpecification[]
}

const FormSpecification: React.FC<Props> = (props: Props) => {
    const {
        register,
        formState: { errors },
        control,
    } = useFormContext();
    const { remove, insert, update } = useFieldArray({ control, name: props.name });
    const isInvalid = Boolean(errors[props.name])
    const [specs, setSpecs] = useState<ProjectSpecification[]>([{ name: '', value: '' }]);

    const addSpec = (e: any) => {
        e.preventDefault();
        let object = {
            name: '',
            value: ''
        }
        insert(specs.length, object)
        setSpecs([...specs, object])
    }

    const setSpecValue = (e: any, field: number, index: number) => {
        let data = [...specs]
        let object = { ...data[index] }
        if (field === 0) {
            object = {
                ...object,
                name: e.target.value,
            }
        } else {
            object = {
                ...object,
                value: e.target.value,
            }
        }

        data[index] = object

        update(index, object)
        setSpecs(data)
    }

    const removeSpec = (e: any, index: number) => {
        e.preventDefault()
        if (specs.length === 1) return;
        let data = [...specs]
        data.splice(index, 1)

        setSpecs(data)
        remove(index)
    }

    useEffect(() => {
        if (props.currentValues && props.currentValues.length > 0) {
            setSpecs([...props.currentValues])
        }
    }, [insert, props.currentValues])

    return (
        <div className={props.className}>
            <label className="font-medium text-secondary" htmlFor={props.name}>
                {props.label}
                {props.required && <span className="text-red-500">*</span>}
            </label>
            <div className="flex flex-col gap-2">
                {specs.map((data, i) => {
                    return (
                        <div className="inline-flex items-center space-x-4" key={i}>
                            <select
                                className={`mt-2 mb-2 h-11 block appearance-none w-full rounded-md border-gray-300 shadow-sm focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50` + `${isInvalid ? " border-red-500 focus:border-red-500 focus:ring-red-200" : ""}`}
                                onChange={(e) => setSpecValue(e, 0, i)}
                            >
                                <option className="text-gray-300 italic">-- Pilih Spesifikasi --</option>
                                {ProjectSpecs.map((value, j) => {
                                    return <option key={j} value={value.text} selected={data.name === value.text}>{value.text}</option>
                                })}
                            </select>
                            <input
                                type="text"
                                className={`mt-2 mb-2 h-11 block read-only:cursor-default read-only:bg-gray-50 appearance-none w-full rounded-md border-gray-300 shadow-sm focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50` + `${isInvalid ? " border-red-500 focus:border-red-500 focus:ring-red-200" : ""}`}
                                onChange={(e) => setSpecValue(e, 1, i)}
                                name={`spec_${i}`}
                                value={data.value}
                                readOnly={false}
                            />
                            <button onClick={(e) => removeSpec(e, i)}>
                                <RemoveIcon />
                            </button>
                        </div>
                    )
                })}
                {specs.length < ProjectSpecs.length && (
                    <button className="mb-4 w-fit transition-all ease-in-out hover:opacity-75" onClick={addSpec}>
                        <AddSpecIcon />
                    </button>
                )}
                <MessageError message={errors[props.name]?.message} />
            </div>
        </div>
    );
}

export default FormSpecification;