/* eslint-disable @next/next/no-img-element */
import Contact from "@/components/about/Contact"
import OnViewTransition, { variant } from "@/components/animations/OnViewTransition"
import Footer from "@/components/Footer"
import MainNavbar from "@/components/layout/MainNavbar"
import Button from "@/components/widgets/Button"
import ConnectWallet from "@/components/widgets/ConnectWallet"
import OutlinedButton from "@/components/widgets/OutlinedButton"
import { modal } from "@/lib/store/slices/modal"
import { AnimatePresence } from "framer-motion"
import Head from "next/head"

const AboutPage = () => {
    const connect = async () => {
        modal.showModal(<ConnectWallet />)
    }

    return (
        <>
            <Head>
                <title>About Us | House of Panda</title>
            </Head>

            <AnimatePresence initial>
                <MainNavbar />
                <main className="mt-4 md:mt-0 py-4 md:py-8 md:pb-0 overflow-x-hidden">
                    <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 items-center gap-8 lg:gap-16 px-4 lg:px-36 mb-8 lg:mb-16">
                        <OnViewTransition variants={variant.fadeInRight} key="about-1">
                            <div className="pr-0 md:pr-20">
                                <div className="inline-flex space-x-3 items-center justify-start mb-3">
                                    <div className="w-8 h-[3px] bg-primary">&nbsp;</div>
                                    <p className="text-lg font-medium leading-relaxed text-primary">About Us</p>
                                </div>
                                <p className="text-2xl md:text-4xl font-bold mb-6">Delivering the dreams of<br />property ownership everywhere. <br /><span className="text-primary">Welcome to House of Panda.</span></p>
                                <p className="text-base md:text-lg leading-relaxed text-gray-400 mb-4">Originating from an idea to bridge +75% of Indonesians that can&apos;t get a loan*, we&apos;re here to make real estate financing better for everyone.</p>
                                <div className="w-fit pl-2 pr-2.5 pt-0.5 pb-1 bg-gray-100">
                                    <p className="text-base leading-snug text-gray-400">*Based on IDN Times Report 2022</p>
                                </div>
                            </div>
                        </OnViewTransition>
                        <OnViewTransition variants={variant.fadeInLeft} key="about-img1">
                            <div className="flex justify-center p-0 md:p-4">
                                <img src={'/img/about-1.png'} alt="about" className="w-full" />
                            </div>
                        </OnViewTransition>
                    </div>
                    <OnViewTransition transition={{ delay: 0.9 }} key="blkq">
                        <div className="relative prose prose-base md:prose-lg lg:prose-xl max-w-full bg-primary after:content-[''] after:absolute after:bg-primary after:w-screen after:h-full after:-z-10 after:-left-[64px] after:top-0">
                            <div className="relative text-center py-10 md:py-20 z-10 px-4 lg:px-0 ">
                                <OnViewTransition transition={{ delay: 1.3 }} key="blkq1">
                                    <h3 className="font-medium leading-10 text-white my-0 md:my-0 lg:my-0">IDN Times Report 2022</h3>
                                </OnViewTransition>
                                <OnViewTransition transition={{ delay: 1.5 }} key="blkq2">
                                    <div className="w-[177px] h-[3px] bg-white mx-auto my-4 md:my-10">&nbsp;</div>
                                </OnViewTransition>
                                <OnViewTransition transition={{ delay: 1.9 }} key="blkq3">
                                    <h3 className="my-0 md:my-0 lg:my-0 font-semibold text-center text-white max-w-7xl mx-auto">“Financial inclusion is a challenge in Indonesia, as a large part of the population (76.1%) is still deemed unbanked – having no access to financial products or services due to their socio-economic background or geographical obstacle.”</h3>
                                </OnViewTransition>
                            </div>
                            <div className="absolute w-[calc(100vw/3)] h-full top-0 left-0 inline-flex -z-1">
                                <div className="w-1/2 h-full bg-gradient-to-b from-[#FF4DA0] to-transparent" />
                                <div className="w-1/2 h-full bg-gradient-to-b to-[#FF4DA0] from-transparent" />
                            </div>
                            <div className="absolute w-[calc(100vw/3)] h-full top-0 right-0 inline-flex -z-1">
                                <div className="w-1/2 h-full bg-gradient-to-b from-[#FF4DA0] to-transparent" />
                                <div className="w-1/2 h-full bg-gradient-to-b to-[#FF4DA0] from-transparent" />
                            </div>
                        </div>
                    </OnViewTransition>
                    <div className="prose prose-base md:prose-lg lg:prose-xl max-w-full w-full px-4 lg:px-10 text-secondary py-4 lg:py-20">
                        <div className="max-w-7xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-16 items-center">
                                <div>
                                    <OnViewTransition transition={{ delay: 0.9 }} variants={variant.fadeInRight} key="about-2">
                                        <img className="rounded-lg w-full h-fit my-0 md:my-6" src="/img/about-2.png" alt="" />
                                    </OnViewTransition>
                                </div>
                                <div>
                                    <OnViewTransition transition={{ delay: 1.3 }} variants={variant.fadeInLeft} key="about-3">
                                        <h3 className="font-semibold leading-normal text-primary mt-0 md:mt-0 lg:mt-0">Why Choose Us</h3>
                                        <h2 className="font-bold leading-10 capitalize">House for all. Supported by all. All in one platform.</h2>
                                        <p className="leading-normal text-gray-500">Investors, lenders and borrowers can transact real estate investment without the need to go to other parties, making your transaction seamless and simple.</p>
                                    </OnViewTransition>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-16">
                                <div>
                                    <OnViewTransition transition={{ delay: 1.5 }} variants={variant.fadeInRight} key="about-4">
                                        <h2 className="font-bold leading-10 capitalize">A simpler system that benefits everyone</h2>
                                        <h3 className="font-semibold leading-normal text-primary">Investors</h3>
                                        <p className="leading-normal text-gray-500">Receive full access and transparency into investment prospects on a simple platform that makes it simple to diversify and organise your investments.</p>
                                    </OnViewTransition>
                                    <OnViewTransition transition={{ delay: 1.9 }} variants={variant.fadeInRight} key="about-5">
                                        <h3 className="font-semibold leading-normal text-primary">Borrowers</h3>
                                        <p className="leading-normal text-gray-500">Giving borrowed funding options can help them have choices to fund their property project, either by renting a property or flipping a property.</p>
                                        <p className="leading-normal text-gray-500">Borrowers can get a diverse liquidity pool while connecting them with potential buyers, making it easier for them to grow and focus on finishing the property.</p>
                                        <p className="leading-normal text-gray-500">Access diverse capital sources to help them grow faster, with streamlined loan lifecycle management so they can focus on their borrowers.</p>
                                    </OnViewTransition>
                                    <OnViewTransition transition={{ delay: 2.3 }} variants={variant.fadeInRight} key="about-6">
                                        <h3 className="font-semibold leading-normal text-primary">Communities</h3>
                                        <p className="leading-normal text-gray-500">Your funds help more people afford houses, which can help local community growth, both economically and socially, across the archipelago.</p>
                                    </OnViewTransition>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-1 items-end justify-start gap-4 md:gap-0">
                                    <OnViewTransition transition={{ delay: 1.7 }} variants={variant.fadeInLeft} key="about-i-4">
                                        <img className="rounded-lg w-full h-fit my-0 md:my-6" src="/img/about-3.png" alt="" />
                                    </OnViewTransition>
                                    <OnViewTransition transition={{ delay: 2.1 }} variants={variant.fadeInLeft} key="about-i-4">
                                        <img className="rounded-lg w-full h-fit my-0 md:my-6" src="/img/about-4.png" alt="" />
                                    </OnViewTransition>
                                    <OnViewTransition transition={{ delay: 2.5 }} variants={variant.fadeInLeft} key="about-i-4">
                                        <img className="rounded-lg w-full h-fit my-0 md:my-6" src="/img/about-5.png" alt="" />
                                    </OnViewTransition>
                                </div>
                            </div>
                            <div className="w-full overflow-hidden bg-secondary relative px-4 py-10 lg:py-28 flex flex-col gap-6 mt-10 rounded-3xl">
                                <div className="relative z-10">
                                    <OnViewTransition>
                                        <h4 className="text-center text-2xl lg:text-4xl font-medium text-white mt-0 md:mt-0 lg:mt-0">
                                            Enjoy Additional Perks with Investors<br />Who Already Join In
                                        </h4>
                                    </OnViewTransition>
                                    <OnViewTransition transition={{ delay: 0.6 }}>
                                        <Button onClick={connect} title="Get Started" className="mx-auto font-semibold" />
                                    </OnViewTransition>
                                </div>
                                <div className="absolute w-[calc(100vw/5)] h-full top-0 left-0 inline-flex -z-1">
                                    <div className="w-1/2 h-full bg-gradient-to-b from-[#4d4d71] to-transparent" />
                                    <div className="w-1/2 h-full bg-gradient-to-b to-[#4d4d71] from-transparent" />
                                </div>
                                <div className="absolute w-[calc(100vw/5)] h-full top-0 right-0 inline-flex -z-1">
                                    <div className="w-1/2 h-full bg-gradient-to-b from-[#4d4d71] to-transparent" />
                                    <div className="w-1/2 h-full bg-gradient-to-b to-[#4d4d71] from-transparent" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <Team key="team" /> */}

                    {/* <Supporter key="supporter" /> */}

                    <div className="mx-auto max-w-7xl px-4 lg:px-0">
                        <Contact key="contact" />
                    </div>
                </main>
                <Footer />
            </AnimatePresence>
        </>
    )
}

export default AboutPage;