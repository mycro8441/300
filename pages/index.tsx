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
const Container = styled.div`
  width:100%;
  height:100%;
  display: flex;
  justify-content: center;
  
`
const Adjuster = styled.div`
  
  width:100%;
  
  height:100%;
  display:flex;
  justify-content: center;
  padding:30px;

  gap:10px;
`
const Main = styled.div`

  flex:1;
  height:100%;


  display: flex;
  flex-direction: column;
  gap:10px;
`
const Sidebar = styled.div`
  flex:0.2;
  height:100%;
  background-color: ${p=>p.theme.colors.blockColor};
  border-radius:20px;
  @media screen and (max-width:800px) {
    display:none;
  }
`
const MediaHidden = styled.div`
  height:100%;
    @media screen and (max-width:800px) {
    display:none;
  }
  
`
const ChatContainer = styled.div`
  flex:0.4;
  background-color: ${p=>p.theme.colors.blockColor};
  border-radius:20px;
`
const Widget = styled.div`
  width:100%;
  flex:0.8;
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
  const {data:session, status}= useSession();
  const {themeMode} = useStore();

  return (
    <>
      <Container>
        <Adjuster>
          <Main>
            <Widget>
              <AdvancedRealTimeChart autosize symbol='BTCUSDT' theme={themeMode ? "dark" : "light"}/>
              <MediaHidden>
                <TechnicalAnalysis autosize symbol='BTCUSDT' colorTheme={themeMode ? "dark" : "light"}/>
              </MediaHidden>
              
            </Widget>    
            <ChatContainer>
              <Chat/>
            </ChatContainer>

          </Main>
            <Sidebar>
              dd
            </Sidebar>            

        </Adjuster>

      </Container>    
    </>

  )
}

export default Home
