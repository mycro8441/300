
import { useSession } from 'next-auth/react'

function Home() {
  const {data:session, status}= useSession();
  if(session) {
    
  }
  return (
    <>

    </>
  )
}

export default Home
