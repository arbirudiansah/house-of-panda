import { motion, AnimatePresence } from "framer-motion";
import React, { FC } from "react";

const variants = {
    fadeIn: {
        opacity: 0,
        // scale: 0.9,
        transition: {
            duration: 0.55,
            ease: "easeInOut"
        }
    },
    inactive: {
        opacity: 1,
        // scale: 1,
        transition: {
            duration: 0.55,
            ease: "easeInOut"
        }
    },
    fadeOut: {
        opacity: 0,
        // scale: 0.9,
        transition: {
            duration: 0.55,
            ease: "easeInOut"
        }
    }
};

const FadeTransition: FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <AnimatePresence initial={true}>
            <motion.div
                variants={variants}
                initial="fadeIn"
                animate="inactive"
                exit="fadeOut"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

export default FadeTransition;
