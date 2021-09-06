import React, {useState, useEffect, useMemo} from "react";
import { useTable } from 'react-table'
import { COLUMNS } from './columns'
import './table.css'

export const BasicTable = () => {
    
    const columns = useMemo(() => COLUMNS, []) 
    const [data, setItem] = useState([])
    
    useEffect(()=> {
        fetch('/home').then(response=> {
            if(response.ok){
                return response.json()
            }
        }).then(data => setItem(data))
    },[])

    const tableInstance = useTable({
        columns: columns,
        data: data
    })

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance

    return (
        <table {...getTableProps()}>
            <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                        ))}                        
                    </tr>                
                ))}                
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map( cell => {
                                return <td {...cell.getCellProps}>{cell.render('Cell')}</td>
                            })}                            
                        </tr>
                    )
                })}                
            </tbody>
        </table>
    )
}