import styled from 'styled-components';
import { useSession } from 'next-auth/react'
import TradingViewWidget from "../components/TradingViewWidget"
import NavBar from '@/components/navbar';
const Adjuster = styled.div`
  width:100%;
  height:100%;
  display:flex;
  padding:10px;
  flex-wrap: nowrap;
`

function Home() {
  const {data:session, status}= useSession();

  return (
    <>
      <NavBar/>
      <Adjuster>

      </Adjuster>

    </>
  )
}

export default Home
