/* eslint-disable @next/next/no-img-element */
import { faker } from "@faker-js/faker";
import { useMemo } from "react";
import Carousel from "react-multi-carousel";
import OnViewTransition from "../animations/OnViewTransition";

const Supporter = () => {
    const responsive = useMemo(() => ({
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 5,
            paritialVisibilityGutter: 60
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 3,
            paritialVisibilityGutter: 50
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            paritialVisibilityGutter: 30
        }
    }), [])

    return (
        <div className="w-full bg-[#F9F9F9] relative py-10 flex flex-col gap-6 mt-6 after:content-[''] after:absolute after:bg-[#F9F9F9] after:w-screen after:h-full after:-z-10 after:-left-[64px] after:top-0" suppressHydrationWarning>
            <div className="px-4 lg:px-0 inline-flex items-center justify-center space-x-12">

                <Carousel
                    ssr={false}
                    additionalTransfrom={0}
                    arrows={false}
                    containerClass={`w-full`}
                    autoPlay
                    autoPlaySpeed={3000}
                    centerMode={false}
                    draggable
                    focusOnSelect={false}
                    infinite
                    itemClass="flex justify-center items-center hover:cursor-move select-none"
                    keyBoardControl
                    minimumTouchDrag={80}
                    pauseOnHover
                    renderArrowsWhenDisabled={false}
                    renderButtonGroupOutside={false}
                    renderDotsOutside={false}
                    responsive={responsive}
                    rewind={false}
                    rewindWithAnimation={false}
                    rtl={false}
                    shouldResetAutoplay
                    showDots={false}
                    slidesToSlide={1}
                    swipeable
                >
                    {[...Array(6)].map((_, idx) => {
                        return (
                            <img
                                key={idx}
                                draggable={false}
                                width={210}
                                height="auto"
                                src={`https://templates.hibootstrap.com/zinka/default/assets/img/brand/brand-logo${idx + 1}.png`}
                                alt={faker.company.name()}
                            />
                        );
                    })}
                </Carousel>
            </div>
        </div>
    )
}

export default Supporter;