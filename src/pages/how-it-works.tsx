import Footer from "@/components/Footer"
import OnViewTransition from "@/components/animations/OnViewTransition"
import MainNavbar from "@/components/layout/MainNavbar"
import Markdown from "@/components/widgets/MarkdownToHtml"
import OutlinedButton from "@/components/widgets/OutlinedButton"
import { NextPage } from "next"
import Head from "next/head"
import loadMarkdown from "@/utils/loader"

const HiwPage: NextPage<{ contentHtml: string }> = ({ contentHtml }) => {
    return (
        <>
            <Head>
                <title>How it Works | House of Panda</title>
            </Head>
            <div>
                <MainNavbar />

                <Markdown contentHtml={contentHtml} />

                {/* <div className="w-full mb-10">
                    <button type="button" className="py-2 px-5 text-lg font-semibold text-white rounded-lg w-fit bg-primary transition-all ease-in-out hover:bg-opacity-75 flex items-center space-x-2 mx-auto">
                            Prep me up!
                    </button>
                </div> */}
                <div className="w-full bg-primary relative px-4 py-10 lg:py-20 flex flex-col gap-6 after:content-[''] after:absolute after:bg-primary lg:after:w-screen after:h-full after:-z-10 after:-left-[64px] after:top-0">
                    <OnViewTransition>
                        <h4 className="text-center text-2xl lg:text-4xl font-medium text-white">
                            Start your journey along with others<br /> who already HOP into real estate investing.
                        </h4>
                    </OnViewTransition>
                    <OnViewTransition transition={{ delay: 0.6 }}>
                        <OutlinedButton title="Prep me up!" className="mx-auto font-semibold bg-white hover:bg-secondary text-primary" />
                    </OnViewTransition>
                </div>
                <Footer />
            </div>
        </>
    );
}

export async function getStaticProps() {
    const { contentHtml } = await loadMarkdown('how-it-works');

    return {
        props: {
            contentHtml,
        },
    };
}

export default HiwPage;