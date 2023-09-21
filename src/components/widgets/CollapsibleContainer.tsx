import classNames from "classnames";
import { FC, ReactNode, useEffect, useState } from "react";
import FadeTransition from "../animations/FadeTransition";
import { ArrowUpIcon } from "../icons";

const CollapsibleContainer: FC<{ children: ReactNode, title: string, expanded?: boolean }> = ({ children, title, expanded = true }) => {
    const [show, setShow] = useState(expanded)

    useEffect(() => {
        const handleResize = () => {
            setShow(window.innerWidth >= 720)
        }

        handleResize()

        window.addEventListener("resize", handleResize)
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])


    return (
        <div className="border rounded-lg overflow-hidden">
            <div onClick={() => setShow(!show)} className={classNames("select-none py-[16px] px-[24px] flex justify-between items-center cursor-pointer", {
                ["border-b"]: show,
            })}>
                <h2 className="font-semibold text-xl text-secondary">{title}</h2>
                <div className={classNames("transition-all ease-in", { ["rotate-180"]: !show })}><ArrowUpIcon /></div>
            </div>
            {show && (
                <FadeTransition>
                    {children}
                </FadeTransition>
            )}
        </div>
    );
}

export default CollapsibleContainer;