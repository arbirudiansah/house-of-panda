
import { useRouter } from 'next/router';
import Link from 'next/link';
import React, { FC, Children } from 'react';

interface Props {
    children: any,
    href: any,
    as?: any,
}

const NavLink: FC<Props> = ({ children, href, as }) => {
    const { asPath, pathname } = useRouter()
    const child = Children.only(children)
    const childClassName = child.props.className || ''

    const classList: string[] = ['border-transparent'];

    if (asPath === href || asPath === as) {
        classList.push('font-semibold text-primary');
    }

    const activeClassName = classList.join(' ');
    const className = `${childClassName} border-b-2 ${activeClassName}`.trim();

    return (
        <Link href={href} as={as}>
            {React.cloneElement(child, { className: className })}
        </Link>
    )
}

export default NavLink
