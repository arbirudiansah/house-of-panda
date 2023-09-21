import { FC } from "react";

const CheckIcon: FC<{ stroke?: string }> = ({ stroke = "#FF3392" }) => (
    <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 6L5.5 10.5L13 1.5" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

export default CheckIcon