import classNames from "classnames";
import { FC, useEffect, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { MessageError } from "./MessageError";

interface FormCheckboxes {
  label: string;
  name: string;
  required?: boolean;
  className?: string;
  checked?: boolean;
  disabled?: boolean;
  onChecked?: (state: boolean) => void;
  onClick?: () => void;
}

const FormCheckbox: FC<FormCheckboxes> = ({ label, name, className, required = false, checked = false, disabled, onChecked, onClick }) => {
  const { register, formState: { errors }, control } = useFormContext()
  const checkState = useWatch({ control, name, defaultValue: checked })

  return (
    <div className={`inline-flex items-center ${className}`}>
      <input
        type="checkbox"
        id={name}
        disabled={disabled}
        className="hidden"
        {...register(name, {
          required,
          onChange: ({ target: { checked } }) => onChecked?.(checked),
        })}
      />
      <div className="bg-white border-[1.5px] text-primary rounded-md border-primary w-5 h-5 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-primary">
        <svg className={classNames("fill-current transition-all ease-in-out w-3 h-3 text-primary pointer-events-none", {
          ["opacity-0"]: !checkState,
          ["opacity-100"]: checkState,
        })} version="1.1" viewBox="0 0 17 12" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" fillRule="evenodd">
            <g transform="translate(-9 -11)" fill="currentColor" fillRule="nonzero">
              <path d="m25.576 11.414c0.56558 0.55188 0.56558 1.4439 0 1.9961l-9.404 9.176c-0.28213 0.27529-0.65247 0.41385-1.0228 0.41385-0.37034 0-0.74068-0.13855-1.0228-0.41385l-4.7019-4.588c-0.56584-0.55188-0.56584-1.4442 0-1.9961 0.56558-0.55214 1.4798-0.55214 2.0456 0l3.679 3.5899 8.3812-8.1779c0.56558-0.55214 1.4798-0.55214 2.0456 0z" />
            </g>
          </g>
        </svg>
      </div>
      <label htmlFor={name} className="select-none transition-all ease-in-out hover:cursor-pointer text-base">{label}</label>
      <MessageError message={errors[name]} />
    </div>
  );
};

export default FormCheckbox;
