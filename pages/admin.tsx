import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import styled from "styled-components";
import {
    Column,
    Table,
    ColumnDef,
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    RowData,
  } from '@tanstack/react-table';
import Switch from "@/components/switch";
import { toast } from "react-toastify";
import { banUser, getUserList, setPoint, setSignalCost } from "@/lib/api/admin";
import { getPayUsers } from "@/lib/api/pay";

const Container = styled.div`

    overflow-y:auto;
    width:100%;
    height:100%;
    padding:20px;
    padding-bottom:50px;
    display:flex;  
    gap:10px;
    justify-content: center;
    div {
        border-radius:20px;
    }


`
const Main = styled.div`

    flex:0.9;

    display:flex;
    flex-direction:column;
`
const Sidebar = styled.div`
    flex:0.1;
    
    height:100%;
    background-color: ${p=>p.theme.colors.blockColor};
    overflow-x:hidden;
    
`
const SidebarOption = styled.div<{activated:boolean}>`
    color:white;
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
    padding:10px;
    background-color: ${p=>p.theme.colors.blockColor};

`
const PrettyButton = styled.button`
    width:auto;
    height:2em;
    border-radius: 0.2em;
    background-color: ${p=>p.theme.colors.signatureBlue};
    border:none;
    border-radius: 1em;
    display: flex;
    padding:5px;
    justify-content: center;
    align-items: center;
    cursor:pointer;
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
    background-color: ${p=>p.theme.colors.signatureBlue};
    border-radius:5px !important;
    display:flex;
    align-items: center;
    justify-content: center;
    cursor:pointer;
`
const PrettyTable = styled.table`
    width:100%;
    height:auto;

    border-collapse: collapse;
    border-radius:10px;
    box-shadow: 0 0 0 2px gray;
    thead > tr {
        border-bottom: 2px solid gray;

    }
    td {
            text-align:center;
    }
    input {
        width:100%;
        max-height:2em;
        border-radius: 15px;
        border:none;
        background:${p=>p.theme.colors.bgColor};

        padding-left:15px;
    }
    input[type=number]::-webkit-inner-spin-button {
    }


`

const MiniInput = styled.input`
    min-width:10em;
    width:auto;
    height:2em;
    margin:10px;
    border-radius: 15px;
    border:none;
    background:${p=>p.theme.colors.bgColor};
    box-sizing:border-box;
    padding-left:15px;

    &::-webkit-inner-spin-button {
        display: none;
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

const ButtonPlate = styled.div`
    display:flex;
    justify-content:center;
    align-items: center;
    gap:0.5rem;
    
`
const PrettySpan = styled.span`
    display:flex;
    justify-content: center;
    align-items: center;
    gap:1em;
`
const PrettySelect = styled.select`
    background-color: ${p=>p.theme.colors.bgColor};
    border:none;
    border-radius: 1em;
    padding:5px;
    option {
        border:none;
    }
    
`
const Banbtn = styled.div<{banned:boolean}>`
  height:100%;
  width:40px;
  border-radius:5px !important;
  cursor:${p=>p.banned ? "normal" : "pointer"};
  display:flex;
  justify-content: center;
  align-items:center;
  background-color: ${p=>p.banned ? p.theme.colors.signatureBlue : p.theme.colors.signatureRed};
`

type User = {
  id:number;
  email:string;
  phoneNumber:string;
  role:string;
  encryptedPw:string;
  points:number;
  ban:boolean;
  usrPw:string;
}

declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
      updateData: (rowIndex: number, columnId: string, value: unknown) => void
    }
}
  
  // Give our default column cell renderer editing superpowers!
const defaultColumn: Partial<ColumnDef<User>> = {
    cell: ({ getValue, row: { index,original }, column: { id }, table }) => {
      const initialValue = getValue()
      // We need to keep and update the state of the cell normally
      const [value, setValue] = useState(initialValue)
      
      if(id === "Ban") {
        return <Banbtn banned={original.ban} onClick={()=>{
          // @ts-ignore
          banUser(original.username).then(res=>{
            // @ts-ignore
            toast.success(`${original.username}을 밴 처리하였습니다.`);
          }).catch(err=>{
            toast.error("밴 처리 과정에서 오류가 발생하였습니다.");
          })
        }}>
          {original.ban ? "밴됨" : "밴"}
        </Banbtn>
      }
      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        if(id == "point") {
          // @ts-ignore
          
          setPoint(original.username, value).then(res=>{
            // @ts-ignore
            toast.success(`${original.username}의 포인트를 변경하였습니다.`)
          }).catch(err=>{
            toast.error("포인트 변경에 실패했습니다")
          })
        }
        table.options.meta?.updateData(index, id, value)
      }
  
      // If the initialValue is changed external, sync it up with our state
      useEffect(() => {
        setValue(initialValue)
      }, [initialValue])
  
      return (
        <input
          value={value as string}
          onChange={e => setValue(e.target.value)}
          onBlur={onBlur}
        />
      )
    },
  }
  
function useSkipper() {
    const shouldSkipRef = useRef(true)
    const shouldSkip = shouldSkipRef.current
  
    // Wrap a function with this to skip a pagination reset temporarily
    const skip = useCallback(() => {
      shouldSkipRef.current = false
    }, [])
  
    useEffect(() => {
      shouldSkipRef.current = true
    })
  
    return [shouldSkip, skip] as const
  }
  

const Index = () => {

    const rerender = useReducer(() => ({}), {})[1]

    const columns = useMemo<ColumnDef<User>[]>(
      () => [
        {
          header:'id',
          accessorKey:"id",
          footer: props=>props.column.id,
        },
        {
          header: 'Email',
          accessorKey:'username',
          footer: props => props.column.id,
          
        },
        {
          header: 'Number',
          accessorKey:"phoneNumber",
          footer: props => props.column.id,
        },
        {
            header: 'Points',
            accessorKey:'point',
            footer: props => props.column.id,
        },
        {
            width:300,
            header:"Ban"
        }
      ],
      []
    )

    const [data, setData] = useState<User[]>();
    
      
    const mutate = () => {
      getUserList().then(res=>{
        setData(res);
      }).catch(err=>{
        toast.error("사용자 목록을 가져오는 데 실패했습니다.")
      })
    }

    useEffect(()=>{
      mutate();
    }, [])
    const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()
    const table = useReactTable({
        data,
        columns,
        defaultColumn,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        autoResetPageIndex,
        // Provide our updateData function to our table meta
        meta: {
          updateData: (rowIndex, columnId, value) => {
            // Skip page index reset until after next rerender
            skipAutoResetPageIndex()
            // setData(old =>
            //   old.map((row, index) => {
            //     console.log(old)
            //     if (index === rowIndex) {
            //       return {
            //         ...old[rowIndex]!,
            //         [columnId]: value,
            //       }
            //     }
            //     return row
            //   })
            // )
          },
        },
        debugTable: false,
      })


      return (
        <>
            <BubbleBox>
              {data?<>
              <PrettyTable>
                
                  <thead>
                  {table?.getHeaderGroups().map(headerGroup => (
                      <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => {
                          return (
                          <th key={header.id} colSpan={header.colSpan}>
                              {header.isPlaceholder ? null : (
                              <div>
                                  {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                  )}
                                  {header.column.getCanFilter() ? (
                                  <div>
                                      <Filter column={header.column} table={table} />
                                  </div>
                                  ) : null}
                              </div>
                              )}
                          </th>
                          )
                      })}
                      </tr>
                  ))}
                  </thead>
                  <tbody>
                  {table?.getRowModel().rows.map(row => {
                      return (
                      <tr key={row.id}>
                          {row.getVisibleCells().map(cell => {
                          return (
                              <td key={cell.id}>
                              {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                              )}
                              </td>
                          )
                          })}
                      </tr>
                      )
                  })}
                  </tbody>
              </PrettyTable>
              <ButtonPlate>
                  <PrettyButton
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                  >
                  {'<<'}
                  </PrettyButton>
                  <PrettyButton
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  >
                  {'<'}
                  </PrettyButton>
                  <PrettyButton
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  >
                  {'>'}
                  </PrettyButton>
                  <PrettyButton
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                  >
                  {'>>'}
                  </PrettyButton>
                  <PrettySpan>
                  <div>Page</div>
                  <strong>
                      {table.getState().pagination.pageIndex + 1} of{' '}
                      {table.getPageCount()}
                  </strong>
                  </PrettySpan>
                  <PrettySpan>
                  | Go to page:
                  <MiniInput
                      type="number"
                      min={0}
                      defaultValue={table.getState().pagination.pageIndex + 1}
                      onChange={e => {
                      const page = e.target.value ? Number(e.target.value) - 1 : 0
                      table.setPageIndex(page)
                  
                      }}
                  />
                  </PrettySpan>
                  <PrettySelect
                  value={table.getState().pagination.pageSize}
                  onChange={e => {
                      table.setPageSize(Number(e.target.value))
                  }}
                  >
                  {[10, 20, 30].map(pageSize => (
                      <option key={pageSize} value={pageSize}>
                      Show {pageSize}
                      </option>
                  ))}
                  </PrettySelect>
              </ButtonPlate>
              <ButtonPlate>
                  <div>{table.getRowModel().rows.length} Rows</div>
                  <div>
                      <PrettyButton onClick={() => rerender()}>Force Rerender</PrettyButton>
                  </div>
                  <div>
                      <PrettyButton onClick={() => mutate()}>Refresh Data</PrettyButton>
                  </div>            
              </ButtonPlate>              
              </>:<>
                    <div style={{margin:"auto"}}>불러오는 중입니다...</div>
              </>}

            </BubbleBox>     
 
        </>

      )
}

type PayUser = {
  uuid:string;
  yagunJu:string;
  amount:number;
}
const PayUsers = () => {

  const rerender = useReducer(() => ({}), {})[1]

  const columns = useMemo<ColumnDef<PayUser>[]>(
    () => [
      {
        header:'uuid',
        accessorKey:"uuid",
        footer: props=>props.column.id,
      },
      {
        header: 'name',
        accessorKey:'yagunJu',
        footer: props => props.column.id,
        
      },
      {
        header: 'amount',
        accessorKey:"amount",
        footer: props => props.column.id,
      },
    ],
    []
  )

  const [data, setData] = useState<User[]>();
  
    
  const mutate = () => {
    getPayUsers().then(res=>{
      setData(res);
    }).catch(err=>{
      toast.error("사용자 목록을 가져오는 데 실패했습니다.")
    })
  }

  useEffect(()=>{
    mutate();
  }, [])
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()
  const table = useReactTable({
      data,
      //@ts-ignore
      columns,
      defaultColumn,
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      autoResetPageIndex,
      // Provide our updateData function to our table meta
      meta: {
        updateData: (rowIndex, columnId, value) => {
          // Skip page index reset until after next rerender
          skipAutoResetPageIndex()
          // setData(old =>
          //   old.map((row, index) => {
          //     console.log(old)
          //     if (index === rowIndex) {
          //       return {
          //         ...old[rowIndex]!,
          //         [columnId]: value,
          //       }
          //     }
          //     return row
          //   })
          // )
        },
      },
      debugTable: false,
    })


    return (
      <>
          <BubbleBox>
            {data?<>
            <PrettyTable>
              
                <thead>
                {table?.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => {
                        return (
                        <th key={header.id} colSpan={header.colSpan}>
                            {header.isPlaceholder ? null : (
                            <div>
                                {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                                )}
                                {header.column.getCanFilter() ? (
                                <div>
                                    <Filter column={header.column} table={table} />
                                </div>
                                ) : null}
                            </div>
                            )}
                        </th>
                        )
                    })}
                    </tr>
                ))}
                </thead>
                <tbody>
                {table?.getRowModel().rows.map(row => {
                    return (
                    <tr key={row.id}>
                        {row.getVisibleCells().map(cell => {
                        return (
                            <td key={cell.id}>
                            {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                            )}
                            </td>
                        )
                        })}
                    </tr>
                    )
                })}
                </tbody>
            </PrettyTable>
            <ButtonPlate>
                <PrettyButton
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                >
                {'<<'}
                </PrettyButton>
                <PrettyButton
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                >
                {'<'}
                </PrettyButton>
                <PrettyButton
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                >
                {'>'}
                </PrettyButton>
                <PrettyButton
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                >
                {'>>'}
                </PrettyButton>
                <PrettySpan>
                <div>Page</div>
                <strong>
                    {table.getState().pagination.pageIndex + 1} of{' '}
                    {table.getPageCount()}
                </strong>
                </PrettySpan>
                <PrettySpan>
                | Go to page:
                <MiniInput
                    type="number"
                    min={0}
                    defaultValue={table.getState().pagination.pageIndex + 1}
                    onChange={e => {
                    const page = e.target.value ? Number(e.target.value) - 1 : 0
                    table.setPageIndex(page)
                
                    }}
                />
                </PrettySpan>
                <PrettySelect
                value={table.getState().pagination.pageSize}
                onChange={e => {
                    table.setPageSize(Number(e.target.value))
                }}
                >
                {[10, 20, 30].map(pageSize => (
                    <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                    </option>
                ))}
                </PrettySelect>
            </ButtonPlate>
            <ButtonPlate>
                <div>{table.getRowModel().rows.length} Rows</div>
                <div>
                    <PrettyButton onClick={() => rerender()}>Force Rerender</PrettyButton>
                </div>
                <div>
                    <PrettyButton onClick={() => mutate()}>Refresh Data</PrettyButton>
                </div>            
            </ButtonPlate>              
            </>:<>
                  <div style={{margin:"auto"}}>불러오는 중입니다...</div>
            </>}

          </BubbleBox>     

      </>

    )
}
// const Options = () => {
//     const [on, setOn] = useState<boolean>(false);
//     return <>
//         options
//         <Switch state={on} setfunc={setOn}/>
//     </>
// }
function Filter({
    column,
    table,
  }: {
    column: Column<any, any>
    table: Table<any>
  }) {
    const firstValue = table
      .getPreFilteredRowModel()
      .flatRows[0]?.getValue(column.id)
  
    const columnFilterValue = column.getFilterValue()
  
    return typeof firstValue === 'number' ? (
      <div style={{display:"flex", gap:"5px"}}>
        <input
          type="number"
          value={(columnFilterValue as [number, number])?.[0] ?? ''}
          onChange={e =>
            column.setFilterValue((old: [number, number]) => [
              e.target.value,
              old?.[1],
            ])
          }
          placeholder={`Min`}
        />
        <input
          type="number"
          value={(columnFilterValue as [number, number])?.[1] ?? ''}
          onChange={e =>
            column.setFilterValue((old: [number, number]) => [
              old?.[0],
              e.target.value,
            ])
          }
          placeholder={`Max`}
        />
      </div>
    ) : (
      <input
        type="text"
        value={(columnFilterValue ?? '') as string}
        onChange={e => column.setFilterValue(e.target.value)}
        placeholder={`Search...`}
      />
    )
  }


const Block = styled.div`
  width:100%;
  height:auto;
  padding:2em;
  display:flex;
  gap:1em;
`
const PrettyInput = styled.input`
  width:10em;
  padding:0.5em;
  color:black;
  height:100%;
  border:none;
  border-radius:5px;

`
const SetAmount = () => {
  const [input, setInput] = useState('')

  return <>
    <Block>
      <PrettyInput onChange={e=>setInput(e.target.value)} value={input} placeholder="바꿀 포인트 입력"/>
      <SubmitBtn onClick={()=>setSignalCost(input).then(res=>{
        toast.success(`포인트가 ${input}으로 변경되었습니다.`)
      }).catch(err=>{
        toast.error("포인트를 변경하는 데 오류가 발생하였습니다.")
      })}>변경</SubmitBtn>
    </Block>
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
                <SidebarOption activated={mode[1]} onClick={()=>{curpage.current=<PayUsers/>;curpageName.current = "PayUsers";Select(1)}}>
                    PayUsers
                </SidebarOption>
                <SidebarOption activated={mode[2]} onClick={()=>{curpage.current=<SetAmount/>;curpageName.current = "Signal";Select(2)}}>
                    Signal
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