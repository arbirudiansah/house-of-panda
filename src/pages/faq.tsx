import { NextPage } from "next";
// import tos from "@/markdown/faq.md"
import Markdown from "@/components/widgets/MarkdownToHtml";
import Head from "next/head";
import MainNavbar from "@/components/layout/MainNavbar";
import Footer from "@/components/Footer";
import loadMarkdown from "@/lib/utils/loader";

const FaqPage: NextPage<{ contentHtml: string }> = ({ contentHtml }) => {
    return (
        <>
            <Head>
                <title>FAQ | House of Panda</title>
            </Head>
            <div>
                <MainNavbar />

                <Markdown contentHtml={contentHtml} />

                <Footer />
            </div>
        </>
    );
}

export async function getStaticProps() {
    const { contentHtml } = await loadMarkdown('faq');

    return {
        props: {
            contentHtml,
        },
    };
}

export default FaqPage;