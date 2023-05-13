import GlobalStyle from 'styles/globals'
import 'react-toastify/dist/ReactToastify.css'
import { SessionProvider, useSession } from 'next-auth/react'
import { SWRConfig } from 'swr'
import { ToastContainer } from 'react-toastify'
import { ThemeProvider } from 'styled-components'
import Head from 'next/head'

import styled from 'styled-components'
import Login from './auth/login'
import {dark, light} from "../styles/theme"
import { useState } from 'react'
import useStore from '../store';
import NavBar from '@/components/navbar'
const Container = styled.div`
  /* max-width:36rem;
  margin-left:auto;
  margin-right:auto;
  padding-left:1rem;
  padding-right:1rem; */
`
const Background = styled.div`
  position:relative;
  width:100vw;
  height:100%;
  background: ${p=>p.theme.colors.bgColor};
`
export default function MyApp({
  Component,
  pageProps: { session, ...pageProps }
}) {
  const {themeMode} = useStore();
  const themeTray = [light, dark]; // 라이트, 다크 테마 이외의 테마 추가 대비
  const theme = themeTray[+themeMode];

  
  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={theme ?? light}>
        <SWRConfig
          value={{
            revalidateOnFocus: false,
            fetcher: (resource, init) =>
              fetch(resource, init).then((res) => res.json())
          }}
        >
            <GlobalStyle/>
            <Head>
              <title>BitCoin website</title>
              <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            </Head>
            <Background>
              <Auth>
                <Container>
                  <main>
                    <NavBar/>
                    <Component {...pageProps} />
                  </main>
                </Container>      
              </Auth>       
              <ToastContainer
                  autoClose={3000}
                  draggable={false}
                />               
            </Background>


        </SWRConfig>
      </ThemeProvider>
    </SessionProvider>
  )
}

function Auth({ children }) {
  const { status } = useSession()
  //DEV
  return children;
  if (status === "loading") {
    return <div>Loading...</div>
  } else if(status==="unauthenticated") {
    return <Login/>  
  } else {
    return children
  }
}