import { NextPage } from "next";
import Markdown from "@/components/widgets/MarkdownToHtml";
import Head from "next/head";
import MainNavbar from "@/components/layout/MainNavbar";
import Footer from "@/components/Footer";
import loadMarkdown from "@/lib/utils/loader";

const TermsPage: NextPage<{ contentHtml: string }> = ({ contentHtml }) => {

    return (
        <>
            <Head>
                <title>Terms and Condition | House of Panda</title>
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
    const { contentHtml } = await loadMarkdown('terms-and-condition');

    return {
        props: {
            contentHtml,
        },
    };
}

export default TermsPage;