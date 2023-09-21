import path from "path";
import fs from "fs";
import remarkParse from 'remark-parse'
import remarkHtml from 'remark-html'
import matter from 'gray-matter';
import { unified } from "unified";
import { remarkHeadingId } from 'remark-custom-heading-id';

const mdDirectory = path.join(process.cwd(), 'markdown');

export default async function loadMarkdown(id: string) {
    const fullPath = path.join(mdDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Use remark to convert markdown into HTML string
    const processedContent = await unified()
        .use(remarkParse)
        // @ts-ignore
        .use(remarkHtml)
        .use(remarkHeadingId)
        .process(matterResult.content);
    const contentHtml = processedContent.toString();

    // Combine the data with the id and contentHtml
    return {
        contentHtml,
        ...matterResult.data,
    };
}
