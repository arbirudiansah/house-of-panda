import { NextPage } from "next";
import Markdown from "@/components/widgets/MarkdownToHtml";
import Head from "next/head";
import MainNavbar from "@/components/layout/MainNavbar";
import Footer from "@/components/Footer";
import loadMarkdown from "@/lib/utils/loader";

const PrivacyPolicyPage: NextPage<{ contentHtml: string }> = ({ contentHtml }) => {

    return (
        <>
            <Head>
                <title>Privacy Policy | House of Panda</title>
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
    const { contentHtml } = await loadMarkdown('privacy-policy');

    return {
        props: {
            contentHtml,
        },
    };
}

export default PrivacyPolicyPage;