import { FC } from "react";
import { Editor } from '@tinymce/tinymce-react';
import { useController, useFormContext } from "react-hook-form";
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

const FormEditor: FC<Props> = ({
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
        control,
    } = useFormContext();
    const { field: { onChange, ...field } } = useController({ control, name })

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
            <div className="relative mt-2">
                {/* @ts-ignore*/}
                <Editor
                    apiKey="1t0fx3ge2m44rs4t7yvzyd77r85q3jzgp5fj0o6kqevhvc4m"
                    textareaName={name}
                    onEditorChange={onChange}
                    {...field}
                    init={{
                        height: 350,
                        menubar: false,
                        statusbar: false,
                        plugins: [],
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }}
                />
            </div>

            {children && <div className="text-gray-500 text-xs">{children}</div>}

            <MessageError message={renderMessage()} />
        </div>
    );
};

export default FormEditor;
