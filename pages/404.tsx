import styled from "styled-components"


const Adjust = styled.div`
    width:100%;
    height:100%;

    display:flex;
    justify-content: center;
    align-items: center;
`

const Block = styled.div`
    width:300px;
    height:180px;
    display:flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    border-radius: 20px;
    background-color: ${p=>p.theme.colors.blockColor};
`
const PrettyNumber = styled.div`
    font-size:1em;
    height:1.2em;
    padding:0 10px;
    width:120px;
    font-size:3em;
    text-align: center;
    transition: 0.3s ease;
    border-radius: 10px;
    background-color: ${p=>p.theme.colors.bgColor};
    color:${p=>p.theme.colors.signatureBlue};
    font-weight: bold;
`
const Custom404 = () => {


    return <Adjust>
        <Block>
            <PrettyNumber>404</PrettyNumber>
            <h4>잘못된 페이지에 접근하였습니다.</h4>
        </Block>
    </Adjust>
}

Custom404.navbar = true;
export default Custom404;