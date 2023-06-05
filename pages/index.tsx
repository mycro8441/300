import styled from 'styled-components';
import { useSession } from 'next-auth/react'
import TradingViewWidget from "../components/TradingViewWidget"
import TradingViewTechWidget from "../components/technicalAnalysis";
import {AdvancedRealTimeChart, TechnicalAnalysis, MarketData} from "react-ts-tradingview-widgets";
import useStore from '../store';
import { useEffect } from 'react';
import axios from 'axios';
import * as cheerio from 'cheerio';
import Chat from '@/components/Chat';
import Signal from '@/components/Signal';
import useSWR from 'swr';
const Container = styled.div`
  width:100%;
  height:100%;
  display: flex;
  justify-content: center;
  flex-grow:0;
`
const Adjuster = styled.div`
  
  width:100%;
  
  height:100%;
  display:flex;
  justify-content: center;
  padding:30px;

  gap:10px;
`
const MainL = styled.div`

  flex:1;
  height:100%;
  min-height:200px;

  display: flex;
  flex-direction: column;
  gap:10px;
`
const MainR = styled.div`

  flex:0.1;
  height:100%;
  @media screen and (max-width:800px) {
    display:none;
  }

  display: flex;
  flex-direction: column;
  gap:10px;
`
const Sidebar = styled.div`
  flex:1;
  min-height:200px;
  background-color: ${p=>p.theme.colors.blockColor};
  border-radius:20px;

  overflow: hidden;
`
const MediaHidden = styled.div`
  height:100%;
    @media screen and (max-width:800px) {
    display:none;
  }
  
`
const ChatContainer = styled.div`
  flex:0.4;
  flex-basis:0%;
  min-height:100px;
  background-color: ${p=>p.theme.colors.blockColor};
  border-radius:20px;
`
const RateContainer = styled.div`
  height:80px;
  display:flex;
  gap:10px;
`
const Progressbar = styled.div<{tcolor:number}>`
    background-color: ${p=>p.theme.colors.bgColor};
  border-radius: 1em;
  /* (height of inner div) / 2 + padding */

  div {
    background-color: ${p=>p.tcolor === 0 ? "white" : p.tcolor === 1 ? p.theme.colors.signatureRed : p.tcolor === 2 ? p.theme.colors.signatureBlue : "orange"};
    width: 40%;
    /* Adjust with JavaScript */
    height: 10px;
    border-radius: 1em;
  }
`

const RateBox = styled.div`
  height:100%;
  flex:1;
  border-radius: 20px;
  background-color: ${p=>p.theme.colors.blockColor};
  display:flex;
  flex-direction: column;
  justify-content: space-between;
  padding:1.2em 1em;

`

const Widget = styled.div`
  width:100%;
  flex:1;
  background-color:white;
  border-radius:20px;
  overflow: hidden;
  display:flex;

  div {
    height:100%;flex-grow: 1;

  }
  div:nth-child(2) {
    flex:1;
    overflow-y: hidden;
    
  }
`

function Home() {
  const {themeMode} = useStore();


  return (
    <>
      <Container>
        <Adjuster>
          <MainL>
            <Widget>
              <AdvancedRealTimeChart autosize symbol='BTCUSDT' theme={themeMode ? "dark" : "light"}/>
              <MediaHidden>
                <TechnicalAnalysis autosize symbol='BTCUSDT' colorTheme={themeMode ? "dark" : "light"}/>
              </MediaHidden>
              
            </Widget>  
            <RateContainer>
              <RateBox>
                <div>
                  공포 / 탐욕 지수 : 
                </div>
                <Progressbar tcolor={1}>
                  <div/>
                </Progressbar>
              </RateBox>
              <RateBox>
                <div>
                  강도 지수 (RSI) : 
                </div>
                <Progressbar tcolor={0}>
                  <div/>
                </Progressbar>
              </RateBox>
              <RateBox>
                <div>
                    스토캐스틱 : 
                </div>
                <Progressbar tcolor={0}>
                  <div/>
                </Progressbar>
              </RateBox>
              <RateBox>
                <div>
                  트랜드 : 
                </div>
                <Progressbar tcolor={2}>
                  <div/>
                </Progressbar>
              </RateBox>
            </RateContainer>
          </MainL>
 

          <MainR>
            <Sidebar>
              <Signal/>
            </Sidebar>
            <ChatContainer>
              <Chat/>
            </ChatContainer>
          </MainR>

                      

        </Adjuster>

      </Container>    
    </>

  )
}
// export async function getStaticProps() {
//   const { data } = await axios.get('https://sigbtc.pro/')
//   const $ = cheerio.load(data)
//   const title = $('.RSIRate').text()
//   const lastScraped = new Date().toISOString()
//   return {
//     props: { title, lastScraped},
//     revalidate: 10, // rerun after 10 seconds
//   }
// }
Home.navbar = true;
export default Home

