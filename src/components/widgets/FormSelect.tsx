import classNames from "classnames";
import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { MessageError } from "./MessageError";

export type OptionValue = { value: any; label: string }

interface Props<T = OptionValue | string> {
    label: string;
    name: string;
    placeholder?: string;
    required?: boolean;
    className?: string;
    options?: T[];
    children?: any;
    onChange?: ((event: any) => void) | undefined;
    currentOption?: any;
    readonly?: boolean;
}

const FormSelect: FC<Props> = ({
    label,
    name,
    placeholder,
    className,
    required = false,
    options = [],
    children,
    onChange,
    currentOption,
    readonly
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
                {label}{required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                <select
                    id={name}
                    placeholder={placeholder}
                    disabled={readonly}
                    className={classNames(`mt-2 mb-2 h-11 block focus:ring focus:ring-opacity-50 read-only:cursor-default read-only:bg-gray-50 appearance-none w-full rounded-md shadow-sm`, {
                        ["border-red-500 invalid:ring-red-200 focus:border-red-500 focus:ring-red-200"]: isInvalid(),
                        ["border-gray-300 focus:border-gray-300 focus:ring-gray-200"]: !isInvalid(),
                    })}
                    {...register(name, {
                        onChange,
                    })}
                    defaultValue={currentOption}
                >
                    {placeholder ? <option>{placeholder}</option> : <option value="null">-- Select {label} --</option>}
                    {!children && options.map((value, i) => {
                        if (typeof value === 'string') {
                            return <option key={i} value={value}>{value}</option>
                        }

                        const item: OptionValue = value
                        return <option key={i} value={item.value}>{item.label}</option>
                    })}
                    {children}
                </select>

            </div>

            <MessageError message={renderMessage()} />
        </div>
    );
};

export default FormSelect;
