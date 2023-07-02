import styled from 'styled-components';
import { useSession } from 'next-auth/react'
import {AdvancedRealTimeChart, TechnicalAnalysis, MarketData} from "react-ts-tradingview-widgets";
import useStore from '../store';
import { useCallback, useEffect, useState } from 'react';

import Chat from '@/components/Chat';
import Signal from '@/components/Signal';
import useSWR from "swr";
import {getBottomSignal} from "@/lib/api/signal";
const Container = styled.div`
  width:100%;
  height:100%;
  display: flex;
  overflow-x:hidden;
  justify-content: center;
  flex-grow:0;
`
const Adjuster = styled.div`
  width:100%;
  height:100%;
  display:grid;
  grid-template-columns: repeat(5, 1fr); 
  grid-template-rows: repeat(4, 1fr); 
  grid-template-areas: 
  "g g g g h"
  "g g g g h"
  "g g g g h"
  "i i i i j";
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
  flex-basis:0;
  min-height:100px;
  background-color: ${p=>p.theme.colors.blockColor};
  border-radius:20px;
`
const RateContainer = styled.div`

display:grid;
width:100%;
  grid-template-columns: repeat(4, 1fr); 
  grid-template-rows: repeat(3, 1fr); 
  grid-template-areas: 
  "a b d d"
  "c c d d"
  "e e f f";
  gap: 10px;


`
const Progressbar = styled.div<{tcolor:number, size:number}>`
  background-color: ${p=>p.theme.colors.bgColor};
  border-radius: 1em;
  div {
    background-color: ${p=>p.tcolor === 0 ? "white" : p.tcolor === 1 ? p.theme.colors.signatureRed : p.tcolor === 2 ? p.theme.colors.signatureBlue : "orange"};
    width: ${props=>props.size}%;
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
  background-color:${p=>p.theme.colors.blockColor};
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
  const {themeMode, curPair} = useStore();
  const [isInited, setIsInited] = useState<boolean>(false);
  const {data} = useSWR("/get/buttom-signal",getBottomSignal, {refreshInterval:10000})
  useEffect(()=>{
    setIsInited(true); // 트레이딩뷰가 처음에 보이지 않아 추가함
  }, [])

  const TradingView = useCallback(()=>{
    return <>
      <AdvancedRealTimeChart autosize symbol={curPair} theme={themeMode ? "dark" : "light"}/>
      <MediaHidden>
        <TechnicalAnalysis autosize symbol={curPair} colorTheme={themeMode ? "dark" : "light"}/>
      </MediaHidden>    
    </> 
    

  }, [themeMode])
  return (
    <>
      <Container>
        <Adjuster>
            <Widget style={{gridArea:"g"}}>
              {isInited && <TradingView/>}
            </Widget>
            <RateContainer style={{gridArea:"i"}}>
                <RateBox style={{gridArea:"a"}}>
                  <div>
                    공포/탐욕 지수 : {data ? data.fear : "불러오는 중입니다..."}
                  </div>
                  <Progressbar tcolor={1} size={data && parseFloat(data.fear)}>
                    <div/>
                  </Progressbar>
                </RateBox>
                <RateBox style={{gridArea:"b"}}>
                  <div>
                    강도지수 (RSI) : {data ? parseFloat(data.rsi) : "불러오는 중입니다..."}
                  </div>
                  <Progressbar tcolor={0} size={data && parseFloat(data.rsi)}>
                    <div/>
                  </Progressbar>
                </RateBox>                
                <RateBox style={{gridArea:"c"}}>
                  <div>
                    스토캐스틱 지수 : {data ? parseFloat(data.stoch) : "불러오는 중입니다..."}
                  </div>
                  <Progressbar tcolor={0} size={data && parseFloat(data.stoch)}>
                    <div/>
                  </Progressbar>
                </RateBox>
                <div style={{gridArea:"d", display:"flex", gap:"10px"}}>
                  <RateBox>
                    <div style={{margin:"auto"}}>
                        BTC 김프<br/>{data ? parseFloat(data.btcGimp) : "불러오는 중입니다..."}
                    </div>
                  </RateBox>
                  <RateBox>
                    <div style={{margin:"auto"}}>
                      ETH 김프<br/> {data ? parseFloat(data.ethGimp) : "불러오는 중입니다..."}
                    </div>
                  </RateBox>
                  <RateBox>
                    <div style={{margin:"auto"}}>
                      XRP 김프<br/> {data ? parseFloat(data.xrpGimp) : "불러오는 중입니다..."}
                    </div>
                  </RateBox>      
                  <RateBox>
                    <div style={{margin:"auto"}}>
                      AVAX 김프<br/> {data ? parseFloat(data.avaxGimp) : "불러오는 중입니다..."}
                    </div>
                  </RateBox>    
                </div>

                  <RateBox style={{gridArea:"e"}}>
                    <div>
                      LONG 비율 : {data && parseFloat(data.longRatio)}
                    </div>
                    <Progressbar tcolor={1} size={data && parseFloat(data.longRatio)}>
                      <div/>
                    </Progressbar>
                  </RateBox>
                  <RateBox style={{gridArea:"f"}}>
                    <div>
                      SHORT 비율 (RSI) : {data && parseFloat(data.shortRatio)}
                    </div>
                    <Progressbar tcolor={0} size={data && parseFloat(data.shortRatio)}>
                      <div/>
                    </Progressbar>
                  </RateBox>

            </RateContainer>
            
            
            <Sidebar style={{gridArea:"h"}}>
              <Signal/>
            </Sidebar>
            <ChatContainer style={{gridArea:"j"}}>
              <Chat/>
            </ChatContainer>
        </Adjuster>
      </Container>
    </>

  )
}
Home.navbar = true;
export default Home

