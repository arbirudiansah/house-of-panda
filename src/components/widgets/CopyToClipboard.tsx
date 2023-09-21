import classNames from "classnames";
import React, { FC, useState } from "react";

const CopyToClipboard: FC<{ children: React.ReactNode, className?: string, data: string }> = ({ children, className, data }) => {
    const [show, setShow] = useState(false)

    const onCopy = () => {
        navigator.clipboard.writeText(data)
        setShow(true)

        setTimeout(() => {
            setShow(false)
        }, 3000);
    }

    return (
        <div onClick={onCopy} className={classNames(className, 'relative hover:cursor-pointer')}>
            {children}
            {show && (
                <div id="tooltip" className="absolute w-[130px] -top-1 ml-4 left-full p-2 text-xs leading-none rounded-md text-white bg-primary bg-opacity-75">
                    Copied to clipboard!
                </div>
            )}
        </div>
    );
}

export default CopyToClipboard;