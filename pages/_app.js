import '../styles/globals.css'
import '../styles/Jumbotron.css'
import '../styles/Modal.css'

import {createClient, configureChains, defaultChains, WagmiConfig} from 'wagmi'
import {publicProvider} from 'wagmi/providers/public'
import {SessionProvider} from 'next-auth/react'
import {Toaster} from 'sonner'
import {useEffect} from 'react'
import {initFlowbite} from 'flowbite'
import Head from 'next/head'

const {provider, webSocketProvider} = configureChains(defaultChains, [publicProvider()])

const client = createClient({
    provider,
    webSocketProvider,
    autoConnect: true,
})

function MyApp({Component, pageProps}) {
    useEffect(() => {
        initFlowbite()
    }) //
    return (
        <WagmiConfig client={client}>
            <SessionProvider session={pageProps.session} refetchInterval={0}>
                <Head>
                    <link
                        rel='icon'
                        href='https://res.cloudinary.com/kabupaten-sukoharjo/image/upload/v1707229084/TerraVaultIcon_3_vbc0dq.png'
                    />
                </Head>
                <Toaster richColors position='top-right' expand={true} closeButton />
                <Component {...pageProps} />
            </SessionProvider>
        </WagmiConfig>
    )
}

export default MyApp
