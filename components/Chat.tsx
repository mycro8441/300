import axios from "axios";
import { useEffect, useRef, useState } from "react";
import styled, { StyledComponent } from "styled-components";
import useSWR, {useSWRConfig} from "swr";
import useSWRMutation from "swr"
import {getChat, sendMessage} from "@/lib/api/chat";
import useStore from "../store";
import { toast } from "react-toastify";

const InputContainer = styled.form`
    width:100%;
    height:3.3em;
    display:flex;
    gap:5px;
    padding:10px;
    input {
        flex:1;
        outline: none;
        border:none;
        border-radius:12px;
        padding-left:15px;
        font-size: 1em;
        background-color: ${p=>p.theme.colors.bgColor};

    }
`
const InputSubmitBtn = styled.button`
    width:5em;
    border:none;
    color:white;
    height:100%;
    border-radius: 12px;
    background-color:${p=>p.theme.colors.signatureBlue};
    display:flex;
    justify-content: center;
    align-items: center;
    cursor:pointer;
    &:hover {
      opacity:0.8;
    }
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
    const { mutate } = useSWRConfig();
    const [data, setData] = useState(null);
    //const { data, error} = useSWR<Chat[]>("/get/chat",getChat);
    const [input, setInput] = useState<string>('');
    const {userInfo} = useStore()
    const bottomRef = useRef<HTMLDivElement>(null);

    const getFreshData = () => {
        getChat().then(res=>{
            setData(res);
        })
    }
    const onSubmit = async (e) => {
        e.preventDefault();

        const newChat = {
            id: Math.random(),
            chatContent: input,
            chatDate: new Date().toISOString(),
            chatSender: null,
        };
        try {
            setData([
                ...data,
                newChat,
            ])
            setInput('');
            await sendMessage(input);
            getFreshData();
        } catch (error) {
            toast.error("메시지 전송에 실패하였습니다.")
        }
    };
    const onChange = e => {
        setInput(e.target.value)
    }
    useEffect(()=>{
        bottomRef.current?.scrollIntoView();
    }, [data])
    useEffect(()=>{
        getFreshData()
    }, [])

    return (<Adjuster>
            <DisplayContainer>
                {data?.sort(
                    (a,b)=>new Date(a.chatDate).getTime() - new Date(b.chatDate).getTime()
                ).map(chat=>(
                    <MessageContainer key={chat.id}>
                        <NickContainer>
                            {chat.chatSender}
                        </NickContainer>
                        <TextContainer>
                            {chat.chatContent}
                        </TextContainer>
                    </MessageContainer>
                ))}
                <div ref={bottomRef}/>
            </DisplayContainer>
            <InputContainer onSubmit={onSubmit}>
                <input placeholder="채팅을 입력해주세요." value={input} onChange={onChange}/>
                <InputSubmitBtn>
                    Send
                </InputSubmitBtn>
            </InputContainer>
        </Adjuster>)
}
const Adjuster = styled.div`
    display:flex;
    flex-direction: column;
    width:100%;
    height:100%;
`



export default Chat;
