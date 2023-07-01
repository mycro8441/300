import GlobalStyle from 'styles/globals'
import 'react-toastify/dist/ReactToastify.css'
import { SWRConfig } from 'swr'
import { ToastContainer, toast } from 'react-toastify'
import { ThemeProvider } from 'styled-components'
import Head from 'next/head'

import styled from 'styled-components'
import Login from './auth/login'
import {dark, light} from "../styles/theme"
import {useEffect, useState} from 'react'
import useStore from '../store';
import NavBar from '@/components/navbar'
import { useRouter } from 'next/router'
import axios from 'axios'
import {authClient, client} from "@/lib/api/client";
import { getUserInfo } from '@/lib/api/user'

const Container = styled.div`
  width:100vw;
  height:100vh;
  display:flex;
  flex-direction: column;
`

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps }
}) {
  const {themeMode, setThemeMode, userInfo, isLogined, setIsLogined, setUserInfo} = useStore();
  const [theme, setTheme] = useState(dark);
  const router = useRouter();
  useEffect(()=>{
    if(localStorage.getItem("theme") === null) {
      localStorage.setItem("theme", "dark");
    }
  }, [])
  useEffect(()=>{
    setTheme(localStorage.getItem("theme") == "light" ? light : dark);
    setThemeMode(localStorage.getItem("theme") == "dark");
  }, [themeMode])
  useEffect( ()=>{
      if(window.localStorage.getItem("token") !== null) {
        
        setIsLogined(true)
        getUserInfo().then(res=>{
          const {
            id,
            username,
            password,
            phoneNumber,
            role,
            point,
            ban,
            usrPw
          } = res;
          setUserInfo({
            id: id,
            email:username,
            encryptedPw:password,
            phoneNumber:phoneNumber,
            role:role,
            points:point,
            ban:ban,
            usrPw:usrPw,
          });
          //if(res.role === "ROLE_USER" && router.asPath === "/admin") router.push("/"); // 일반 유저 admin 페이지 접근 방지
        }).catch(err=>{
        })      
      } else {
        setIsLogined(false);
      }

      if(!isLogined && router.asPath !== "/" && router.asPath !== "/auth/login") router.push("/auth/login"); // 메인, 로그인 페이지 외에는 로드인 없이 접근 불가

      

  },[router, isLogined])


  return (

      <ThemeProvider theme={theme}>
        <GlobalStyle/>
        <SWRConfig>
            <Head>
              <title>CoinPick365</title>
              <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            </Head>
            <Container>
              {
                Component.navbar && <NavBar/>
              }
              <Component {...pageProps} />
            </Container>
        </SWRConfig>
        <ToastContainer
          autoClose={3000}
          draggable={false}
          theme={themeMode == true ? "dark" : "light"}
        />
      </ThemeProvider>

  )
}

