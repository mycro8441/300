import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { useMemo, useRef, useState } from "react";
import styled from "styled-components";
import {useTable} from "react-table";
import Switch from "@/components/switch";
const Container = styled.div`
    width:100%;
    height:100%;
    padding:20px;
    display:flex;  
    gap:10px;
    justify-content: center;
    div {
        border-radius:20px;
    }
`
const Main = styled.div`
    flex:0.8;
    height:100%;
   
    display:flex;
    flex-direction: column;


`
const Sidebar = styled.div`
    flex:0.2;
    height:100%;
    background-color: ${p=>p.theme.colors.blockColor};
    overflow-x:hidden; 
    
`
const SidebarOption = styled.div<{activated:boolean}>`
    width:100%;
    height:2em;
    display:flex;
    justify-content: center;
    align-items:center;
    border-radius:0px !important;
    background-color: ${p=>p.activated ? p.theme.colors.signatureBlue : p.theme.colors.blockColor};
    cursor:pointer;
    &:hover {
        background-color: ${p=>p.theme.colors.invertColor};
        transition: 0.3s ease;
    }
`
const IndexContainer=styled.div`
    display:flex;
    flex-direction:column;
    background-color: ${p=>p.theme.colors.blockColor};
`
const BubbleBox = styled.div`
    width:100%;
    height:auto;
    padding:0.4em;
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
const PrettyTable = styled.table`
    width:100%;
    height:auto;
    border-collapse: collapse;
    border-radius:10px;
    box-shadow: 0 0 0 2px #fff;
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
    td {
            text-align:center;
    }



`


const EditBtn = styled.div`

    height:1em;
    background-color: ${p=>p.theme.colors.signatureRed};
    justify-content: center;
    align-items: center;
    display:flex;
    border-radius: 5px !important;
`


const Index = () => {
    const data = useMemo(
        () => [
          {
            col1: 'Hello',
            col2: 'World',
          },
          {
            col1: 'react-table',
            col2: 'rocks',
          },
          {
            col1: 'whatever',
            col2: 'you want',
          },
        ],
        []
      )
    
      const columns = useMemo(
        () => [
          {
            Header: 'username',
            accessor: 'col1', // accessor is the "key" in the data
          },
          {
            Header: 'password',
            accessor: 'col2',
          },
          {
            Header: 'point',
            accessor: 'col3',
          },
          {
            Header: '',
            accessor: 'col4',
            width:20,
            Cell: () => (
                <>
                    <EditBtn>
                        Edit
                    </EditBtn>
                </>


            )
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
        <IndexContainer>
            <BubbleBox>
                <Searchbar>
                    <input placeholder="Search"/>
                    <SubmitBtn>
                        Search
                    </SubmitBtn>
                </Searchbar>
            </BubbleBox>
            <BubbleBox>
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
                                    {row.cells.map(cell=> {
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
            <BubbleBox>
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
                                    {row.cells.map(cell=> {
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
        </IndexContainer>
    </>
}
const Options = () => {
    const [on, setOn] = useState<boolean>(false);
    return <>
        options
        <Switch state={on} setfunc={setOn}/>
    </>
}


Admin.navbar = false;
export default function Admin() {
    
    

    const [mode, setMode] = useState<boolean[]>([true, false, false]);
    const lastIndex = useRef<number>(0);
    const curpage = useRef<JSX.Element>(<Index/>); // 로직상으로 ref로 설정해도 setMode로 인해서 업데이트가 필연적임
    const curpageName = useRef<string>('Dashboard');
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
                <SidebarOption activated={mode[0]} onClick={()=>{curpage.current=<Index/>;curpageName.current = "DashBoard"; Select(0)}}>
                    Dashboard
                </SidebarOption>
                <SidebarOption activated={mode[1]} onClick={()=>{curpage.current=<Options/>;curpageName.current = "Config";Select(1)}}>
                    Config
                </SidebarOption>
            </Sidebar>
            <Main>
                <PageTitle>
                    {curpageName.current}
                </PageTitle>
                {curpage.current}
            </Main>
        </Container>
    </>
}

const PageTitle = styled.div`
    padding:10px;
    font-size:4em;

`