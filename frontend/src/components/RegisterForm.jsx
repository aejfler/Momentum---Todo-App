import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import './login.css';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
} from 'mdb-react-ui-kit';

function RegisterForm({ showModal }) {
  const [formData, setFormData] = useState({
    firstname: '',
    username: '',
    email: '',
    password: '',
    role: 'USER',
  });

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegistrationSuccess = (token) => {
    console.log('Registration success! Token:', token);
    localStorage.setItem('authToken', token);
  };

  const handleRegistration = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        handleRegistrationSuccess(data.token);
        console.log('register completed ', data.token);
      } else {
        console.log('Registration failed');
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
    navigate("/login");
  };

  return (
    <Form onSubmit={handleRegistration}>
      <MDBContainer fluid>
        <MDBRow className='d-flex justify-content-center align-items-center h-100'>
          <MDBCol col='12'>
            <MDBCard
              className='bg-dark text-white my-5 mx-auto'
              style={{ borderRadius: '1rem', maxWidth: '600px' }}
            >
              <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto h-100 w-100'>
                <h2 className='fw-bold mb-2 text-uppercase'>Register</h2>
                <p className='text-white-50 mb-5'>
                  Please enter your information to register!
                </p>
                <Form.Control required
                  className='mb-4 mx-5 w-100'
                  placeholder='First Name'
                  type='text'
                  size='lg'
                  name='firstname'
                  value={formData.firstname}
                  onChange={handleInputChange}
                />
                <Form.Control required
                  className='mb-4 mx-5 w-100'
                  placeholder='Username'
                  type='text'
                  size='lg'
                  name='username'
                  value={formData.username}
                  onChange={handleInputChange}
                />
                <Form.Control required
                  className='mb-4 mx-5 w-100'
                  placeholder='Email address'
                  type='email'
                  size='lg'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <Form.Control required
                  className='mb-4 mx-5 w-100'
                  placeholder='Password'
                  type='password'
                  size='lg'
                  name='password'
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <MDBRow className='d-flex justify-content-center align-items-center h-100'>
                  <button
                    className='btn loginButton'
                    onClick={showModal}
                  >
                    Back
                  </button>
                  <button type='submit' className='btn loginButton'>
                    Register
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

export default RegisterForm;
