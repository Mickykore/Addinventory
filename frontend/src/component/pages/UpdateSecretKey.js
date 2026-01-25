import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { updateSecretKey } from '../../services/authService';
import ButtonLoading from '../../loader/ButtonLoader';

const initialState = {
  adminPassword: '',
  adminSecretKey: '',
  adminConfirmSecretKey: '',
  employeePassword: '',
  employeeSecretKey: '',
  employeeConfirmSecretKey: '',
};

export const UpdatedSecretKey = () => {
  const [adminForm, setAdminForm] = useState(initialState);
  const [employeeForm, setEmployeeForm] = useState(initialState);
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false); // Separate loading state for admin form
  const [isLoadingEmployee, setIsLoadingEmployee] = useState(false); // Separate loading state for employee form

  const handleAdminInputChange = (e) => {
    setAdminForm({ ...adminForm, [e.target.name]: e.target.value });
  };

  const handleEmployeeInputChange = (e) => {
    setEmployeeForm({ ...employeeForm, [e.target.name]: e.target.value });
  };

  const update = async (e, type) => {
    e.preventDefault();

    const { adminSecretKey, adminConfirmSecretKey, adminPassword, employeeSecretKey, employeeConfirmSecretKey, employeePassword } = type === 'admin' ? adminForm : employeeForm;

    if (adminSecretKey !== adminConfirmSecretKey || employeeSecretKey !== employeeConfirmSecretKey) {
      return toast.error('Secret key and confirmation must match');
    }

    if ((type === 'admin' && adminSecretKey.length < 6) || (type === 'employee' && employeeSecretKey.length < 6)) {
      return toast.error(`${type.charAt(0).toUpperCase() + type.slice(1)} secret key must be at least 6 characters`);
    }
    if ((!adminPassword  && !employeePassword) || (!employeeSecretKey && !adminSecretKey)) {
      return toast.error('Please fill all required fieldsdd');
    }

    if (type === 'admin') {
      setIsLoadingAdmin(true); // Set loading state for admin form
    } else {
      setIsLoadingEmployee(true); // Set loading state for employee form
    }

    try {
      const data = await updateSecretKey({ [`${type}SecretKey`]: type === 'admin' ? adminSecretKey : employeeSecretKey, password: type === 'admin' ? adminPassword : employeePassword });
      toast.success(data);
      setAdminForm(initialState);
      setEmployeeForm(initialState);
    } catch (error) {
      toast.error('Failed to update secret key');
    } finally {
      if (type === 'admin') {
        setIsLoadingAdmin(false); // Reset loading state for admin form
      } else {
        setIsLoadingEmployee(false); // Reset loading state for employee form
      }
    }
  };

  return (
    <div className="container-fluid profile" style={{ fontSize: "1.5rem" }}>
      <div className="col-md-4 d-flex justify-content-center align-items-center mb-5">
        <form onSubmit={(e) => update(e, 'admin')} >
          <h1 className="h3 mb-3 fw-normal">Update Admin Secret Key</h1>
          {/* Admin form inputs */}
          <div style={{margin: "5px"}}>
                  <label htmlFor="minSellingPrice" className="form-label">Admin Secret Key</label>
            <input type="password" className="form-control" id="adminSecretKey" placeholder="Add NewAdmin Secret Key" name="adminSecretKey" value={adminForm.adminSecretKey} onChange={handleAdminInputChange} />
          </div>
          <div style={{margin: "5px"}}>
            <input type="password" className="form-control" id="adminConfirmSecretKey" placeholder="Confirm Admin Secret Key" name="adminConfirmSecretKey" value={adminForm.adminConfirmSecretKey} onChange={handleAdminInputChange} />
          </div>
          <div style={{margin: "5px"}}>
            <input type="password" className="form-control" id="adminPassword" placeholder="Password" name="adminPassword" value={adminForm.adminPassword} onChange={handleAdminInputChange} />
          </div>
          {/* Admin form button with loading state */}
          {isLoadingAdmin ? (
            <ButtonLoading className="btn btn-lg btn-primary" type="submit" disabled>Loading...</ButtonLoading>
          ) : (
            <button className="btn btn-lg btn-primary" type="submit">Update Admin Secret Key</button>
          )}
        </form>
      </div>
      <div className="col-md-4 d-flex justify-content-center align-items-center">
        <form onSubmit={(e) => update(e, 'employee')}>
          <h1 className="h3 mb-3 fw-normal">Update Employee Secret Key</h1>
          {/* Employee form inputs */}
          <div style={{margin: "5px"}}>
            <input type="password" className="form-control" id="employeeSecretKey" placeholder="Employee Secret Key" name="employeeSecretKey" value={employeeForm.employeeSecretKey} onChange={handleEmployeeInputChange} />
          </div>
          <div style={{margin: "5px"}}>
            <input type="password" className="form-control" id="employeeConfirmSecretKey" placeholder="Confirm Employee Secret Key" name="employeeConfirmSecretKey" value={employeeForm.employeeConfirmSecretKey} onChange={handleEmployeeInputChange} />
          </div>
          <div style={{margin: "5px"}}>
            <input type="password" className="form-control" id="employeePassword" placeholder="Password" name="employeePassword" value={employeeForm.employeePassword} onChange={handleEmployeeInputChange} />
          </div>
          {/* Employee form button with loading state */}
          {isLoadingEmployee ? (
            <ButtonLoading className="btn btn-lg btn-primary" type="submit" disabled>Loading...</ButtonLoading>
          ) : (
            <button className="btn btn-lg btn-primary" type="submit">Update Employee Secret Key</button>
          )}
        </form>
      </div>
    </div>
  );
};
