import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { createBulkProduct, updateBulkProducts } from '../../redux/features/product/bulkProductSlice';
import { getallCategories } from '../../redux/features/product/categorySlice';
import { getProducts } from '../../redux/features/product/productSlice';
import ButtonLoading from '../../loader/ButtonLoader';

const BulkProductForm = () => {
    const [file, setFile] = useState();
    const [operation, setOperation] = useState('create');
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getallCategories());
        dispatch(getProducts());
      }, [dispatch]);
    
    

    const handleSubmit = async (event) => {
        event.preventDefault();

        setIsLoading(true);
        const reader = new FileReader();
        reader.onload = async (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws);

            // Define the necessary fields
            const necessaryFields = ['name', 'category', 'purchasedPrice', 'minSellingPrice', 'maxSellingPrice', 'quantity'];

            // Check if all necessary fields are included in the first row of the data
            const dataFields = Object.keys(data[0]);
            const allFieldsIncluded = necessaryFields.every(field => dataFields.includes(field));

            if (!allFieldsIncluded) {
                alert('The Excel file does not include all necessary fields.dd');
                setIsLoading(false);
                return;
            }

            // Dispatch the appropriate action based on the selected operation
            if (operation === 'create') {
                await dispatch(createBulkProduct(data));
                setIsLoading(false);
                // navigate("/products")
            } else if (operation === 'update') {
                dispatch(updateBulkProducts(data));
            }
        };
        reader.readAsBinaryString(file);
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleOperationChange = (event) => {
        setOperation(event.target.value);
    };

    return (
        <Form onSubmit={handleSubmit} className='g-3 col-md-5' style={{fontSize: "1.5rem", padding: "1.5rem"}}>
            <FormGroup>
                <Label for="operation">Operation</Label>
                <Input type="select" name="operation" id="operation" className="form-control form-select form-select-lg" value={operation} onChange={handleOperationChange}>
                    <option value="create">Add Bulk</option>
                    <option value="update">Update Bulk</option>
                </Input>
            </FormGroup>
            <FormGroup>
                <Label for="file">Excel File</Label>
                <Input type="file" name="file" id="file" accept=".xls, .xlsx" onChange={handleFileChange} />
            </FormGroup>
            {/* <Button type="submit" className='btn btn-info' style={{}}>Submit</Button> */}
            {isLoading ? (
          <ButtonLoading className="btn btn-lg btn-primary " type="submit" disabled>Loading...</ButtonLoading>
            ) : (
              <Button className="btn btn-lg btn-primary" type="submit">Add Bulk Products</Button>
          )}
        </Form>
    );
};

export default BulkProductForm;
