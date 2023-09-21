import { useState, FC } from 'react'
import useComponentVisible from '../UseVisible';

interface Props {
    contentHtml: string
}

const Markdown: FC<Props> = ({ contentHtml }) => {
    const menus: string[] = contentHtml.toString().match(/<h2 id="(.*?)">(.*?)<\/h2>/g) ?? [];

    const [currentHash, setCurrentHash] = useState<string | null>(typeof window !== 'undefined' ? window.location.hash : null)
    const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

    const isActive = (hash: string) => {
        if (currentHash === hash) {
            return "font-medium md:font-semibold text-primary bg-gray-50";
        }

        return "font-normal bg-gray-100 text-gray-600 hover:text-primary hover:bg-gray-50";
    }

    const createLink = (input: string, index: number) => {
        const ids = input.match(/id="(.*)"/) ?? [];
        const hash = `#${ids[1]}`;

        return (
            <a key={index}
                onClick={() => {
                    const section = document.querySelector(hash)
                    const top = section?.getBoundingClientRect().top ?? 0
                    window.scrollBy(0, top - 130)

                    setCurrentHash(hash)
                    setIsComponentVisible(false)

                    return
                }}
                className={`px-6 block py-3 lg:py-5 hover:cursor-pointer bg-gray-50 border-b border-gray-200 ${isActive(hash)}`}
            >
                <p className="text-lg">{input.replace(/(<([^>]+)>)/gi, "")}</p>
            </a>
        )
    }

    return (
        <div className="px-4 mt-4 md:mt-0 md:px-24 py-4 md:py-8 mb-10">
            <div className="lg:grid lg:grid-cols-4 mx-0 px-0 lg:gap-8">
                <div className="">
                    <div className="bg-gray-100 border border-gray-100 rounded-lg overflow-hidden w-full fixed lg:sticky top-[68px] md:top-[82px] lg:top-32 z-20 left-0 h-fit">
                        <div ref={ref}>
                            <button
                                onClick={() => setIsComponentVisible(!isComponentVisible)}
                                className="flex items-end justify-between lg:hidden px-6 py-3 w-full"
                            >
                                <h1 className="text-lg font-semibold">On this page</h1>
                                <svg data-accordion-icon className={`w-6 h-6 shrink-0 ${isComponentVisible ? 'rotate-180' : 'rotate-0'}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                            {isComponentVisible && <div className="w-full border-b" />}
                            <>{menus.map(createLink)}</>
                        </div>
                    </div>
                </div>
                <div className="col-span-3">
                    <div
                        dangerouslySetInnerHTML={{ __html: contentHtml }}
                        className="text-[#66716F] mb-4 prose md:prose-h1:text-4xl md:prose-h2:mb-6 md:prose-h2:mt-10 lg:prose-h2:mb-6 lg:prose-h2:mt-10 prose-headings:mb-2 prose-headings:mt-0 lg:prose-headings:mb-2 lg:prose-headings:mt-0 prose-base lg:prose-lg w-full max-w-full"
                    />
                </div>
            </div>
        </div>
    );
}

export default Markdown