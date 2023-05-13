import { Avatar } from "@mui/material";
import { useCallback, useMemo, useState } from "react"
import styled from "styled-components"

type sliderType = 0|1|2;
const abs = (n:number) => n < 0 ? -n : n;
const Container = styled.div`
    width:100%;
    height:auto;

`
const Slider = styled.div`
    position:fixed;
    top:70px;
    left:50%;
    transform:translateX(-50%);
    height:25px;
    width:800px;
    max-width:60%;
    border-radius:1em;
    background-color: ${p=>p.theme.colors.invertColor};
    display:flex;
    overflow:hidden;
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

`
const HiddenSliderButton = styled.div<{mode:sliderType, index:sliderType}>`
    flex:1;
    text-align: center;
    opacity: ${p=>1-abs(p.index-p.mode)/3};
    transition:0.4s cubic-bezier(0.645, 0.045, 0.355, 1);
    cursor:pointer;
`
const BlockAdjuster = styled.div`
    width:100%;
    height:auto;
    display:flex;
    justify-content: center;
`
const BlockSlider = styled.div`
    padding-top:60px;
    width:1000px;
    max-width:80%;
`
const Block = styled.div`
    width:100%;
    height:auto;
    max-height:1000px;
    background-color: ${p=>p.theme.colors.invertColor};
    border-radius: 20px;
    padding:20px;
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
`

const BlockContent = styled.div`
    
`
type BlockType = {
    profileURL?:string,
    name:string,
    email?:string,
    photoURL?:string,
    timeStamp:number,
    content:string,
}


export default function Notice() {
    const [blockList, setBlockList] = useState<BlockType[]>([
        {
            name:"owner",
            timeStamp: new Date().getTime(),
            content:"ㅎㅇㅎㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅎㅇㅇ"


        },
        {
            name:"owner",
            timeStamp: new Date().getTime(),
            content:"ㅎㅇ"


        },
        {
            name:"owner",
            timeStamp: new Date().getTime(),
            content:"ㅎㅇ"


        }

    ]);
    const SliderComponent =() => { // 모드가 변함에 따라 업데이트해주기 때문에 state를 밖으로 뺌
        const content = ["IMPORTANT", "UPDATE", "NOTICE"];
        const [mode, setMode] = useState<sliderType>(0); // localStorage에 마지막 모드 저장 후 불러오기    
        // mode state를 바깥으로 뺄 경우 transition 적용 안됨 버그..
        // 이 블럭에서 외부 state 변경 함수를 실행하는 것으로 해결 예정

        return <>
            <Slider>
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

    return <>

        <Container>
            <SliderComponent/>
            <BlockAdjuster>
                <BlockSlider>
 
                    {blockList.map(obj=>(
                        <>
                            <Block>
                                <BlockHeader>
                                    <Avatar/>
                                    {obj.name}
                                    {obj.timeStamp}
                                </BlockHeader>
                                {obj.content}
                            </Block>                        
                        </>
                    ))}

                </BlockSlider>
            </BlockAdjuster>
        </Container>
    </>
}