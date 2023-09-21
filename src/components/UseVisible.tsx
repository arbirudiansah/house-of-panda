import { useState, useEffect, useRef } from 'react';

const useComponentVisible = (initialIsVisible: boolean) => {
    const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible);
    const ref = useRef<any>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setIsComponentVisible(false);
        }
    };

    const toggle = () => {
        setIsComponentVisible(!isComponentVisible)
    }

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    return { ref, toggle, isComponentVisible, setIsComponentVisible };
}

export default useComponentVisible;