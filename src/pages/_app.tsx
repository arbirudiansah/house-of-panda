import Modal from '@/components/Modal'
import Transition from '@/components/animations/Transition'
import { DEFAULT_SEO_CONFIG } from '@/config'
import store from '@/lib/store'
import { DefaultSeo } from 'next-seo'
import type { AppProps } from 'next/app'
import { GoogleAnalytics } from 'nextjs-google-analytics'
import NextNProgress from 'nextjs-progressbar'
import { Provider } from 'react-redux'
import FlashMessage from '@/components/widgets/FlashMessage'
import Web3Wrapper from '@/components/Web3Wrapper'
import "@/lib/utils/extensions"

import "react-multi-carousel/lib/styles.css"
import '@/styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <>
      <GoogleAnalytics trackPageViews={{ ignoreHashChange: true }} />
      <NextNProgress color="#FF3392" />

      <div suppressHydrationWarning>
        <DefaultSeo {...DEFAULT_SEO_CONFIG} />
        <Provider store={store}>
          <Web3Wrapper>
            <Modal />
            <FlashMessage />
            <Transition>
              <Component {...pageProps} />
            </Transition>
          </Web3Wrapper>
        </Provider>
      </div>
    </>
  )
}

export default MyApp


