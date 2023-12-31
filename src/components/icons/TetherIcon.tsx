import * as React from "react";
import { SVGProps } from "react";

interface Props extends SVGProps<SVGSVGElement> {
    size?: number
}

const TetherIcon = (props: Props) => (
    <svg
        width={props.size ?? 24}
        height={props.size ?? 24}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            d="M23.9785 11.9958C23.9785 18.5904 18.6328 23.9361 12.0382 23.9361C5.44382 23.9361 0.0979099 18.5904 0.0979099 11.9958C0.0979099 5.40131 5.44382 0.0555229 12.0382 0.0555229C18.6328 0.0555229 23.9785 5.40131 23.9785 11.9958Z"
            fill="#26A17B"
        />
        <path
            d="M17.6421 6.07654H6.33588V8.80609H10.6242V12.818H13.3538V8.80609H17.6421V6.07654Z"
            fill="#F3F9FE"
        />
        <path
            d="M12.0149 13.2454C8.46746 13.2454 5.5914 12.6839 5.5914 11.9913C5.5914 11.2987 8.46734 10.7372 12.0149 10.7372C15.5624 10.7372 18.4383 11.2987 18.4383 11.9913C18.4383 12.6839 15.5624 13.2454 12.0149 13.2454ZM19.2275 12.2004C19.2275 11.3072 15.9983 10.5833 12.0149 10.5833C8.03164 10.5833 4.80227 11.3072 4.80227 12.2004C4.80227 12.9869 7.30627 13.6421 10.6244 13.7873V19.5466H13.3537V13.7896C16.6973 13.649 19.2275 12.9909 19.2275 12.2004Z"
            fill="#F3F9FE"
        />
    </svg>
);

export default TetherIcon;