import HopLogo from "@/components/icons/HopLogo";
import Button from "@/components/widgets/Button";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";

const Page404 = () => {
    const router = useRouter()
    return (
        <>
            <NextSeo title="404: This page could not be found." />
            <div className="bg-black w-screen h-screen flex flex-col gap-8 items-center justify-center">
                <HopLogo white fill="#fff" width={80} height={80} />
                <div className="flex justify-center text-white items-center divide-x gap-4">
                    <h1 className="text-2xl font-medium">404</h1>
                    <h1 className="text-base pl-4">This page could not be found.</h1>
                </div>
                <Button title="Back to Homepage" className="py-2 px-3.5" onClick={() => router.push('/')} />
            </div>
        </>
    );
}

export default Page404;