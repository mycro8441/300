import { useEffect, useState } from "react";
import styled from "styled-components";
import useSWR from "swr";




const sendMessage = (msg:string) => {

}
const getMessages = () => {

} 
const ChatInput = () => {
    const [input, setInput] = useState<string>('');

    const onSubmit = e => {
        e.preventDefault();

        sendMessage(input);
        setInput('');
    }
    const onChange = e => {
        setInput(e.target.value)
    }
    return <>
        <InputContainer>
            <input placeholder="채팅을 입력해주세요." value={input} onChange={onChange}/>
            <InputSubmitBtn>
                Send
            </InputSubmitBtn>
        </InputContainer>
    </>

}
const InputContainer = styled.div`
    width:100%;
    height:3em;

    display:flex;
    gap:5px;
    padding:5px;
    input {
        flex:1;
        border:none;
        border-radius:15px;
        padding-left:15px;
        font-size: 1em;
    }
`
const InputSubmitBtn = styled.div`
    width:5em;
    height:100%;
    border-radius: 15px;
    background-color:${p=>p.theme.colors.pointColor1};
    display:flex;
    justify-content: center;
    align-items: center;
    cursor:pointer;
    
`

const ChatDisplay = () => {

    return <>
        <DisplayContainer>

        </DisplayContainer>
    </>
}
const DisplayContainer = styled.div`
    width:100%;
    flex:1;

`
const Chat = () => {
    //const {data, error, isValidating, mutate} = useSWR('/api/chat/messages', getMessages);


    return <>
        <Adjuster>
            <ChatDisplay/>
            <ChatInput/>
        </Adjuster>
    
    </>
}
const Adjuster = styled.div`
    display:flex;
    flex-direction: column;
    width:100%;
    height:100%;
`



export default Chat;