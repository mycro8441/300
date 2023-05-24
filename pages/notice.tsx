import { ArrowUpward } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import styled from "styled-components"

type sliderType = 0|1|2;
const abs = (n:number) => n < 0 ? -n : n;
const Container = styled.div`
    width:100%;
    height:auto;

`
const Slider = styled.div<{active:boolean}>`
    position:fixed;
    top:70px;
    left:50%;
    transform: ${p=>!p.active ? "translate(-50%, -50px);" : "translate(-50%, 0px);"};
    transition: 0.2s cubic-bezier(0.165, 0.84, 0.44, 1);
    height:25px;
    width:800px;
    max-width:60%;
    border-radius:1em;
    background-color: ${p=>p.theme.colors.invertColor};
    display:flex;
    overflow:hidden;
    z-index: 3;
`
const SliderPicker = styled.div<{mode:sliderType}>`
    position:absolute;
    left:${p=>50 * p.mode + "%"};
    transform: ${p=>`translateX(-${50*p.mode}%)`};  
    width:250px;
    max-width:30%;
    height:100%;
    transition:0.3s cubic-bezier(0.215, 0.610, 0.355, 1);
    background-color: ${p=>p.theme.colors[`pointColor${p.mode+1}`]};
    border-radius: 1em;
    text-align:center;
    display:flex;
    align-items:center;
    justify-content:center;

`
const HiddenSliderButton = styled.div<{mode:sliderType, index:sliderType}>`
    flex:1;
    text-align: center;
    opacity: ${p=>1-abs(p.index-p.mode)/3};
    transition:0.4s cubic-bezier(0.645, 0.045, 0.355, 1);
    cursor:pointer;
    display:flex;
    align-items:center;
    justify-content:center;
`
const BlockAdjuster = styled.div`
    position:absolute;
    top:0;
    padding-top:50px;
    width:100%;
    height:100vh;
    display:flex;
    justify-content: center;
`
const BlockSlider = styled.div`
    padding-top:60px;
    width:1000px;
    max-width:80%;
    height:100%;
    position:relative;
    overflow-y: auto;

    z-index:2;
    &::-webkit-scrollbar {
        width:10px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: ${p=>p.theme.colors.invertColor};
        border-radius: 10px;
        background-clip:padding-box;
        border:3px solid transparent;
    }
`
const Block = styled.div`
    width:100%;
    height:auto;
    max-height:900px;
    background-color: ${p=>p.theme.colors.invertColor};
    border-radius: 20px;
    padding:30px;
    margin-bottom:10px;
    display:flex;
    flex-direction: column;
`

const BlockHeader = styled.div`
    top:0;
    width:100%;
    height:50px;
    display:flex;
    align-items:center;
    gap:10px;
    margin-bottom:10px;
`
const BlockImage = styled.div`
    width:100%;
    height:auto;
    max-height:700px;
    overflow-y: auto;
    border-radius: 20px;
    
    &::-webkit-scrollbar {
        width:10px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: black;
        border-radius: 10px;
        background-clip:padding-box;
        border:2px solid transparent;
    }
`
const BlockContent = styled.div`
    flex:1;
    width:100%;
    overflow-y: auto;
    padding:10px;
    &::-webkit-scrollbar {
        width:10px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: black;
        border-radius: 10px;
        background-clip:padding-box;
        border:2px solid transparent;
    }
    

`
const SliderEnd = styled.div`
    width:100%;
    color:${p=>p.theme.colors.textColor};
    text-align: center;
    padding-top: 15px;
    height:60px;
`
type BlockType = {
    profileURL?:string,
    name:string,
    email?:string,
    photoURL?:string,
    timeStamp:number,
    content:string,
    type:"IMPORTANT" | "UPDATE" | "NOTICE",
}

const TopButtonAdjust = styled.div`
    position:fixed;
    right:15px;
    bottom:15px;
    width:50px;
    height:50px;
    cursor:pointer;
`
const TopButton  =styled.div`
    width:100%;
    height:100%;
    border-radius: 50px;
    background-color: ${p=>p.theme.colors.invertColor};
    display: flex;
    align-items: center;
    justify-content: center;
`



const AdminBlock = () => {
    const [description, setDescription] = useState('')

    return <>
        <AdminBlockContainer>
            <div style={{display:"flex", gap:"1em"}}>
                <PrettyInput>
                    <p>Title</p>
                    <input value={description} onChange={e=>setDescription(e.target.value)}/>
                </PrettyInput>
                <PrettyInput>

                </PrettyInput>
            </div>
            <PrettyInput/>
        </AdminBlockContainer>
    </>
}
const AdminBlockContainer = styled.div`
    width:100%;
    height:auto;
    background-color: ${p=>p.theme.colors.invertColor};
    border-radius: 20px;
    padding:30px;
    margin-bottom:10px;
`
const PrettyInput = styled.div`
    height:2.5em;
    flex:1;
    width:100%;
    margin-bottom:10px;
    p {
        margin:0;
    }
    input {
        border:1px solid gray;
        border-radius:15px;
        width:100%;

    }
`

export default function Notice() {
    const [blockList, setBlockList] = useState<BlockType[]>([
        {
            name:"owner",
            timeStamp: new Date().getTime(),
            content:"ㅎㅇㅎㅇㅇ",
            type:"IMPORTANT",

        },
        {
            name:"owner",
            timeStamp: new Date().getTime(),
            content:"ㅎㅇ",
            type:"NOTICE",


        },
        {
            name:"owner",
            timeStamp: new Date().getTime(),
            content:"ㅎㅇ",
            type:"UPDATE"


        }

    ]);


    const SliderComponent =() => { // 모드가 변함에 따라 업데이트해주기 때문에 state를 밖으로 뺌
        const content = ["IMPORTANT", "UPDATE", "NOTICE"];
        const [mode, setMode] = useState<sliderType>(0); // localStorage에 마지막 모드 저장 후 불러오기    
        // mode state를 바깥으로 뺄 경우 transition 적용 안됨 버그..
        // 이 블럭에서 외부 state 변경 함수를 실행하는 것으로 해결 예정
        const [isSliderVisible, setIsSliderVisible] = useState<boolean>(true);
        let lastScrollY = 0;
        let lastDir = false;
        useEffect(()=>{
            addEventListener("mousewheel", (e:WheelEvent) => {
                
                const scrollY = window.scrollY;
                
                const dir = e.deltaY > 0;
                
                if(dir == lastDir) return;
                if(dir) {
                    setIsSliderVisible(false);
                } else {
                    setIsSliderVisible(true);
                }
                
                lastDir = dir;
                lastScrollY = scrollY;
              });
        }, [])
        return <>
            <Slider active={isSliderVisible}>
                {[...Array(3)].map((v, i:sliderType)=>(
                    <HiddenSliderButton key={i} mode={mode} index={i} onClick={()=>setMode(i)}>
                        {content[i]}
                    </HiddenSliderButton>
                ))}
                <SliderPicker mode={mode}>
                    {content[mode]}
                </SliderPicker>
            </Slider>    
        </>
    }

    const isAdmin = useRef<boolean>(false);
    const [inited, setInited] = useState(false); // hydration 오류 해결
    useEffect(()=>{
        isAdmin.current =true;
        setInited(true);
        
    }
    , []);

    const topRef = useRef<HTMLDivElement>(null); // 맨 위로 가기를 위한 ref
    const onTopBtnClick = () => {
        topRef.current?.focus();
    }
    return <>
        {inited && <>
            <Container>
                <SliderComponent/>
                <BlockAdjuster>
                    <BlockSlider>
                        <div ref={topRef}/>
                        {isAdmin.current && <>
                            <AdminBlock/>
                        </>}
                        {blockList.map((obj, i)=>(

                                <Block key={i}>
                                    <BlockHeader>
                                        <Avatar/>

                                            {obj.name}
                                            {obj.timeStamp}   
                                            {obj.type}                                     

                                    </BlockHeader >
                                    <BlockImage>
                                        <Image width={0} height={0} sizes="100vw" style={{width:"100%", height:'auto'}} src="https://www.shutterstock.com/image-vector/sample-red-square-grunge-stamp-260nw-338250266.jpg" alt=""/>
                                    </BlockImage>
                                    <BlockContent >
                                        {obj.content}
                                    </BlockContent>
                                    
                                </Block>                        

                        ))}
                        <SliderEnd>
                            더 이상 게시물이 없습니다.
                        </SliderEnd>
                    </BlockSlider>
                </BlockAdjuster>
            </Container>        
            <TopButtonAdjust>
                <TopButton onClick={()=>onTopBtnClick()}>
                    <ArrowUpward/>
                </TopButton>
            </TopButtonAdjust>
        </>}

    </>
}