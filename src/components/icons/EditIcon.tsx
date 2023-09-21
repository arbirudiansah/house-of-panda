import { FC } from "react"

const EditIcon: FC<{ fill?: string }> = ({ fill = '#FF3392' }) => {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.4688 13.6953H1.53125C1.22012 13.6953 0.96875 13.9467 0.96875 14.2578V14.8906C0.96875 14.968 1.03203 15.0312 1.10938 15.0312H14.8906C14.968 15.0312 15.0312 14.968 15.0312 14.8906V14.2578C15.0312 13.9467 14.7799 13.6953 14.4688 13.6953ZM3.52988 12.2188C3.56504 12.2188 3.6002 12.2152 3.63535 12.21L6.59199 11.6914C6.62715 11.6844 6.66055 11.6686 6.68516 11.6422L14.1365 4.19082C14.1528 4.17456 14.1657 4.15524 14.1746 4.13398C14.1834 4.11271 14.1879 4.08992 14.1879 4.06689C14.1879 4.04387 14.1834 4.02108 14.1746 3.99981C14.1657 3.97855 14.1528 3.95923 14.1365 3.94297L11.215 1.01973C11.1816 0.986328 11.1377 0.96875 11.0902 0.96875C11.0428 0.96875 10.9988 0.986328 10.9654 1.01973L3.51406 8.47109C3.4877 8.49746 3.47187 8.5291 3.46484 8.56426L2.94629 11.5209C2.92919 11.6151 2.9353 11.712 2.96409 11.8033C2.99288 11.8945 3.04349 11.9774 3.11152 12.0447C3.22754 12.1572 3.37344 12.2188 3.52988 12.2188Z" fill={fill} />
        </svg>
    )
}

export default EditIcon