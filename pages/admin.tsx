import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { useRef, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
    width:100%;
    height:100%;
    padding:20px;
    display:flex;  
    gap:10px;
    justify-content: center;
    div {
        border-radius: 20px;
    }
`
const Main = styled.div`
    flex:0.8;
    height:100%;
    background-color: ${p=>p.theme.colors.blockColor};
`
const Sidebar = styled.div`
    flex:0.2;
    height:100%;
    background-color: ${p=>p.theme.colors.blockColor};
`
const SidebarOption = styled.div<{activated:boolean}>`
    width:100%;
    height:2em;
    display:flex;
    justify-content: center;
    align-items:center;
    background-color: ${p=>p.activated ? p.theme.colors.invertColor : p.theme.colors.blockColor};
    cursor:pointer;
    &:hover {
        background-color: ${p=>p.theme.colors.invertColor};
        transition: 0.3s ease;
    }
`
const IndexContainer=styled.div`
    display:flex;
    flex-direction:column;
`
const BubbleBox = styled.div`
    width:100%;
    height:auto;
    padding:0.4em;
    background-color: ${p=>p.theme.colors.invertColor};
`
const Searchbar = styled.div`
    width:100%;
    height:2em;
    display:flex;
    gap:0.4em;
    input {
        flex:1;
        border:none;
        border-radius: 15px;
    }
`
const SubmitBtn = styled.div`
    width:4em;
    height:2em;
    background-color: ${p=>p.theme.colors.pointColor1};
    border-radius:5px;
    display:flex;
    align-items: center;
    justify-content: center;
`
const Index = () => {
    return <>
        <IndexContainer>
            <BubbleBox>
                <Searchbar>
                    <input placeholder="Search"/>
                    <SubmitBtn>
                        Search
                    </SubmitBtn>
                </Searchbar>
            </BubbleBox>
        </IndexContainer>
    </>
}
const Options = () => {
    return <>
        options
    </>
}
export default function Admin() {
    
    

    const [mode, setMode] = useState<boolean[]>([true, false, false]);
    const lastIndex = useRef<number>(0);
    const curpage = useRef<JSX.Element>(<Index/>); // 로직상으로 ref로 설정해도 setMode로 인해서 업데이트가 필연적임
    const Select = i => {
        const newArray = [...mode];
        newArray[lastIndex.current] = false;
        newArray[i] = true;
        lastIndex.current = i;
        setMode(newArray);
    }


    return <>
        <Container>
            <Sidebar>
                <SidebarOption activated={mode[0]} onClick={()=>{curpage.current=<Index/>;Select(0)}}>
                    Main
                </SidebarOption>
                <SidebarOption activated={mode[1]} onClick={()=>{curpage.current=<Options/>;Select(1)}}>
                    Options
                </SidebarOption>
            </Sidebar>
            <Main>
                {curpage.current}
            </Main>
        </Container>
    </>
}