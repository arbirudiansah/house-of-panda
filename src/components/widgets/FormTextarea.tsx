import classNames from "classnames";
import { FC, useState } from "react";
import { useFormContext } from "react-hook-form";
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
    rows?: number;
    min?: number;
    max?: number;
    children?: any;
}

const FormTextarea: FC<Props> = ({
    label,
    name,
    placeholder,
    className,
    children,
    pattern,
    required = false,
    rows = 5,
    min,
    max
}) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    const isInvalid = (): boolean => {
        const params = name.split('.')
        if (params.length === 2) {
            const [arg0, arg1] = params
            const field: any | undefined = errors[arg0];
            return Boolean(field?.[arg1])
        }

        return Boolean(errors[name])
    }

    const renderMessage = (): any => {
        const params = name.split('.')
        if (params.length === 2) {
            const [arg0, arg1] = params
            const field: any | undefined = errors[arg0];
            return field?.[arg1]?.message
        }

        return errors[name]?.message
    }

    return (
        <div className={className}>
            <label className="font-medium text-secondary" htmlFor={name}>
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                <textarea
                    id={name}
                    placeholder={placeholder}
                    className={classNames(`mt-2 mb-2 resize-none block focus:ring focus:ring-opacity-50 read-only:cursor-default read-only:bg-gray-50 appearance-none w-full rounded-md shadow-sm`, {
                        ["border-red-500 invalid:ring-red-200 focus:border-red-500 focus:ring-red-200"]: isInvalid(),
                        ["border-gray-300 focus:border-gray-300 focus:ring-gray-200"]: !isInvalid(),
                    })}
                    {...register(name, {
                        required: required && "This field is required",
                        pattern,
                    })}
                    rows={rows}
                    minLength={min}
                    maxLength={max}
                />
            </div>

            {children && <div className="text-gray-500 text-xs">{children}</div>}

            <MessageError message={renderMessage()} />
        </div>
    );
};

export default FormTextarea;
