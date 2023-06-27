import {useEffect, useMemo, useRef, useState} from "react";
import styled from "styled-components";
import {useTable} from "react-table";
import { RemoveRedEye } from "@mui/icons-material";
import useSWR from "swr";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import useStore from "../store";
import {buySignal, getBoughtSignal, getSignal} from "@/lib/api/signal";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const Container = styled.div`
    width:100%;
    height:100%;
    display:flex;
    padding:20px;
    justify-content: space-between;
`
const PrettyTable = styled.table`
    width:100%;
    flex:1;
    padding:5px;
    border-radius:10px;
    thead {
        position:sticky;
        top:0px;
        margin:0 0 0 0;
        border-radius: 20px;
        backdrop-filter: blur(10px);
    }
    thead > tr {
        border-bottom: 2px solid ${p=>p.theme.colors.invertColor};
        th {
            line-height: 30px;
        }

    }
    td {
            text-align:center;
    }
    tbody {
        overflow:scroll;
    }
`
const Adjust = styled.div`
    display:flex;
    flex-direction: column;
    gap:10px;
    height:100%;
`
const BubbleBox = styled.div`
    flex:1;
    width:100%;
    overflow-y: auto;
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

const PositionColor = styled.div<{isShort:boolean}>`
    color:${p=>p.isShort ? p.theme.colors.signatureRed : p.theme.colors.signatureMint};
`

const PayBtn  =styled.div`
    width:100%;
    color:white;
    height:2em;
    border-radius:5px;
    display:flex;
    justify-content: center;
    align-items: center;
    background-color: ${p=>p.theme.colors.signatureBlue};
    cursor:pointer;
`
const OptionBlock = styled.div`
    height:100px;
    width:100%;
    background-color: ${p=>p.theme.colors.blockColor};
    border-radius: 20px;

    div {
        margin:5px;
        padding:0;
        margin-top:10px;
        border:none;
        border-radius: 10px;
    }
    div > div {
        background-color: ${p=>p.theme.colors.signatureBlue};
    }
    div > div:last-child {
        div {
            color:white;
        }
        div:hover {
            background-color: #232f80;
        }
        &::-webkit-scrollbar {
        width:10px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: black;
        border-radius: 10px;
        background-clip:padding-box;
        border:2px solid transparent;
    }
        
    }
    div > div > div {
        padding-left:5px;
    }
`
const SelectBar = styled.div`
    display:flex;
    background-color: ${p=>p.theme.colors.bgColor};
    border-radius: 10px;
    height:2em;
    overflow:hidden;
    margin:10px !important;
`
const SelectBox = styled.div<{selected:boolean}>`
    flex:1;
    height:100%;
    display:flex;
    justify-content: center;
    align-items: center;
    color:${p=>p.selected ? "white" : "gray"};
    margin:0 !important;
    border-radius:0 !important;
    background-color:${p=>p.selected ? `${p.theme.colors.signatureBlue} !important`:`${p.theme.colors.bgColor} !important`};
    cursor:pointer;
`

type Signal = {
    id:string;
    cryptoName:string;
    timeFrame:"5m"|"15m"|"30m"|"1h";
    side:"sell"|"buy"|"-";
    closePrice:string;
    localDateTime:string;
}
const options = [
    "BTCUSDT",
    "ETHUSDT",
    "XRPUSDT",
    "ADAUSDT",
    "DOGEUSDT",
    "MATICUSDT",
    "SOLUSDT",
    "DOTUSDT",
    "LTCUSDT",
    "TRXUSDT",
    "AVAXUSDT",
    "LINKUSDT",
    "UNIUSDT",
    "ATOMUSDT",
    "ETCUSDT",
    "XMRUSDT",
    "XLMUSDT",
    "BCHUSDT",
    "FILUSDT",
    "LDOUSDT",
    "APTUSDT",
    "VETUSDT",
    "NEARUSDT",
    "ALGOUSDT",
    "APEUSDT",
    "ARBUSDT",
    "ICPUSDT",
    "QNTUSDT",
    "EOSUSDT",
    "GRTUSDT",
    "FTMUSDT",
    "STXUSDT",
    "MANAUSDT",
    "AAVEUSDT",
    "THETAUSDT",
    "XTZUSDT",
    "AXSUSDT",
    "SANDUSDT",
]
function isNumMatch(mode:0|1|2|3, num:"5m"|"15m"|"30m"|"1h") {
    if(mode === 0 && num === "5m") return true;
    if(mode === 1 && num === "15m") return true;
    if(mode === 2 && num === "30m") return true;
    if(mode === 3 && num === "1h") return true;
    return false;    
}
interface SignalInfo {
    id:string;
    cryptoName:string;
    timeFrame:"5m"|"15m"|"30m"|"1h";
    side:"sell"|"buy";
    closePrice:string;
    localDateTime:string;
}
interface UserInfo {
    id:number;
    username:string;
    password:string;
    phoneNumber:string;
    role:"ROLE_USER"|"ROLE_ADMIN";
    point:number;
    payResult:any;
    usrPw:string;
    ban:boolean;
}
type BoughtSignal = {
    uuid:number;
    payUser:UserInfo;
    payTime:string;
    coinList: SignalInfo[];
}
export default function Signal({

                               }) {
    const {curPair, setCurPair, userInfo} = useStore();

    const [mode, setMode] = useState<0|1|2|3>(0);
    const router = useRouter()
    
   

    const { data, error, mutate } = useSWR<Signal[]>("/webhook/get/signal",getSignal,{refreshInterval:10000});
    const [finalData, setFinalData] = useState<Signal[]>(null);


    useEffect(()=>{
        if(data) {
            getBoughtSignal().then((res:BoughtSignal)=>{
                setFinalData(data
                    .filter(
                        // @ts-ignore
                        (v, i) => {
                            if(v.cryptoName.replace(".P","") == curPair && isNumMatch(mode, v.timeFrame)) {
                                if(i<=1) {
                                    res.coinList.forEach(coin=>{
                                        if(coin.id !== v.id) {
                                            data[i] = {
                                                id:data[i].id,
                                                cryptoName:data[i].cryptoName,
                                                timeFrame:data[i].timeFrame,
                                                side:"-",
                                                closePrice:"-",
                                                localDateTime:"-",
                                            }
                                        }
                                        
                                    })
                                }
                                return true;
                            } else return false;

                        }
                    ).
                    sort(
                    (a,b) => new Date(b.localDateTime).getTime() - new Date(a.localDateTime).getTime()
                )
                );
            })   
        }            


},[curPair, mode])
    const columns = useMemo(
        () => [
          {
            Header: 'Position',
            accessor: 'side',
            Cell: ({value, row}) => (
                    <PositionColor isShort={value == "sell"}>
                        {value.toUpperCase()}
                    </PositionColor>
            )
          },
          {
            Header: 'Price',
            accessor: 'closePrice',
          },
          {
            Header: 'Time',
            accessor: 'localDateTime',
              sortType: 'datetime',
            Cell: ({value, row}) => {
                const date = new Date(value);
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const hour = date.getHours();
                const min = date.getMinutes();
                return `${year}-${month}-${day} ${hour}:${min}`
            }
          },
        ],
        []
      )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    //@ts-ignore
  } = useTable({ columns, data:finalData??[] })
    const onSelect = e => {
        setCurPair(e.value)
    }


    const purchaseSignal = () => {
        buySignal(curPair).then(res=>{
            toast.success(curPair+"의 시그널을 구매하였습니다.");
            mutate();
        }).catch(err=>{
            if(err.response.status === 400) {
                toast.error("포인트가 부족합니다.")
            } else {
                toast.error("오류가 발생했습니다.");
            }
            
        })
    }
    return <Adjust>
            <OptionBlock>
                <Dropdown options={options} onChange={onSelect} value={curPair + ".P"}/>
                <SelectBar>
                    <SelectBox onClick={()=>setMode(0)} selected={mode === 0}>
                        5M
                    </SelectBox>
                    <SelectBox onClick={()=>setMode(1)} selected={mode === 1}>
                        15M
                    </SelectBox>
                    <SelectBox onClick={()=>setMode(2)} selected={mode === 2}>
                        30M
                    </SelectBox>
                    <SelectBox onClick={()=>setMode(3)} selected={mode === 3}>
                        1H
                    </SelectBox>
                </SelectBar>
            </OptionBlock>
            <BubbleBox>
                <PayBtn onClick={()=>{
                    purchaseSignal();
                }}>현재 시그널 보기</PayBtn>
                {finalData ? <>
                <PrettyTable {...getTableProps()}>
                        <thead>
                            {headerGroups.map(headerGroup=>(
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column=>(
                                        <th {...column.getHeaderProps()}>
                                            {column.render('Header')}
                                        </th>
                                    ))}
                                </tr>
                            ))}

                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {rows
                                ?.map((row,index)=>{
                                if((index == 0 || index == 1)) {
                                    return(
                                        <tr key={index} role={"row"}>
                                            <td role={"cell"}>-</td>
                                            <td role={"cell"}>-</td>
                                            <td role={"cell"}>-</td>
                                        </tr>
                                    )
                                }
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()}>
                                        {row.cells
                                            .map((cell, i)=> {

                                            return (
                                                <td {...cell.getCellProps()}>
                                                {cell.render('Cell')}

                                            </td>
                                            )
                                        })}

                                    </tr>
                                )
                            })}

                        </tbody>
                    </PrettyTable>                
                </> : <>
                    <div style={{textAlign:"center", marginTop:"1em"}}>불러오는 중입니다...</div>
                    
                </>}
 
            </BubbleBox>
    </Adjust>
}
