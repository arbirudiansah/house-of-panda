/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone'
import { MessageError } from './MessageError';
import { useFormContext } from 'react-hook-form';
import { RemoveIcon, UploadIcon } from '../icons';
import ChangeIcon from '../icons/ChangeIcon';

interface Props {
    name: string;
    label?: string;
    required?: boolean;
    currentValue?: string;
}

const ImageUploadSingle: React.FC<Props> = ({ name, label, required, currentValue }) => {
    const {
        register,
        formState: { errors },
        setError,
        setValue
    } = useFormContext();

    const isInvalid = Boolean(errors[name])
    const [file, setFile] = useState<File | any>();

    const removeImage = (e: any) => {
        e.preventDefault()
        setFile(undefined)
        setValue(name, undefined)
    }

    const onDrop = useCallback(async (acceptedFiles: any) => {
        for (var file of acceptedFiles ?? []) {
            const f = new File([new Uint8Array(await file.arrayBuffer())], file.name, { lastModified: (new Date()).getTime(), type: file.type });
            setValue(name, f)
            setFile(f)
        }
    }, [setValue, name])

    const onChange = (event: any) => {
        const fileUploaded = event.target.files[0];
        setFile(fileUploaded)
        setValue(name, fileUploaded)
    }

    const { getRootProps, getInputProps, inputRef } = useDropzone({
        onDrop,
        onDropRejected: (files, _) => {
            for (const f of files) {
                for (const e of f.errors) {
                    setError(name, { message: e.message })
                }
            }
        },
        accept: {
            'image/jpeg': [],
            'image/png': []
        },
        maxFiles: 1,
        maxSize: 4_000_000, // bytes
    })

    const onSelectFiles = (e: any) => {
        e.preventDefault();
        inputRef.current?.click();
    }

    return (
        <div className='mb-6'>
            {label && (
                <label className="font-medium text-secondary mb-2 block" htmlFor={name}>
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div {...getRootProps()} className="mb-2 ">
                <input {...register(name, { required, onChange })} {...getInputProps()} type="file" style={{ display: 'none' }} />
                <div
                    className={`z-10 w-full h-80 px-4 flex items-center justify-center relative py-11 bg-[#3056D3] bg-opacity-5 border-dashed border rounded-lg transition-all ease-in-out ${isInvalid ? "border-red-300" : "border-[#3056D3]"} transition-all ease-in-out hover:bg-opacity-10`}
                >
                    {(file || currentValue) ? (
                        <>
                            <img src={file ? URL.createObjectURL(file) : currentValue} alt={`blueprint`} className="w-full absolute top-0 left-0 object-cover h-full rounded-lg" />
                            <div className='absolute top-4 right-4 group-transition-all ease-in-out hover:block bg-opacity-25 flex items-center justify-center z-50'>
                                <button onClick={removeImage} className="bg-white p-2 rounded-full transition-all ease-in-out hover:bg-gray-100 shadow-xl">
                                    <ChangeIcon />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col space-y-2 items-center justify-start">
                            <UploadIcon />
                            <p className="text-base leading-normal">Drag & drop or <span onClick={onSelectFiles} className='text-primary transition-all ease-in-out hover:cursor-pointer underline'>browse</span></p>
                        </div>
                    )}

                </div>
            </div>
            <MessageError message={errors[name]?.message} />
        </div>
    )

}

export default ImageUploadSingle;