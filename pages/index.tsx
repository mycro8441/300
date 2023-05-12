import styled from 'styled-components';
import { useSession } from 'next-auth/react'
import TradingViewWidget from "../components/TradingViewWidget"
import TradingViewTechWidget from "../components/technicalAnalysis";
import NavBar from '@/components/navbar';
import PrettySwitch from '@/components/switch';
const Container = styled.div`
  width:100%;
  height:auto;
  display: flex;
  justify-content: center;
`
const Adjuster = styled.div`
  
  width:1200px;
  max-width:90%;
  height:auto;
  display:flex;
  padding:10px;
  flex-wrap: nowrap;
  gap:10px;
`
const Main = styled.div`
  width:80%;
  height:100%;
`
const Sidebar = styled.div`
  width:20%;
  height:100%;
  background-color: white;
  border-radius:20px;
`
const Widget = styled.div`
  width:100%;
  height:400px;
  background-color:white;
  border-radius:20px;
  overflow: hidden;
`
function Home() {
  const {data:session, status}= useSession();
  
  return (
    <>
      <NavBar/>
      <Container>
        <Adjuster>
          <Main>
            <Widget>
              <TradingViewWidget/> 
              <TradingViewTechWidget/>
            </Widget>          
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
