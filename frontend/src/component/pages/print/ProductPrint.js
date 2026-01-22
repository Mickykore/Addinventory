import { useTable } from 'react-table';
import { useMemo } from 'react';


export const ProductPrint = ({Products}) => {

    const columns = useMemo(() => [
        {
          Header: 'No',
          accessor: 'no', // Use the 'id' accessor for the ID column
          Cell: ({ row }) => row.index + 1
        },
        {
          Header: 'Name Of Product',
          accessor: 'name'
        },
        {
          Header: 'Category',
          accessor: 'category.name',
        },
        {
          Header: 'Minimum Selling Price',
          accessor: 'sellingPriceRange.minSellingPrice'
        },
        {
          Header: 'Minimum Selling Price',
          accessor: 'sellingPriceRange.maxSellingPrice'
        },
        {
          Header: 'Quantity',
          accessor: 'quantity'
        },
        {
          Header: 'Seller',
          accessor: 'addedBy.firstname'
        },
        {
          Header: 'Date',
          accessor: 'createdAt'
        },
      ], []);

        const data = useMemo(() => Products, [Products]);

        const tableInstance = useTable({
            columns,
            data
        });

       const {
              getTableProps,
              getTableBodyProps,
              headerGroups,
              rows,
              prepareRow
         } = tableInstance;

    return (
        <div style={{margin: "20px"}}>
        <div style={{padding: "1.5rem"}}><h2>Products</h2></div>
        <div style={{marginBottom: '1rem', textAlign: "right", fontSize: "1.5rem"}}>Date: {new Date().toLocaleDateString()}</div>
            <table {...getTableProps()} className="table table-bordered table-striped table-hover">
                <thead>
                    {
                        headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {
                                    headerGroup.headers.map(column => (
                                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </thead>
                <tbody {...getTableBodyProps()}>
                    {
                        rows.map(row => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {
                                        row.cells.map(cell => {
                                            return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                        })
                                    }
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
};