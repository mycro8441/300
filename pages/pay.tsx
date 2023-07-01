import Pay_point from "@/components/payments/Paybtn"
import { requestPoint } from "@/lib/api/pay"
import { ArrowBack, Backspace, Home, Router } from "@mui/icons-material"
import { Avatar } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import styled, { css, keyframes } from "styled-components"
import useStore from "../store"
import { useRouter } from 'next/router'
import { toast } from "react-toastify"
const GoLeft = keyframes`
    0% {
        opacity: 1;
        transform: translateX(0);
    }
    100% {
        opacity: 0;
        transform: translateX(-10%);
    }
`
const GoRight = keyframes`
    0% {
        opacity: 0;
        transform: translateX(10%);
    }
    100% {
        opacity: 1;
        transform: translateX(0);
    }
`
const Adjust = styled.div`
    width:100%;
    height:100%;
    display:flex;
    justify-content: center;
    align-items: center;
`
const Container = styled.div<{isChanging:boolean}>`
    display:flex;
    flex-direction: column;
    align-items: center;
    gap:10px;
    animation: ${p=>p.isChanging ? css`${GoLeft} 0.4s ease forwards` : css`${GoRight} 0.4s ease forwards`};
    width:450px;
`
const UserContainer = styled.div<{inited:boolean}>`
    padding:1em 1.5em;
    display: flex;
    justify-content: space-between;
    width:${p=>p.inited ? "100%" : "90%"};
    height:${p=>p.inited ? "100%" : "90%"};
    white-space: nowrap;
    background-color: ${p=>p.theme.colors.blockColor};
    border-radius: 20px;
    overflow:hidden;
    opacity: ${p=>p.inited ? 1 : 0.5};
    transition: 0.5s ease;

    p {
        width:100%;
        text-align:center;
    }
`
const UserProperty = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
`
const PayContainer = styled.div<{inited:boolean}>`
    width:100%;
    background-color: ${p=>p.theme.colors.blockColor};
    border-radius: 20px;
    text-align: center;
    padding:1em;
    p {
        margin:10px;
        margin-bottom:20px;
    }
    span {
        font-size:3em;
        padding:${p=>p.inited ? "0 10px" : 0};
        transition: 0.3s ease;
        border-radius: 10px;
        background-color: ${p=>p.theme.colors.bgColor};
        color:${p=>p.theme.colors.signatureBlue};
        font-weight: bold;
    }
`
const NextBtn = styled.div`
    width:100%;
    height:2em;
    border-radius: 10px;
    background-color: ${p=>p.theme.colors.signatureBlue};
    cursor:pointer;
    margin:auto;
    color:white;
    margin-top:20px;
    white-space: nowrap;
    display:flex;
    justify-content: center;
    align-items: center;
`
const BackBtn = styled.div`
    position:absolute;
    gap:5px;
    display:flex;
    align-items: center;
    cursor:pointer;
`
const PrettyNumber = styled.div`
    font-size:1em;
    height:1.2em;
    padding:0 10px;
    transition: 0.3s ease;
    border-radius: 10px;
    background-color: ${p=>p.theme.colors.bgColor};
    color:${p=>p.theme.colors.signatureBlue};
    font-weight: bold;
`
const NumberContainer = styled.div`
    display:flex;
    gap:5px;
    text-align: right;
`

const PrettyInput = styled.input`
    height:2em;
    width:100%;
    margin-top:5px;
    border-radius: 10px;
    border:none;
    background:${p=>p.theme.colors.bgColor};
    box-sizing:border-box;
    padding-left:15px;
    
`

const SelectBlock=styled.div<{inited:boolean}>`
    width:${p=>p.inited ? "100%" : "90%"};
    height:${p=>p.inited ? "100%" : "90%"};
    background-color: ${p=>p.theme.colors.blockColor};
    border-radius: 20px;
    overflow:hidden;
    opacity: ${p=>p.inited ? 1 : 0.5};
`;
const SelectBar = styled.div`
    display:flex;
    background-color: ${p=>p.theme.colors.bgColor};
    border-radius: 10px;
    height:2em;
    overflow:hidden;
    margin:10px !important;
`
const SelectBox = styled.div<{selected:boolean}>`
    flex:1;
    height:100%;
    display:flex;
    justify-content: center;
    align-items: center;
    color:${p=>p.selected ? "white" : "gray"};
    margin:0 !important;
    border-radius:0 !important;
    background-color:${p=>p.selected ? `${p.theme.colors.signatureBlue} !important`:`${p.theme.colors.bgColor} !important`};
    cursor:pointer;
`

type Points = 10000|30000|50000|100000; 
const Pay = () => {
    const {userInfo} = useStore();
    const [inited, setInited] = useState<boolean>(true);
    const [isChanging, setIsChanging] = useState<boolean>(false);
    const [input, setInput] = useState('');
    const router = useRouter();
    useEffect(()=>{
        if(userInfo.id) setInited(true);
        else router.push("/auth/login")
    }, [])

    const mode = useRef<"confirm"|"pay">("confirm");
    const changeMode = ()=>{
        setIsChanging(true);
        setTimeout(()=>{
            mode.current = mode.current === "confirm" ? "pay" : "confirm";
            setIsChanging(false);
        }, 400);
    }

    const [pointAmount, setPointAmount] = useState<Points>(10000)
    return <Adjust>
        <Container isChanging={isChanging}>
            <UserContainer inited={inited}>
                {inited ? <>
                    <Avatar/>
                    <UserProperty>
                        {mode.current === "confirm" ? <>
                            <span>{userInfo.email}</span>
                            <NumberContainer>
                                <span>현재 포인트 : </span>
                                <PrettyNumber>{userInfo.points}</PrettyNumber>
                            </NumberContainer>
                        </>:<>
                            <NumberContainer>
                                <span>현재 포인트 : </span>
                                <PrettyNumber>{userInfo.points}</PrettyNumber>
                            </NumberContainer>
                            <div style={{display:"flex", gap:"5px"}}>
                                <span>충전할 포인트 : </span>
                                <PrettyNumber>{pointAmount}</PrettyNumber>
                            </div>
                        </>}
                    </UserProperty>
                </> : <>
                    <p>Loading...</p>
                </>}

            </UserContainer>
            <SelectBlock inited={inited}>
                <SelectBar>
                    <SelectBox onClick={()=>setPointAmount(10000)} selected={pointAmount===10000}>10000</SelectBox>
                    <SelectBox onClick={()=>setPointAmount(30000)} selected={pointAmount===30000}>30000</SelectBox>

                    <SelectBox onClick={()=>setPointAmount(50000)} selected={pointAmount===50000}>50000</SelectBox>

                    <SelectBox onClick={()=>setPointAmount(100000)} selected={pointAmount===100000}>100000</SelectBox>

                </SelectBar>
            </SelectBlock>
            <PayContainer inited={inited}>
                {mode.current === "confirm" ? <>
                    <BackBtn onClick={()=>router.push("/")}><Home/>홈으로</BackBtn>

                    <p>다음 포인트를 충전합니다</p>
                    <span>{inited ? pointAmount : ""}</span>
                    <NextBtn onClick={changeMode}>
                        다음
                    </NextBtn>
                </>:<>
                    <BackBtn onClick={changeMode}><ArrowBack/>뒤로</BackBtn>
                        <p>센트코인 지갑 주소</p>
                         <PrettyNumber>0x2430Fb3DB4fba6391a65ffc94704042bd5Bc86a9</PrettyNumber>
                         <PrettyInput placeholder="예금주명 입력" onChange={e=>setInput(e.target.value)} value={input}/>
                         <NextBtn onClick={()=>{requestPoint(input, pointAmount).then(res=>{
                            router.push("/");
                            toast.success("포인트 추가를 요청하였습니다.");
                         }).catch(err=>{
                            if(err.response.status === 500) {
                                toast.error("포인트 추가에 실패하였습니다.")
                            }
                         })
                         
                         
                         }}>요청하기</NextBtn>
                </>}
            </PayContainer>
        </Container>
    </Adjust>
}

Pay.navbar = false;
export default Pay;
