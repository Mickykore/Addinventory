import React, { useState } from 'react';
import Chapa from './Chapa';

const Pay = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        amount: ''
    });

    const { firstName, lastName, phone, amount, email } = formData;

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <h2>Pay</h2>
            <form id="hide-onprint" style={{ fontSize: "1.3rem", padding: "1.5rem", width: "350px"}}>
                <div className="form-group mb-2">
                    <label>First Name:</label>
                    <input
                        type="text"
                        name="firstName"
                        value={firstName}
                        placeholder="Mikiyas"
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group mb-2">
                    <label>Last Name:</label>
                    <input
                        type="text"
                        name="lastName"
                        value={lastName}
                        placeholder="Ayele"
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group mb-2">
                    <label>Phone:</label>
                    <input
                        type="text"
                        name="phone"
                        value={phone}
                        placeholder="+251911111111"
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group mb-2">
                    <label>email:</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        placeholder="email@email.com"
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group mb-2">
                    <label>Amount:</label>
                    <input
                        type="text"
                        name="amount"
                        value={amount}
                        placeholder="100"
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <button style={{all: "initial"}}><Chapa firstName={firstName} lastName={lastName} phone={phone} amount={amount} email={email}/></button>
                </form>
                
        </div>
    );
};

export default Pay;