import React, { useState, useEffect, useContext } from 'react';
import './CreatePassword.css'
import axios from 'axios';
import getApiUri from '../../../utils/api.util';
import './CreatePassword.css'
import logo from '../../../assets/logo.png'

const CreatePassword = ({email,setEmail, setVisible}) => {

  const [password, setPassword] = useState('');
  const [retypepassword, setRetypePassword] = useState('');
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState([]);
  console.log({email})
  const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  // Validation function
  const validate = () => {
    const err = {};
    let invalid = false;

    if (!isValidEmail(email)) {
      invalid = false;
      err.email = 'Please enter a valid email address...';
    }
    if (!password) {
      err.password = 'Password is required.';
      invalid = true;
    }
    if (!retypepassword) {
      err.retypepassword = 'Re-type password is required.';
      invalid = true;
    }
    if (password !== retypepassword) {
      err.password = 'Password mismatch';
      err.retypepassword = 'Password mismatch';
      invalid = true;
    }
    setError(err);
    return invalid;
  };

  // useEffect(() => {
  //   if (Array.isArray(companyDetails) && companyDetails.length > 0) {
  //     setData(companyDetails[0]);
  //   }
  // }, [companyDetails]);

  // Handle submit button
  const handleOnSubmit = async () => {
    setLoading(true);
    const valid = validate();
    try {
      if (!valid) {
        const res = await axios.post(
          getApiUri(`GeneratePassword?Phoneno=${email}&Password=${password}`)
        );

        if (res && res.data?.statuscode === 200 && res.data?.msgcode === '3') {
          setVisible('REGISTRATION')
          // showMessage({
          //   message: 'Password created successfully',
          //   type: 'success',
          // });
          // localStorage.clear();
          // localStorage.setItem(
          //   'USER_CONTEXT',
          //   JSON.stringify({ ...user, msgcode: res?.data?.msgcode })
          // );
          // authContext.Password();
          // history.push('/success'); // Redirect after successful password creation
        }
      }
    } catch (error) {
      console.log(error);
      alert('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="passwordContainer">
      <div className='passwordCard'>
      <div className="header">
        {/* Replace with your logo or image */}
        {data?.mst_company_logo ? (
          <img src={data.mst_company_logo} alt="Company Logo" className="company-logo" />
        ) : (
          <img src={logo} alt="Default Logo" className="company-logo" />
        )}
      </div>

      <div className="password-form">
        <div className="password-form-group" style={{marginBottom: "15px"}}>
          <label className='password-label'>Email*</label>
          <input
            type="email"
            placeholder="Enter your Email..."
            value={email}
            disabled
            className="input-field"
          />
          {/* {error.email && <span className="error">{error.email}</span>} */}
        </div>

        <div className="password-form-group">
          <label className='password-label'>Password</label>
          <input
            type="password"
            placeholder="Enter Your Password..."
            value={password}
            onChange={(e) => {
              if (error.password) {
                setError({ ...error, password: '' });
              }
              setPassword(e.target.value);
            }}
            className="input-field"
          />
          {error.password ? <span className="error">{error.password}</span> : <></>}
        </div>

        <div className="password-form-group">
          <label className='password-label'>Re-Type Password</label>
          <input
            type="password"
            placeholder="Re-Enter Your Password..."
            value={retypepassword}
            onChange={(e) => {
              if (error.retypepassword) {
                setError({ ...error, retypepassword: '' });
              }
              setRetypePassword(e.target.value);
            }}
            className="input-field"
          />
          {error.retypepassword ? <span className="error">{error.retypepassword}</span> :<></>}
        </div>

        <div className="password-form-group">
          <div onClick={handleOnSubmit} className="button">{loading?'loading...' :'Save'}</div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default CreatePassword;
