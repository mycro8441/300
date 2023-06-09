import styled, {keyframes, css} from "styled-components"
import {Resolver, useForm} from "react-hook-form";
import {toast} from "react-toastify";
import React, {useCallback, useEffect, useRef, useState} from "react";
import EmailIcon from '@mui/icons-material/Email';
import { Call, ErrorSharp, InputSharp, Visibility, VisibilityOff } from "@mui/icons-material";


import {useRouter} from 'next/navigation';
import useStore from "@/store/index";
import {getEmailAuthCode, login, register, verifyEmailAuthCode} from "@/lib/api/auth";



const Adjuster = styled.div`
    display:flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width:100vw;
    height:100vh;
    min-height:500px;
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
    width:350px;
    max-width:70%;
    height:auto;
    animation: ${p=>p.isChanging ? css`${GoLeft} 0.4s ease forwards` : css`${GoRight} 0.4s ease forwards`};
    background-color: ${p=>p.theme.colors.blockColor};
    border-radius: 30px;
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
    border-radius: 10px;
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
    color:white;
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
    color:white;
    cursor:pointer;
`
const CodeContainer = styled.form<{done:boolean}>`
    position:relative;
    display:flex;
    gap:10px;
    width:100%;
    justify-content: space-between;
    margin-top:20px;
    z-index:2;
    opacity: ${p=>p.done ? 0:1};
    transition: 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);

    input {
        border:none;
        width:100%;
        height:1.2em;
        background-color: ${p=>p.theme.colors.bgColor};
        border-radius: 5px;
        font-size:2em;
        outline:none;
        text-align:center;
      cursor: pointer;
      &:hover {
        
      }
    }
`
const LoadingText = styled.div<{done:boolean}>`
    position:absolute;
    opacity: ${p=>p.done ? 1:0};
    left:50%;
    transform: translateX(-50%);
    width:80%;
    z-index:1;
    transition: 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`
const CodeSubmit = styled.div<{done:boolean}>`
    height:25px;
    width:100%;
    background-color: ${p=>p.theme.colors.signatureBlue};
    transition:0.3s ease;
    border:none;
    border-radius:30px;
    color:white;
    cursor:pointer;
    margin:auto;
    margin-top: 1em;
    display:flex;
    justify-content: center;
    align-items: center;
    opacity: ${p=>p.done ? 0:1};
    transition: 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`
type FormValues = {
    email:string;
    phoneNumber:string;
    password:string;
    passwordConfirm:string;
};
const emailRex = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
const pwRex = /(?=.*\d{1,50})(?=.*[~`!@#$%\^&*()-+=]{1,50})(?=.*[a-zA-Z]{2,50}).{8,50}$/;
const regPhone= /^01([0|1|6|7|8|9])?([0-9]{3,4})?([0-9]{4})$/;
export default function Login({}) {



    const [visible, setVisible] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isChanging, setIsChanging] = useState<boolean>(false);
    const [mode, setMode] = useState<"login"|"signin"|"validate"|"done">("login"); // ref로 바꿈 예정

    const loadingMsg = useRef<number>(0);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const {setIsLogined, isLogined} = useStore();
    const router = useRouter();
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
        },
        phoneNumber: (value:string)=>{
            if(!value) {
                toast.error("전화번호를 입력해주세요.");
                return false;
            }
            if(!regPhone.test(value)) {
                toast.error("올바른 전화번호를 입력해주세요.");
                return false;
            }
            return true;
        },
    }
    const onSubmit = (e) => {
        e.preventDefault();
        if(mode === 'login') {

            submitLogin();

        } else {
            if(validate['email'](input.email) && validate['password'](input.password) && validate['passwordConfirm'](input.passwordConfirm) && validate['phoneNumber'](input.phoneNumber)) {
                // signup
                setIsSubmitting(true);
                setIsChanging(true);
                    
                getEmailAuthCode(input.email).then(res=>{
                    if(res) {
                        toast.success("인증번호가 당신의 이메일로 전송되었습니다.");
                    } else {
                        toast.error("인증번호를 전송하는 데 에러가 발생하였습니다.");
                    }
                    setIsLoading(false);
                })

                setTimeout(()=>{
                    setMode("validate");
                    setIsSubmitting(false);
                    //setInput({email:'', password:'', passwordConfirm:'', phoneNumber:''})
                    setIsChanging(false);
                }, 400);
            }
        }
    }

    const [input, setInput] = useState<FormValues>({
        email:'',
        password:'',
        passwordConfirm:'',
        phoneNumber:'',
    })
    const changeMode = ()=>{
        setIsChanging(true);
        setTimeout(()=>{
            setMode(val=>val === "login" ? "signin" : "login");
            setIsSubmitting(false);
            setInput({email:'', password:'', passwordConfirm:'', phoneNumber:''})
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

    const inputRefs = useRef<HTMLInputElement[]>([]);

    useEffect(() => {
            window.addEventListener('keydown', e => {
               if(inputRefs.current.length === 6 && inputRefs.current[0]?.value === "" && e.key !== "Backspace" && e.key !== "Enter") {
                   inputRefs.current[0].focus();
               }
            })
    }, [])


    const onCodeChange = ()=> {
        if(inputRefs.current.map(el=>el.value).join('').length == 6) {
            onCodeSubmit();
        }
    }
    const onCodeSubmit =()=> {
        loadingMsg.current = 1;
        setIsLoading(true);

        submitAuthCode(inputRefs.current.map(el=>el.value).join(''))
    }
    const submitAuthCode = (code:string)=> {
        verifyEmailAuthCode(input.email, code, input.email, input.password, input.phoneNumber).then(res=>{
            // 200 OK
            setIsChanging(true);
                
            setTimeout(()=>{
                setMode("done");
                setIsChanging(false);
                
            }, 400);
        }).catch(err=>{
            if(err.response.status === 400) {
                toast.error("인증번호가 일치하지 않습니다.")
            } else {
                toast.error("이미 가입된 이메일입니다.");
            }

            

        }).finally(()=>{
            loadingMsg.current = 0;
            setIsLoading(false);
        })
    }
    // const submitSignup = () => {
    //     register({name:input.email, password:input.password, phoneNumber:input.phoneNumber}).then(r=>{
    //         console.log(r)
    //         if(r == 200) {
    //             setIsChanging(true);
    //             setMode("done");
    //             setTimeout(()=>{
    //                 setIsChanging(false);
                    
    //             }, 400);
    //         }
    //     }).catch(err=>{
    //         if(err.response.status === 500) {
    //             toast.error("이미 가입된 이메일입니다.");
    //             changeMode();
    //         }
    //     })
    // }
    const submitLogin = () => {
        setIsSubmitting(true);
        login(input.email, input.password).then(res=>{

            toast.success("로그인 성공!");
            setIsLogined(true);
            router.push('/');                


        }).
        catch(err=>{
            if(err.response.status === 400) {
                toast.error("아이디와 비밀번호가 일치하지 않습니다.")
            } else {
                toast.error("로그인을 하는데 오류가 발생했습니다.");
            }
            
        }).finally(()=>setIsSubmitting(false));
    }

    return <Adjuster>
            {mode === "validate" ? <> 
                <Container isChanging={isChanging}>
                    <h1>이메일 인증</h1>
                        {loadingMsg.current === 0 ? <>
                            <LoadingText done={isLoading}>인증 번호를 {input.email}로 전송 중...</LoadingText>                        
                        </>:<>
                            {loadingMsg.current === 1 ? <>
                                <LoadingText done={isLoading}>인증하는 중...</LoadingText>
                            </>:<>
                                <LoadingText done={isLoading}>계정을 생성하는 중...</LoadingText>
                            </>}
                        </>}
                        <CodeContainer done={isLoading}>
                            {[...Array(6)].map((_, i)=>
                                <div key={i}>
                                    <input key={i}
                                           type="text"
                                           maxLength={1}
                                           style={{imeMode:"active"}}
                                           onDrop={()=>false}
                                           ref={el => (inputRefs.current[i] = el)}
                                           onChange={e=>{
                                                onCodeChange();
                                                e.target.value.length === 1 ?
                                                i < 5 &&inputRefs.current[i+1].focus() :
                                                i > 0 && inputRefs.current[i-1].focus()
                                           }

                                          }
                                    />
                                </div>
                            )}
                        </CodeContainer>
                </Container>

            </> : <>
                {mode === "done" ? <>
                    <Container isChanging={isChanging}>
                        <h2>이메일 인증이 완료되었습니다!</h2>
                        <SubmitButton onClick={()=>{changeMode()}} isDisabled={false}>로그인으로</SubmitButton>
                    </Container>
                </>:<>
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
                            <Input>
                                <PrettyInput name="phoneNumber" value={input.phoneNumber} onChange={onChange}
                                placeholder="전화번호"/>
                                <Call fontSize="small"/>
                            </Input>
                            <SubmitButton type="submit" onClick={onSubmit} isDisabled={isSubmitting} disabled={isSubmitting}>회원가입</SubmitButton>
                        </form>
                    </Container>}
                    <ChangeButton onClick={changeMode} isDisabled={isChanging} disabled={isChanging}>
                        {mode==="login" ? "회원가입으로" : "로그인으로"}
                    </ChangeButton>                
                </>}

            </>}
    </Adjuster>
}

