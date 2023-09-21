import { ProjectSpecification } from "@/lib/types/Project";
import { useEffect, useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { AddSellingPointIcon, AddSpecIcon, RemoveIcon } from "../icons";
import { MessageError } from "./MessageError";

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
    currentValues?: string[];
}

const FormSellingPoint: React.FC<Props> = (props: Props) => {
    const {
        register,
        formState: { errors },
        control,
    } = useFormContext();
    const { remove, insert, update } = useFieldArray({ control, name: props.name });
    const isInvalid = Boolean(errors[props.name])
    const [points, setPoints] = useState<string[]>([""]);

    const addSpec = (e: any) => {
        e.preventDefault();
        let object = ""
        insert(points.length, object)
        setPoints([...points, object])
    }

    const setSpecValue = (e: any, index: number) => {
        let object = e.target.value

        points[index] = object

        update(index, object)
        setPoints(points)
    }

    const removeSpec = (e: any, index: number) => {
        e.preventDefault()
        if (points.length === 1) return;
        let data = [...points]
        data.splice(index, 1)

        setPoints(data)
        remove(index)
    }

    useEffect(() => {
        if (props.currentValues && props.currentValues.length > 0) {
            setPoints([...props.currentValues])
        } else {
            insert(0, "")
        }
    }, [insert, props.currentValues])

    return (
        <div className={props.className}>
            <label className="font-medium text-secondary" htmlFor={props.name}>
                {props.label}
                {props.required && <span className="text-red-500">*</span>}
            </label>
            <div className="flex flex-col gap-2">
                {points.map((data, i) => {
                    return (
                        <div className="inline-flex items-center space-x-4" key={i}>
                            <input
                                type="text"
                                className={`mt-2 mb-2 h-11 block read-only:cursor-default read-only:bg-gray-50 appearance-none w-full rounded-md border-gray-300 shadow-sm focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50` + `${isInvalid ? " border-red-500 focus:border-red-500 focus:ring-red-200" : ""}`}
                                onChange={(e) => setSpecValue(e, i)}
                                value={data}
                            />
                            <button onClick={(e) => removeSpec(e, i)}>
                                <RemoveIcon />
                            </button>
                        </div>
                    )
                })}

                <button className="mb-4 w-fit transition-all ease-in-out hover:opacity-75" onClick={addSpec}>
                    <AddSellingPointIcon />
                </button>

                <MessageError message={errors[props.name]?.message} />
            </div>
        </div>
    );
}

export default FormSellingPoint;