import { Route, Routes} from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import './index.css';
import AddTodo from './components/AddTodo';
import EditTodo from './components/EditTodo';
import Calendar  from './components/Calendar'
import Home from './components/Home';
import LoginForm from './components/LoginForm';
import Logout from './components/Logout';


function App() {

  return (
      <div className="App">
        <Routes>
          <Route exact path="/" element={<Home/>} /> 
          <Route exact path="/add" element={<><Navbar/><AddTodo/></>}> </Route>
          <Route exact path="/dashboard" element={<><Navbar/><Dashboard/></>}> </Route>
          <Route exact path={`/update/:id`} element={<><Navbar/><EditTodo /></>}> </Route>
          <Route exact path="/calendar" element={<><Navbar/><Calendar/></>}> </Route>
          <Route exact path="/login" element={<><LoginForm/></>}> </Route>
          <Route exact path="/logout" element={<><Logout/></>}> </Route>
        </Routes>
      </div>
  );
}

export default App;
