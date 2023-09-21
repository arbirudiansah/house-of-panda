import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { FC } from "react";

const variants = {
    fadeIn: {
        opacity: 0,
        transition: {
            duration: 0.55,
            ease: "easeInOut"
        }
    },
    inactive: {
        opacity: 1,
        transition: {
            duration: 0.55,
            ease: "easeInOut"
        }
    },
    fadeOut: {
        opacity: 0,
        transition: {
            duration: 0.55,
            ease: "easeInOut"
        }
    }
};

const Transition: FC<{ children: any }> = ({ children }) => {
    let { pathname } = useRouter();

    const createKey = () => {
        if (pathname.startsWith("/dashboard")) {
            return '/dashboard';
        }

        return pathname
    }

    return (
        <AnimatePresence initial={true}>
            <motion.div
                key={createKey()}
                variants={variants}
                initial="fadeIn"
                animate="inactive"
                exit="fadeOut"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
};

export default Transition;
