import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href="/favicon.svg" />
          <meta content={`${process.env.NEXT_PUBLIC_WEB_URL}/img/snapshot.png`} itemProp="image" />
          <meta content={`${process.env.NEXT_PUBLIC_WEB_URL}/img/snapshot.png`} property="og:image" />
          <meta content="400" property="og:image:width" />
          <meta content="400" property="og:image:height" />
          <meta property="og:image:type" content="image/png" />
        </Head>
        <body>
          <link itemProp="thumbnailUrl" href={`${process.env.NEXT_PUBLIC_WEB_URL}/img/snapshot.png`} />
          <span itemProp="thumbnail" itemScope itemType="http://schema.org/ImageObject">
            <link itemProp="url" href={`${process.env.NEXT_PUBLIC_WEB_URL}/img/snapshot.png`} />
          </span>
          <div id="modal-root" />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;


