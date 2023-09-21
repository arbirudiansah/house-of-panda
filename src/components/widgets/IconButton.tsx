import { FC } from "react";

interface Props {
    title?: string;
    color?: string;
    disabled?: boolean;
    loading?: boolean;
    onClick?: (event: any) => void;
    secondary?: boolean;
    width?: string;
    type: 'success' | 'warning' | 'danger' | 'secondary',
    icon: JSX.Element,
    border?: boolean;
    children?: any;
}

const IconButton: FC<Props> = ({ title, disabled, border = true, loading, onClick, width = "w-40", type, icon, children }) => {

    let className = `hover:bg-success border-success`;
    if (type === 'warning') {
        className = 'hover:bg-warning border-warning';
    } else if (type === 'danger') {
        className = 'hover:bg-danger border-danger';
    } else if (type === 'secondary') {
        className = 'border-transparent hover:bg-secondary';
    }

    let borderStyle = 'border';
    if (!border) {
        borderStyle = 'border-none';
    }

    return (
        <button
            type="submit"
            onClick={onClick}
            disabled={disabled || loading}
            className={`rounded flex justify-center items-center space-x-2 ${borderStyle} text-${type} hover:bg-opacity-10 ${className} ${width} text-sm py-2 px-4`}
        >
            <div>{icon}</div>
            {title && <span>{title}</span>}
            {children && children}
        </button>
    );
};

export default IconButton;

