export const DEFAULT_SEO_CONFIG = {
    title: "The First NFT Real Estate Investment Platform",
    titleTemplate: `House of Panda | %s`,
    description: "House of Panda is Indonesia's first NFT real estate investment platform that gives you access to yield, short-term loans",
    openGraph: {
        type: 'article',
        url: process.env.NEXT_PUBLIC_WEB_URL,
        title: "House of Panda",
        site_name: "House of Panda",
        locale: "en_US",
        description: "House of Panda is Indonesia's first NFT real estate investment platform that gives you access to yield, short-term loans",
        images: [
            {
                url: `${process.env.NEXT_PUBLIC_WEB_URL}/img/snapshot.png`,
                width: 600,
                height: 600,
                alt: 'House of Panda',
            },
        ],
    },
    twitter: {
        handle: '@handle',
        site: '@site',
        cardType: 'summary',
    },
    robotProps: {
        nosnippet: true,
        notranslate: true,
        noarchive: true,
        maxSnippet: -1,
    },
}