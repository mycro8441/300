import GlobalStyle from 'styles/globals'
import 'react-toastify/dist/ReactToastify.css'
import { SessionProvider, useSession } from 'next-auth/react'
import { SWRConfig } from 'swr'
import { ToastContainer } from 'react-toastify'
import { GlobalStoreProvider } from 'archive/index'
import { ThemeProvider } from 'styled-components'
import Head from 'next/head'

import styled from 'styled-components'
import Login from './auth/login'
import {dark, light} from "../styles/theme"
import { useState } from 'react'
import useStore from '../store/store';
const Container = styled.div`
  max-width:36rem;
  margin-left:auto;
  margin-right:auto;
  padding-left:1rem;
  padding-right:1rem;
`
const Background = styled.div`
  position:relative;
  width:100vw;
  height:100vh;
  background-color: ${p=>p.theme.bgColor};
  background: black;
`
export default function MyApp({
  Component,
  pageProps: { session, ...pageProps }
}) {
  const {themeMode} = useStore();
  const theme = themeMode === 'light' ? light : dark;

  
  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={theme}>
        <SWRConfig
          value={{
            revalidateOnFocus: false,
            fetcher: (resource, init) =>
              fetch(resource, init).then((res) => res.json())
          }}
        >
          <GlobalStoreProvider>
            <GlobalStyle/>
            <Head>
              <title>BitCoin website</title>
            </Head>
            <Background>
              <Auth>
                <Container>
                  <main>
                    <Component {...pageProps} />
                  </main>
                </Container>      
              </Auth>       
              <ToastContainer
                  autoClose={3000}
                  hideProgressBar
                  draggable={false}
                />               
            </Background>


          </GlobalStoreProvider>
        </SWRConfig>
      </ThemeProvider>
    </SessionProvider>
  )
}

function Auth({ children }) {
  const { status } = useSession()

  if (status === "loading") {
    return <div>Loading...</div>
  } else if(status==="unauthenticated") {
    return <Login/>  
  } else {
    return children
  }
}