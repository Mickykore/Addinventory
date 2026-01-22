import { MdDeleteForever, MdEditSquare } from "react-icons/md";
import { Link } from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css



export const CategoryHeaders = ({ConfirmDelete}) => [
    {
        Header: "No",
        accessor: 'rowIndex',
        Cell: ({ row }) => row.index + 1

    },
    {
        Header: "Category Name",
        accessor: "name",
    },
    {
        Header: "_id",
        accessor: "_id",
    },
    {
        Header: "Edit",
        Cell: (row) => (
            <>
                <span className="text-warning"><MdEditSquare size={24}/></span>
                <span className="text-danger" onClick={() => ConfirmDelete(row.original._id)}><MdDeleteForever size={24}/></span>
            </>
        ),
    },
]