import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './AddUser.css';

const AddUser = () => {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('staff');
  const [emailPrefix, setEmailPrefix] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!firstName || !lastName) {
      setError("First and last name are required.");
      return;
    }

    let fullName = `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`.trim();

    let fullEmail = emailPrefix;
    if (role === 'staff') {
      fullEmail = `${emailPrefix}@clinicqueue.com`;
    } else if (role === 'admin') {
      if (!emailPrefix.toLowerCase().includes('admin')) {
        setError("Admin email must include the word 'admin'");
        return;
      }
    }

    if ((role === 'staff' || role === 'admin') && !phone) {
      setError('Phone number is required for staff/admin');
      return;
    }

    const newUser = {
      name: fullName,
      role,
      email: fullEmail,
      phone: role === 'patient' ? null : phone
    };
    
    const token = sessionStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:5000/api/admin/add-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
                    'Authorization': `bearer ${token}`
         },
        body: JSON.stringify(newUser)
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(`User added successfully! Temporary password: ${data.password}`);
        setFirstName('');
        setMiddleName('');
        setLastName('');
        setEmailPrefix('');
        setPhone('');
        } else {
          setError(data.message || 'Something went wrong');
        }
    } catch (err) {
      setError('Failed to create user');
    }
  };

  return (
    <div className="manage-body">
      <div className="manage-wrapper">
        <h1>Add User</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First Name *</label>
            <input
              type="text"
              value={firstName}
              required
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Middle Name (Optional)</label>
            <input
              type="text"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Last Name *</label>
            <input
              type="text"
              value={lastName}
              required
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label>Email {role === 'staff' ? 'Prefix' : '(must include "admin")'}</label>
            <input
              type="text"
              placeholder={role === 'staff' ? 'e.g. jdoe' : 'e.g. admin.jane@clinicqueue.com'}
              value={emailPrefix}
              required
              onChange={(e) => setEmailPrefix(e.target.value)}
            />
          </div>

          {(role === 'staff' || role === 'admin') && (
            <div className="form-group">
              <label>Phone Number *</label>
              <PhoneInput
                country={'ke'}
                value={phone}
                onChange={setPhone}
                inputProps={{
                  name: 'phone',
                  required: true
                }}
              />
            </div>
          )}

          {error && <p className="error-msg">{error}</p>}
          {success && <p className="success-msg">{success}</p>}

          <button type="submit" className="submit-btn">Add User</button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
