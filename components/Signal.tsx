import { useMemo } from "react";
import styled from "styled-components";
import {useTable} from "react-table";
import { RemoveRedEye } from "@mui/icons-material";

const dummydata = [ 
    {
    "min": 1,
    "coin": "BTC",
    "long_short": "long",
    "num": "1000000",
    "localDateTime": "2021-08-01T00:00:00"
    },
    {
    "min": 1,
    "coin": "BTC",
    "long_short": "short",
    "num": "1000000",
    "localDateTime": "2021-08-02T00:00:00"
    },
    {
    "min": 1,
    "coin": "BTC",
    "long_short": "long",
    "num": "1000000",
    "localDateTime": "2021-08-03T00:00:00"
    },
    {
    "min": 1,
    "coin": "BTC",
    "long_short": "long",
    "num": "1000000",
    "localDateTime": "2021-08-03T00:00:00"
    },
    {
    "min": 1,
    "coin": "BTC",
    "long_short": "long",
    "num": "1000000",
    "localDateTime": "2021-08-03T00:00:00"
    },
    {
    "min": 1,
    "coin": "BTC",
    "long_short": "long",
    "num": "1000000",
    "localDateTime": "2021-08-03T00:00:00"
    },
    {
    "min": 1,
    "coin": "BTC",
    "long_short": "long",
    "num": "1000000",
    "localDateTime": "2021-08-03T00:00:00"
    }
]


const Container = styled.div`
    width:100%;
    height:auto;
    display:flex;
    padding:20px;
    justify-content: space-between;
`
const PrettyTable = styled.table`
    width:100%;
    height:auto;
    padding:5px;
    border-radius:10px;
    thead > tr {
        border-bottom: 2px solid ${p=>p.theme.colors.invertColor};
        th::after {
            content:'';
            width:1px;
            position:absolute;
            top:0;
            left:0;
            bottom:0;
            background-color: white;
        }
    }
    td, th {

    }
    td {
            text-align:center;
            
    }



`
const BubbleBox = styled.div`
    width:100%;
    height:100%;
`

const PositionColor = styled.div<{isShort:boolean}>`
    color:${p=>p.isShort ? p.theme.colors.signatureRed : p.theme.colors.signatureMint};
`

const PayBtn  =styled.div`
    width:100%;

    height:2em;
    border-radius:5px;
    display:flex;
    justify-content: center;
    align-items: center;
    background-color: ${p=>p.theme.colors.signatureBlue};
`
export default function Signal() {


    

    const data = useMemo(
        () => dummydata ,    
        []
      )
    
      const columns = useMemo(
        () => [
          {
            Header: 'Pair',
            accessor: 'coin', 
          },
          {
            Header: 'Position',
            accessor: 'long_short',
            Cell: ({value, row}) => (
                <>
            
                    <PositionColor isShort={value == "short"}>
                        {value[0].toUpperCase() + value.slice(1, value.length)}
                    </PositionColor>  

               
                </>


            )
          },    
          {
            Header: 'Price',
            accessor: 'num',
            
          },
          {
            Header: 'Time',
            accessor: 'localDateTime',
            
          },
          {
            Header: 'Profit',
            accessor: 'profit',
            
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
      } = useTable({ columns, data })

    return <>
            <BubbleBox>
                <PayBtn>최근 시그널 3개 보기</PayBtn>
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
                        {rows.map(row=>{
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>

                                    {row.cells.map((cell, i)=> {
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
            </BubbleBox>
    </>
}