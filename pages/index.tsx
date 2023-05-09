import styled from 'styled-components';
import { useSession } from 'next-auth/react'

const Adjuster = styled.div`
  width:100%;
  height:100%;
  display:flex;
  padding:10px;
`

function Home() {
  const {data:session, status}= useSession();

  return (
    <>
      
    </>
  )
}

export default Home
