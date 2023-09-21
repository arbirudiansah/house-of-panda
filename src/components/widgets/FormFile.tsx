import classNames from "classnames";
import { FC, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { MessageError } from "./MessageError";

interface FormFiles {
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
    accept?: string;
    currentValue?: string;
}

const FormFile: FC<FormFiles> = ({
    label,
    name,
    placeholder,
    className,
    children,
    pattern,
    required = false,
    prefix,
    suffix,
    readOnly,
    accept,
    currentValue,
}) => {
    const {
        register,
        formState: { errors },
        setValue
    } = useFormContext();

    const isInvalid = Boolean(errors[name])
    const inputRef = useRef<HTMLInputElement>(null)
    const [file, setFile] = useState<File | null>(null);

    const handleClick = (event: any) => {
        event.preventDefault()
        inputRef.current?.click();
    }

    const handleChange = (event: any) => {
        const fileUploaded = event.target.files[0];
        setFile(fileUploaded)
        setValue(name, fileUploaded)
    }

    return (
        <div className={className}>
            <label className="font-medium text-secondary" htmlFor={name}>
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative mt-2">
                <div onClick={currentValue ? undefined : handleClick} className={classNames(
                    "inline-flex space-x-2.5 transition-all ease-in-out hover:cursor-pointer items-center justify-start py-2.5 pl-3 pr-3 bg-white border rounded-md w-full overflow-hidden",
                    { ["border-red-500"]: isInvalid, ["border-gray-200"]: !isInvalid, }
                )}>
                    <div onClick={handleClick} className="flex items-center justify-center px-2.5 py-1 bg-gray-100 border rounded-sm border-gray-200">
                        <p className="text-sm font-medium leading-none text-gray-500">
                            {currentValue ? 'Change File' : 'Choose File'}
                        </p>
                    </div>
                    <p className="text-sm leading-none text-gray-400">
                        {file ? file.name : currentValue ? (
                            <a className="underline text-blue-500" href={currentValue} rel="noreferrer" target="_blank">Preview File</a>
                        ) : 'No file choosen'}
                    </p>
                </div>
                <input
                    type={"file"}
                    className={`hidden`}
                    {...register(name, {
                        required: required && "This field is required",
                        pattern,
                        onChange: handleChange,
                    })}
                    readOnly={readOnly}
                    ref={inputRef}
                    accept={accept}
                />
                {suffix && (
                    <div className="w-fit h-6 absolute top-3.5 right-2">
                        {suffix}
                    </div>
                )}
            </div>

            {children && <div className="text-gray-500 text-xs">{children}</div>}

            <MessageError message={errors[name]?.message} />
        </div>
    );
};

export default FormFile;
