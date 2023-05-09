import styled from "styled-components";
import { Search } from "@mui/icons-material";
import { useState } from "react";

const Container = styled.div`
    left:0;
    width:100%;
    height:50px;
    padding: 0 20px;
    box-shadow: 0 0px 10px 2px #bbb;
    display:flex;
    align-items: center;
    background-color: white;
`
const InputContainer = styled.form`
    position: absolute;
    left:50%;
    transform:translateX(-50%);
    height:30px;
    width:400px;
    max-width:35%;
    div > svg {
        cursor:pointer;
        position:absolute;
        top:50%;
        transform:translateY(-50%);
        opacity:0.5;
        right:10px;
    }
 
`
const SearchBar = styled.input`
    height:100%;
    width:100%;
    padding-left:15px;
    padding-right:35px;
    border-radius: 30px;
    border:none;
    box-shadow: 0px 0px 10px 1px #bbb;
    &:focus {
        outline:none;
    }
`
const RightSide = styled.div`
    display:flex;
    gap:10px;
`
const SearchComponent = () => {
    const [value, setValue] = useState<string>('');

    const onSubmit = (e) => {
        e.preventDefault();
        
    }

    return <InputContainer onSubmit={onSubmit}>
            <SearchBar value={value} onChange={e=>setValue(e.target.value)}/>
            <div><Search fontSize="small"/></div>      
    </InputContainer>

}

const NavBar = () => {

    return <Container>
        <h2>LOGO</h2>
        <SearchComponent/>
        <RightSide>
        
        </RightSide>
    </Container>
}

export default NavBar;