import classNames from "classnames";
import { FC, useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { MessageError } from "./MessageError";
import Calendar from 'react-calendar';
import useComponentVisible from "../UseVisible";
import moment from "moment";
import { CalendarIcon, RemoveIcon } from "../icons";
import VisibilityIcon from "../icons/VisibilityIcon";

interface FormInputs {
	type: string;
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
	minDate?: Date;
	currentValue?: any;
}

const FormInput: FC<FormInputs> = ({
	type,
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
	minDate,
	currentValue,
}) => {
	const {
		register,
		formState: { errors },
		setValue,
		trigger,
	} = useFormContext();
	const [showPassword, setShowPassword] = useState<boolean>(false);

	const togglePassword = () => {
		setShowPassword(!showPassword);
	};

	const isInvalid = (): boolean => {
		const params = name.split('.')
		if (params.length === 2) {
			const [arg0, arg1] = params
			const field: any | undefined = errors[arg0];
			return field?.[arg1] !== undefined
		}

		return errors[name] !== undefined
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

	const [date, setDate] = useState<Date | undefined>();
	const vis = useComponentVisible(false)

	const onDateSelected = (date: Date) => {
		setDate(date)
		setValue(name, moment(date).format('yyyy-MM-DD'))
		vis.setIsComponentVisible(false)
	}

	const removeDate = (e: any) => {
		e.preventDefault()
		setDate(undefined)
		setValue(name, undefined)
	}

	useEffect(() => {
		if (currentValue) {
			setValue(name, currentValue)
		}
	}, [currentValue, name, setValue])


	return (
		<div className={className}>
			<label className="font-medium text-secondary" htmlFor={name}>
				{label}
				{required && <span className="text-red-500">*</span>}
			</label>

			<div className="relative" ref={vis.ref}>
				{(type === 'date' && vis.isComponentVisible) && (
					<div className="absolute bottom-full z-20 mb-1 right-0">
						<Calendar
							className="bg-red-300 rounded-md p shadow-md"
							onChange={(d) => onDateSelected(d as Date)}
							minDate={minDate}
							value={date} />
					</div>
				)}
				<input
					type={showPassword ? "text" : type === 'date' ? 'text' : type}
					id={name}
					placeholder={type === 'date' ? 'YYYY-MM-DD' : placeholder}
					className={classNames(`mt-2 mb-2 h-11 block focus:ring focus:ring-opacity-50 read-only:cursor-default read-only:bg-gray-50 appearance-none w-full rounded-md shadow-sm`, {
						["border-red-500 invalid:ring-red-200 focus:border-red-500 focus:ring-red-200"]: isInvalid(),
						["border-gray-300 focus:border-gray-300 focus:ring-gray-200"]: !isInvalid(),
						["transition-all ease-in-out hover:cursor-pointer"]: type === 'date',
					})}
					{...register(name, {
						required: required && "This field is required",
						valueAsNumber: type === "number",
						onChange: (_) => {
							trigger(name)
						}
					})}
					readOnly={readOnly || type === 'date'}
					onClick={(type === 'date' && !readOnly) ? vis.toggle : undefined}
				/>
				{type === 'date' ? (
					<div className="w-fit h-6 absolute top-3.5 right-2.5">
						{!date ? <CalendarIcon className="mr-1" /> : (
							<button onClick={removeDate} className="p-0 -mt-1 transition-all ease-in-out hover:opacity-75">
								<RemoveIcon />
							</button>
						)}
					</div>
				) : (
					<>
						{suffix && (
							<div className="w-fit h-6 select-none absolute top-3 right-3">
								{suffix}
							</div>
						)}
					</>
				)}

				{type === "password" && (
					<div className="cursor-pointer" onClick={togglePassword}>
						<VisibilityIcon visible={showPassword} />
					</div>
				)}
			</div>

			{children && <div className="text-gray-500 text-xs">{children}</div>}

			<MessageError message={renderMessage()} />
		</div>
	);
};

export default FormInput;
