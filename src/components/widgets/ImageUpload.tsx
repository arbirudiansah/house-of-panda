/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone'
import { MessageError } from './MessageError';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { UploadIcon } from '../icons';

interface Props {
    name: string;
    label?: string;
    required?: boolean;
    currentImages?: string[];
}

type ImageFile = File[] | string[];

const ImageUploadPreview: React.FC<Props> = ({ name, label, required, currentImages = [] }) => {
    const {
        register,
        formState: { errors },
        control,
        setError,
    } = useFormContext();
    const { remove, insert } = useFieldArray({ control, name });

    const isInvalid = Boolean(errors[name])
    const [files, setFiles] = useState<ImageFile>([...currentImages]);

    const removeImage = (index: number) => {
        let data = [...files] as ImageFile;
        data.splice(index, 1)
        setFiles(data)
        remove(index)
    }

    const onDrop = useCallback(async (acceptedFiles: any) => {
        let data = [...files] as ImageFile;
        for (var file of acceptedFiles ?? []) {
            const f = new File([new Uint8Array(await file.arrayBuffer())], file.name, { lastModified: (new Date()).getTime(), type: file.type });
            data.push(file)
            insert(acceptedFiles.indexOf(file), f);
        }

        setFiles(data)
    }, [files, setFiles, insert])

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
        maxFiles: 4,
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
            <div {...getRootProps()} className="mb-4">
                <input {...register(name)} {...getInputProps()} type="file" style={{ display: 'none' }} multiple />
                <button
                    onClick={onSelectFiles}
                    className={`w-full h-64 px-4 py-11 bg-[#3056D3] bg-opacity-5 border-dashed border rounded-lg transition-all ease-in-out ${isInvalid ? "border-red-300" : "border-[#3056D3]"} transition-all ease-in-out hover:bg-opacity-10`}
                >
                    <div className="flex flex-col space-y-2 items-center justify-start">
                        <UploadIcon />
                        <p className="text-base leading-normal">Drag & drop or <span className='text-primary underline'>browse</span></p>
                    </div>
                </button>
            </div>

            {typeof window !== 'undefined' && (
                <div className='inline-flex space-x-4 items-center justify-start'>
                    {files.map((file, i) => {
                        if (file instanceof File) {
                            return (
                                <div key={i} className="relative rounded-lg group overflow-hidden">
                                    <img src={URL.createObjectURL(file)} alt={`img-${i}`} className="w-60 object-cover min-h-[94px] max-h-36 rounded-lg border-[#3056D3] border-dashed border" />
                                    <div className='w-full h-full group-hover:flex hidden items-center justify-center transition-all ease-in-out bg-black absolute z-10 top-0 bg-opacity-20'>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                removeImage(i);
                                            }}
                                            className='bg-white text-xs rounded-lg px-3 py-2'
                                        >Remove</button>
                                    </div>
                                </div>
                            )
                        }

                        return (
                            <div key={i} className="relative rounded-lg group overflow-hidden">
                                <img src={file} alt={`img-${i}`} className="w-60 object-cover min-h-[94px] max-h-36 rounded-lg border-[#3056D3] border-dashed border" />
                                <div className='w-full h-full group-transition-all group-hover:flex hidden items-center justify-center transition-all ease-in-out bg-black absolute z-10 top-0 bg-opacity-20'>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            removeImage(i);
                                        }}
                                        className='bg-white text-xs rounded-lg px-3 py-2'
                                    >Remove</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
            <MessageError message={errors[name]?.message} />
        </div>
    )

}

export default ImageUploadPreview;