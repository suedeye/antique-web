import React, {useState, useEffect, useMemo} from "react";
import { useHistory } from "react-router-dom";
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table'
import Button from '@material-ui/core/Button';
import { COLUMNS } from './Columns'
import { GlobalFilter } from "./GlobalFilter";
import './table.css'

export const Home = () => {
    
    useEffect(() => {
        document.title = 'Antique Boutique | Home';
    });
    
    const columns = useMemo(() => COLUMNS, []) 
    const [data, setItem] = useState([])
    
    useEffect(()=> {
        fetch('/home').then(response=> {
            if(response.ok){
                return response.json()
            }
        }).then(data => setItem(data))
    },[])

    const { 
        getTableProps, 
        getTableBodyProps, 
        headerGroups, 
        prepareRow,
        state,
        setGlobalFilter,
        page,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions
    } = useTable({
        columns: columns,
        data: data
    },    
    useGlobalFilter,
    useSortBy,
    usePagination)

    const history = useHistory();
    const handleRowClick = (row) => {
        history.push(`${row.original.id}`)
    }

    const { globalFilter } = state
    const { pageIndex } = state

    return (
    <div className="col-md-12">
        <div className="col-md-6">
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
        </div>
        <hr></hr>
        <div>          
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                    <span>
                                        {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                                    </span>
                                </th>
                            ))}                        
                        </tr>                
                    ))}                
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map(row => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps() } key={data.id} onClick={()=> handleRowClick(row)}>
                                {row.cells.map( cell => {
                                    return <td {...cell.getCellProps}>{cell.render('Cell')}</td>
                                })}                            
                            </tr>
                        )
                    })}                
                </tbody>
            </table>            
        </div>
        <hr></hr>
        <div className='offset-md-5'>                
            <Button variant="contained" onClick={() => previousPage()} disabled={!canPreviousPage}>
                Previous
            </Button>{' '}
            <span>
                Page{' '}
                <strong>
                    {pageIndex + 1} of {pageOptions.length}
                </strong>{' '}
            </span>
            <Button variant="contained" onClick={() => nextPage()} disabled={!canNextPage}>
                Next
            </Button>{' '}
        </div>
           
    </div>
    )
}