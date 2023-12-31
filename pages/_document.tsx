import createEmotionServer from '@emotion/server/create-instance';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import * as React from 'react';

import { texts } from '../src/ui/utils/texts';
import { createEmotionCache } from '../src/ui/utils/themeMUI';

const scriptForIpfs = `
(function () {
  const { pathname } = window.location
  const ipfsMatch = /.*\\/Qm\\w{44}\\//.exec(pathname)
  const base = document.createElement('base')

  base.href = ipfsMatch ? ipfsMatch[0] : '/'
  document.head.append(base)

  let favicon = document.querySelector("link[rel~='icon']");
  if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
  }
  favicon.href = ipfsMatch ? ipfsMatch[0] + '/favicon.ico' : '/favicon.ico';

  let manifest = document.querySelector("link[rel~='manifest']");
  if (!manifest) {
      manifest = document.createElement('link');
      manifest.rel = 'manifest';
      document.head.appendChild(manifest);
  }
  manifest.href = ipfsMatch ? ipfsMatch[0] + '/manifest.json' : '/manifest.json';
})();`;

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />

          <script dangerouslySetInnerHTML={{ __html: scriptForIpfs }} />

          <title>Aave - Governance</title>
          <meta
            name="description"
            content={texts.meta.proposalListMetaDescription}
            key="description"
          />
          <meta
            property="og:title"
            content={`${texts.meta.main}${texts.meta.proposalListMetaTitle}`}
            key="title"
          />
          <meta
            property="og:description"
            content={texts.meta.proposalListMetaDescription}
            key="ogdescription"
          />
          <meta property="twitter:card" content="summary" key="twittercard" />
          <meta
            name="twitter:title"
            content={`${texts.meta.main}${texts.meta.proposalListMetaTitle}`}
            key="twittertitle"
          />
          <meta
            name="twitter:description"
            content={texts.meta.proposalListMetaDescription}
            key="twitterdescription"
          />
          <meta name="keywords" key="keywords" content={texts.meta.keywords} />

          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap"
            rel="stylesheet"
          />

          {
            // Inject MUI styles first to match with the prepend: true configuration.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this.props as any).emotionStyleTags
          }
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  const originalRenderPage = ctx.renderPage;

  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      enhanceApp: (App: any) =>
        function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />;
        },
    });

  const initialProps = await Document.getInitialProps(ctx);
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    emotionStyleTags,
  };
};
