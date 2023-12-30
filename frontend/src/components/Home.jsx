import React, { useState } from 'react';
import { Row, Container } from 'react-bootstrap';
import './home.css'
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showRegistrationForm, setshowRegistrationForm] = useState(false);
  const handleCloseModal = () => setShowModal(false);

  const handleToggleForm = () => {
    setShowModal(!showModal)
    setShowForm(!showForm)
};
const handleToggleRegistrationForm = () => {
  setShowModal(!showModal)
  setshowRegistrationForm(!showRegistrationForm)
};
  return (
    <div className="text-center">
      <Container className='w-100' show={showModal} onHide={handleCloseModal} centered>
        <Row className={`${showModal ? 'hidden' : ''} w-25 h-50 logo`}>
          <img className='logo' src="./octa(1).png" alt="logo" />
        </Row>
        <div className='titleLogo'>Momentum</div>
      </Container>


      {showForm && (
         <LoginForm showModal={handleToggleForm} />
      )}
      {showRegistrationForm && (
         <RegisterForm showModal={handleToggleRegistrationForm}/>
      )}

      <div className="mt-3 buttons">
        <button type="submit" className={`${showModal ? 'hidden' : ''} btn loginButton`} onClick={handleToggleForm}>Login</button>
        <button type="submit" className={`${showModal ? 'hidden' : ''} btn loginButton`} onClick={handleToggleRegistrationForm}>Sign up</button>
      </div>
    </div>
  );
};

export default Home;
