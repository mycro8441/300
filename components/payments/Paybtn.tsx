import { loadTossPayments } from "@tosspayments/payment-sdk";
import styled from "styled-components";
const NextBtn = styled.div`
    width:100%;
    height:2em;
    border-radius: 10px;
    background-color: ${p=>p.theme.colors.signatureBlue};
    cursor:pointer;
    margin:auto;
    margin-top:30px;
    white-space: nowrap;
    display:flex;
    justify-content: center;
    align-items: center;
    color:white;
`
export default function Pay_point({amount}:{amount:number}) {
    const handleClick = async()=>{
        const tossPayments = await loadTossPayments(
            process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY
        );

        await tossPayments.requestPayment("카드", {
            amount:amount,
            orderId:Math.random().toString().slice(2),
            orderName:"포인트 결제",
            successUrl:`${window.location.origin}/payments/complete`,
            failUrl:`${window.location.origin}/payments/fail`,
        
        });        
    }

    

    return <NextBtn onClick={handleClick}>
        결제
    </NextBtn>
}