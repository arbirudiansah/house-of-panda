import { FC, ReactNode } from "react";
import { Tooltip } from "react-tooltip";

interface Props {
    children: ReactNode
    content: string
    id: string
    variant?: 'dark' | 'light' | 'success' | 'warning' | 'error' | 'info'
    position?: 'top' | 'left' | 'right' | 'bottom'
}

const HTooltip: FC<Props> = ({ id, children, content, variant = 'light', position }) => {
    return (
        <>
            <a
                className="hover:cursor-pointer hover:opacity-100"
                id={id}
            >
                {children}
            </a>
            <Tooltip
                anchorSelect={`#${id}`}
                content={content}
                variant={variant}
                place={position}
                className="shadow-md text-xs px-3 py-2 rounded bg-opacity-100 bg-white opacity-100"
                style={{ backgroundColor: "#fff", opacity: 1 }}
            />
        </>
    );
}

export default HTooltip;