import * as React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { wrap } from "popmotion"
import Image from "next/image"
import classNames from "classnames"

const variants = {
    enter: (direction: number) => {
        return {
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.5,
        }
    },
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
        scale: 1,
    },
    exit: (direction: number) => {
        return {
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0.5,
            scale: 0.5
        }
    }
}

/**
 * Experimenting with distilling swipe offset and velocity into a single variable, so the
 * less distance a user has swiped, the more velocity they need to register as a swipe.
 * Should accomodate longer swipes and short flicks without having binary checks on
 * just distance thresholds and velocity > 0.
 */
const swipeConfidenceThreshold = 1000
const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
}

const ImageSlider: React.FC<{ images: string[] }> = ({ images }) => {
    const [[page, direction], setPage] = useState([0, 0])

    // We only have 3 images, but we paginate them absolutely (ie 1, 2, 3, 4, 5...) and
    // then wrap that within 0-2 to find our image ID in the array below. By passing an
    // absolute page index as the `motion` component's `key` prop, `AnimatePresence` will
    // detect it as an entirely new image. So you can infinitely paginate as few as 1 images.
    const imageIndex = wrap(0, images.length, page)

    const paginate = (newDirection: number) => {
        setPage([page + newDirection, newDirection])
    }

    return (
        <div>
            <div className="relative w-full h-[220px] md:h-[435px] overflow-hidden">
                <AnimatePresence initial={false} custom={direction}>
                    <motion.img
                        key={page}
                        src={images[imageIndex]}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.1 },
                            scale: { duration: 0.3 },
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        className="rounded-lg w-full transition-all ease-in-out bg-slate-100 h-full object-cover absolute"
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = swipePower(offset.x, velocity.x)

                            if (swipe < -swipeConfidenceThreshold) {
                                paginate(1)
                            } else if (swipe > swipeConfidenceThreshold) {
                                paginate(-1)
                            }
                        }}
                    />
                </AnimatePresence>
                <div className="next shadow-md hover:opacity-70 transition-all ease-in-out right-4" onClick={() => paginate(1)}>
                    {"‣"}
                </div>
                <div className="prev shadow-md hover:opacity-70 transition-all ease-in-out left-4" onClick={() => paginate(-1)}>
                    <span className="rotate rotate-180">{"‣"}</span>
                </div>
            </div>
            <div className="grid grid-cols-4 justify-between gap-[8px] mt-[8px] overflow-x-auto">
                {images.map((src, i) => (
                    <div
                        key={i}
                        className={classNames(
                            "rounded-md border overflow-hidden h-[60px] md:h-[120px] cursor-pointer hover:opacity-90 bg-slate-100 w-full transition-all ease-in-out",
                            {
                                ["border-transparent"]: imageIndex !== i,
                                ["border-primary"]: imageIndex === i,
                            }
                        )}
                        onClick={() => {
                            let x = i
                            if (i < imageIndex) {
                                x = -(i)
                            }

                            setPage([i, x])
                        }}>
                        <Image
                            width="100%"
                            height="100%"
                            src={src}
                            layout="responsive"
                            objectFit="cover"
                            objectPosition="center"
                            alt={`img-${i}`}
                            quality={50}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ImageSlider