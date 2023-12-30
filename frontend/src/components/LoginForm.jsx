import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import './login.css';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
} from 'mdb-react-ui-kit';
import {useNavigate } from 'react-router-dom';



function LoginForm({ showModal }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();


  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLoginSuccess = (token) => {
    console.log('Login success! Token:', token);
    localStorage.setItem('authToken', token);
    navigate('/dashboard');
  };

 const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('http://localhost:8080/api/auth/authenticate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      handleLoginSuccess(data.token);
      // navigate('/dashboard');
    
    } else {
      console.log('Authentication failed');
    }
  } catch (error) {
    console.error('Error during login:', error);
  }
};


  return (
    <Form onSubmit={handleLogin}>
      <MDBContainer fluid>
        <MDBRow className='d-flex justify-content-center align-items-center h-100'>
          <MDBCol col='12'>
            <MDBCard
              className='bg-dark text-white my-5 mx-auto'
              style={{ borderRadius: '1rem', maxWidth: '600px' }}
            >
              <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto h-100 w-100'>
                <h2 className='fw-bold mb-2 text-uppercase'>Login</h2>
                <p className='text-white-50 mb-5'>Please enter your login and password!</p>
                <Form.Control required
                  className='mb-4 mx-5 w-100'
                  placeholder='Email address'
                  id='email'
                  type='email'
                  size='lg'
                  value={email}
                  onChange={handleEmailChange}
                />
                <Form.Control required
                  className='mb-4 mx-5 w-100'
                  placeholder='Password'
                  id='pass'
                  type='password'
                  size='lg'
                  value={password}
                  onChange={handlePasswordChange}
                />
                <MDBRow className='d-flex justify-content-center align-items-center h-100'>
                  <button type='button' className='btn loginButton' onClick={showModal}>
                    Back
                  </button>
                  <button type='submit' className='btn loginButton'>
                    Login
                  </button>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </Form>
  );
}

export default LoginForm;

