import { getProjectList } from "@/lib/repository/ProjectRepository";
import IProject from "@/lib/types/Project";
import moment from "moment";
import { GetServerSidePropsContext } from "next";


function generateSiteMap(posts: IProject[]) {
    const baseUrl = process.env.NEXT_PUBLIC_WEB_URL

    return `<?xml version="1.0" encoding="UTF-8"?>
        <?xml-stylesheet type="text/xsl" href="https://gist.githubusercontent.com/vitobotta/889526/raw/160a7bcd516021092397ad0ebd1de8c161f05030/XSL%2520for%2520site%2520map.xsl"?>
        <urlset xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            <url>
                <loc>${baseUrl}</loc>
                <lastmod>${moment().format("yyyy-MM-DDTHH:mm:ssZ")}</lastmod>
                <changefreq>Monthly</changefreq>
                <priority>1</priority>
            </url>
            <url>
                <loc>${baseUrl}/about-us</loc>
                <lastmod>${moment().format("yyyy-MM-DDTHH:mm:ssZ")}</lastmod>
                <changefreq>Monthly</changefreq>
                <priority>1</priority>
            </url>
            <url>
                <loc>${baseUrl}/project/explore</loc>
                <lastmod>${moment().format("yyyy-MM-DDTHH:mm:ssZ")}</lastmod>
                <changefreq>Monthly</changefreq>
                <priority>1</priority>
            </url>
            <url>
                <loc>${baseUrl}/how-it-works</loc>
                <lastmod>${moment().format("yyyy-MM-DDTHH:mm:ssZ")}</lastmod>
                <changefreq>Monthly</changefreq>
                <priority>1</priority>
            </url>
            <url>
                <loc>${baseUrl}/privacy-policy</loc>
                <lastmod>${moment().format("yyyy-MM-DDTHH:mm:ssZ")}</lastmod>
                <changefreq>Monthly</changefreq>
                <priority>1</priority>
            </url>
            <url>
                <loc>${baseUrl}/terms-and-condition</loc>
                <lastmod>${moment().format("yyyy-MM-DDTHH:mm:ssZ")}</lastmod>
                <changefreq>Monthly</changefreq>
                <priority>1</priority>
            </url>
            <url>
                <loc>${baseUrl}/faq</loc>
                <lastmod>${moment().format("yyyy-MM-DDTHH:mm:ssZ")}</lastmod>
                <changefreq>Monthly</changefreq>
                <priority>1</priority>
            </url>
            ${posts.map(({ id, createdAt }) => (`
                <url>
                    <loc>${`${baseUrl}/project/${id}`}</loc>
                    <lastmod>${moment(createdAt).format("yyyy-MM-DDTHH:mm:ssZ")}</lastmod>
                    <changefreq>Daily</changefreq>
                    <priority>1</priority>
                </url>
            `)).join('')}
        </urlset>
 `.trim();
}

const SiteMap = () => {
    // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }: GetServerSidePropsContext) {
    const result = await getProjectList({
        active: true,
        limit: 10,
        offset: 0,
    })

    // We generate the XML sitemap with the posts data
    const sitemap = generateSiteMap(result.entries);

    res.setHeader('Content-Type', 'text/xml');
    // we send the XML to the browser
    res.write(sitemap);
    res.end();

    return {
        props: {},
    };
}

export default SiteMap;