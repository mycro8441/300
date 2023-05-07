import styled from "styled-components"
import {useForm} from "react-hook-form";
import {toast} from "react-toastify";
import { useEffect } from "react";

const Container = styled.div`
    width:400px;
    height:auto;
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%, -50%);
    background-color: white;
    border-radius: 50px;
    padding:30px;
    text-align:center;
`
const Input = styled.div`
    position: relative;
    width:90%;
    height:50px;
    margin:auto;
    text-align:left;
    display:flex;
    flex-direction: column;
`
const PrettyInput = styled.input`

    width:100%;
    height:100%;
    border-radius: 10px;
    border:none;
`
export default function Login({}) {
    const {register, handleSubmit, watch, formState:{errors}} = useForm();
    const onSubmit = data => {
        console.log(data);
    }
    useEffect(()=>{
    }, [])
    
    return <>
        <Container>
            <h1>로그인</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Input>
                    <label>이메일</label>
                    <PrettyInput {...register("email")}/>
                </Input>
            </form>
        </Container>

    
    </>
}