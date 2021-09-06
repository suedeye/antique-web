export const COLUMNS = [
    {
        Header: 'Name',
        accessor: 'name',      
        disableSortBy: true 
    },
    {
        Header: 'Description',
        accessor: 'description',
        disableSortBy: true
    },
    {
        Header: 'Price ($)',
        accessor: 'last_bid',
        disableGlobalFilter: true
    }
]