import axios from "axios";
import { useEffect, useRef, useState } from "react";
import styled, { StyledComponent } from "styled-components";
import useSWR from "swr";




const sendMessage = (msg:string) => {
    axios.post("http://49.247.43.169:8080/post/chat", {chatContent:msg}).then(res=>{
        console.log(res)
    });
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
        <InputContainer onSubmit={onSubmit}>
            <input placeholder="채팅을 입력해주세요." value={input} onChange={onChange}/>
            <InputSubmitBtn>
                Send
            </InputSubmitBtn>
        </InputContainer>
    </>

}
const InputContainer = styled.form`
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
        background-color: ${p=>p.theme.colors.bgColor};

    }
`
const InputSubmitBtn = styled.button`
    width:5em;
    border:none;
    height:100%;
    border-radius: 15px;
    background-color:${p=>p.theme.colors.signatureBlue};
    display:flex;
    justify-content: center;
    align-items: center;
    cursor:pointer;
    
`

const MessageContainer = styled.div`
    width:100%;
    height:auto;
    display:flex;
    padding-left:20px;
    padding-top:10px;
    gap:10px;
`
const NickContainer = styled.div`
    width:20%;
    text-align: right;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
`
const TextContainer = styled.div`
    flex:1;
`
type Chat = {
    chatContent:string;
    chatDate:string;
    chatSender:string;
    id:number;
}
const ChatDisplay = () => {
    const { data, error } = useSWR<Chat[]>("http://49.247.43.169:8080/get/chat");
    
    const chatRef = useRef(null);


    useEffect(()=>{
        chatRef.current.scrollIntoView(false, {behavior:"smooth"});
    }, [data])
    return <>
        <DisplayContainer ref={chatRef}>
            {data?.map(chat=>(
                <MessageContainer key={chat.id}>
                    <NickContainer>
                        {chat.chatSender}
                    </NickContainer>
                    <TextContainer>
                        {chat.chatSender}
                    </TextContainer>
                </MessageContainer>                
            ))}
        </DisplayContainer>
    </>
}
const DisplayContainer = styled.div`
    flex:1;
    width:100%;
    max-height:200px;
    overflow-y:auto;
    display:flex;
    flex-direction: column;
    
    &::-webkit-scrollbar {
        width:10px;
        }
    &::-webkit-scrollbar-thumb {
        background-color: ${p=>p.theme.colors.bgColor};
        border-radius: 10px;
        background-clip:padding-box;
        border:2px solid ${p=>p.theme.colors.blockColor};
        
    }
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