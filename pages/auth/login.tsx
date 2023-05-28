import styled, {keyframes, css} from "styled-components"
import {Resolver, useForm} from "react-hook-form";
import {toast} from "react-toastify";
import { useEffect, useState } from "react";
import EmailIcon from '@mui/icons-material/Email';
import { ErrorSharp, Visibility, VisibilityOff } from "@mui/icons-material";
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
const Adjuster = styled.div`
    display:flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width:100vw;
    height:100vh;

`
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
const Container = styled.div<{isChanging:boolean}>`
    width:300px;
    max-width:70%;
    height:auto;
    animation: ${p=>p.isChanging ? css`${GoLeft} 0.4s ease forwards` : css`${GoRight} 0.4s ease forwards`};
    background-color: ${p=>p.theme.colors.blockColor};
    border-radius: 50px;
    padding:30px;
    text-align:center;

    h1 {
        margin:10px;
        color:${p=>p.theme.colors.textMild};
    }
`
const Input = styled.div`
    position: relative;
    width:80%;
    height:35px;
    margin:20px auto;
    text-align:left;
    display:flex;
    flex-direction: column;

    svg {
        position:absolute;
        top:50%;
        transform:translateY(-50%);
        right:10px;
        opacity:0.5;
    }
`
const PrettyInput = styled.input`
    
    width:100%;
    height:100%;
    border-radius: 15px;
    border:none;
    background:${p=>p.theme.colors.bgColor};
    box-sizing:border-box;
    padding-left:15px;
`
const SubmitButton = styled.button<{isDisabled:boolean}>`
    height:35px;
    width:${p=>p.isDisabled ? "50%" : "60%"};
    background-color: ${p=>p.isDisabled ? "gray" : p.theme.colors.signatureBlue};
    transition:0.3s ease;
    border:none;
    border-radius:30px;
    color:${p=>p.theme.textColor};
    cursor:pointer;
`
const ChangeButton = styled.button<{isDisabled:boolean}>`
    position:relative;
    margin:20px auto;
    height:${p=>p.isDisabled ? "25px" : "30px"};
    width:${p=>p.isDisabled ? "150px" : "200px"};
    background-color: ${p=>p.isDisabled ? "gray" : p.theme.colors.signatureBlue};
    transition:0.3s ease;
    border:none;
    border-radius:30px;
    color:${p=>p.theme.textColor};
    cursor:pointer;
`
type FormValues = {
    email:string;
    password:string;
    passwordConfirm:string;
};
const emailRex = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
const pwRex = /(?=.*\d{1,50})(?=.*[~`!@#$%\^&*()-+=]{1,50})(?=.*[a-zA-Z]{2,50}).{8,50}$/;
export default function Login({}) {



    const [visible, setVisible] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isChanging, setIsChanging] = useState<boolean>(false);
    const [mode, setMode] = useState<"login"|"signin">("login");
    const validate = {
        email: (value:string)=>{
            if(!value) {
                toast.error("이메일을 입력해주세요.");
                return false;
            }
            if(!emailRex.test(value)) {
                toast.error("올바른 이메일을 입력해주세요.");
                return false;
            }
            return true;
        },
        password: (value:string)=>{
            if(!value) {
                toast.error("비밀번호를 입력해주세요.");
                return false;
            }
            if(!pwRex.test(value)) { // UX를 위하여 추후에 오류 이유 세분회 예정 (toast가 너무 빨리 사라짐)
                toast.error("비밀번호는 최소 8자, 최소 하나의 문자, 하나의 숫자 및 특수문자를 포함하여야 합니다.");
                return false;
            }
            return true;
        },
        passwordConfirm: (value:string)=>{
            if(!value) {
                toast.error("비밀번호 확인을 입력해주세요.");
                return false;
            }
            if(input.password !== input.passwordConfirm) {
                toast.error("비밀번호가 일치하지 않습니다.");
                return false;
            }
            return true;
        }
    }
    const onSubmit = (e) => {
        e.preventDefault();
        if(mode === 'login') {
            if(validate['email'](input.email) && validate['password'](input.password)) {
                toast.success("로그인을 요청하였습니다.")
                setIsSubmitting(true);
            }            
        } else {
            if(validate['email'](input.email) && validate['password'](input.password) && validate['passwordConfirm'](input.passwordConfirm)) {
                toast.success("회원가입을 요청하였습니다.")
                setIsSubmitting(true);
            }
        }


    }
    
    const [input, setInput] = useState<FormValues>({
        email:'',
        password:'',
        passwordConfirm:'',
    })
    const changeMode = ()=>{
        setIsChanging(true);
        setTimeout(()=>{
            setMode(val=>val === "login" ? "signin" : "login");
            setIsSubmitting(false);
            setInput({email:'', password:'', passwordConfirm:''})
            setIsChanging(false);
        }, 400);
    }
    const onChange = e => {
        const {value, name} = e.target;
        setInput({
            ...input,
            [name]:value
        })
    }
    return <Adjuster>
            {mode === "login" ? <Container isChanging={isChanging}>
                <h1>로그인</h1>
                <form onSubmit={onSubmit}>
                    <Input>
                        <PrettyInput name="email" value={input.email} onChange={onChange}
                        placeholder="이메일"/>
                        <EmailIcon fontSize="small"/>
                    </Input>
                    <Input>
                        <PrettyInput type={visible ? "text" : "password"} name="password" onChange={onChange} value={input.password} placeholder="비밀번호"/>
                        <div onClick={()=>setVisible(state=>!state)} style={{cursor:"pointer"}}>
                            {visible ? <Visibility fontSize="small"/> : <VisibilityOff fontSize="small"/>}
                        </div>
                    </Input>
                    <SubmitButton type="submit" isDisabled={isSubmitting} disabled={isSubmitting}>로그인</SubmitButton>
                </form>            
            </Container> : <Container isChanging={isChanging}>
            <h1>회원가입</h1>
                <form onSubmit={onSubmit}>
                    <Input>
                        <PrettyInput name="email" value={input.email} onChange={onChange}
                        placeholder="이메일"/>
                        <EmailIcon fontSize="small"/>
                    </Input>
                    <Input>
                        <PrettyInput type={visible ? "text" : "password"} name="password" onChange={onChange} value={input.password} placeholder="비밀번호"/>
                        <div onClick={()=>setVisible(state=>!state)} style={{cursor:"pointer"}}>
                            {visible ? <Visibility fontSize="small"/> : <VisibilityOff fontSize="small"/>}
                        </div>
                    </Input>
                    <Input>
                        <PrettyInput type={visible ? "text" : "password"} name="passwordConfirm" onChange={onChange} value={input.passwordConfirm} placeholder="비밀번호 확인"/>
                    </Input>
                    <SubmitButton type="submit" isDisabled={isSubmitting} disabled={isSubmitting}>회원가입</SubmitButton>
                </form>   
            </Container>}
            <ChangeButton onClick={changeMode} isDisabled={isChanging} disabled={isChanging}>
                {mode==="login" ? "회원가입으로" : "로그인으로"}
            </ChangeButton>
            


    
    </Adjuster>
}