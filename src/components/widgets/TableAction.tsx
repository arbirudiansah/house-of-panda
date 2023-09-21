
import { FC } from "react";
import { DotsIcon } from "../icons";
import useComponentVisible from "../UseVisible";

interface MenuItem {
    label: string;
    onClick: () => void;
}

interface Props {
    onDelete?: () => void;
    onEdit: () => void;
    onDetail: () => void;
    menus?: MenuItem[]
}

const TableAction: FC<Props> = ({ onDelete, onEdit, onDetail, menus }) => {
    const itemClasses = "w-full px-3 text-left py-2.5 hover:bg-slate-300 transition-all ease-in-out hover:rounded-md hover:cursor-pointer text-secondary"
    const vis = useComponentVisible(false)
    return (
        <div className="relative text-[#374957] overflow-visible z-20 w-fit" ref={vis.ref}>
            <button className="hover:bg-slate-300 p-2 rounded-md transition-all ease-in-out" onClick={vis.toggle}><DotsIcon /></button>
            {vis.isComponentVisible && (
                <div className="w-44 h-fit py-3 px-2 bg-white shadow-menu rounded-md right-full top-0 z-50 absolute">
                    <div className={itemClasses} onClick={() => {
                        onDetail()
                        vis.setIsComponentVisible(false)
                    }}>
                        <p className="text-base font-medium leading-normal">View Detail</p>
                    </div>
                    <div className={itemClasses} onClick={() => {
                        onEdit()
                        vis.setIsComponentVisible(false)
                    }}>
                        <p className="text-base font-medium leading-normal">Edit</p>
                    </div>
                    {onDelete && (
                        <div className={itemClasses} onClick={() => {
                            onDelete()
                            vis.setIsComponentVisible(false)
                        }}>
                            <p className="text-base font-medium leading-normal">Delete</p>
                        </div>
                    )}
                    {menus && (
                        <div className="my-1">
                            <hr />
                        </div>
                    )}
                    {menus?.map((m, i) => {
                        return (
                            <div key={i} className={itemClasses} onClick={() => {
                                m.onClick()
                                vis.setIsComponentVisible(false)
                            }}>
                                <p className="text-base font-medium leading-normal">{m.label}</p>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
}

export default TableAction;