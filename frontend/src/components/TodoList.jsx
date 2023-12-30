import { FaTrashCan } from "react-icons/fa6";
import "./checkbox.css";
import { useNavigate } from "react-router-dom";
import ProgressBar from 'react-bootstrap/ProgressBar';



const TodoList = ({ todos, title, handleDelete, setTodos }) => {

  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => !todo.completed).length;
  const notCompletedTodos = totalTodos - completedTodos;
  const percentNotCompleted = `${((notCompletedTodos/totalTodos)*100).toFixed()}%`
  const todayDuedate = new Date().toISOString().slice(0,10);
  
  const dailyTodos = todos.filter((todo) => {return todo.duedate.slice(0,10) === todayDuedate})
  const dailyNotCompletedTodos = todos.filter((todo) => {return todo.duedate.slice(0,10) === todayDuedate && todo.completed;})
  const todaysProgress = `${(( dailyNotCompletedTodos.length / dailyTodos.length )*100).toFixed()}%`; 
  const userToken = localStorage.getItem("authToken");
  const navigate = useNavigate();
  
  const handleCompleted = (id, completed) => {

    fetch(`http://localhost:8080/api/todos/${id}`, {
      method:'PATCH',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${userToken}`
      },
      body: JSON.stringify({completed: !completed})
      
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to update 'completed' filed of your Todo!")
        }
      })
      .then(data => {
        const updatedTodos = todos.map(todo =>
          todo.id === id ? { ...todo, completed: !completed } : todo
      );
      setTodos(updatedTodos);
      })
      .catch(err => console.error(err))

  }

  const handleUpdate = (id) => {
      navigate(`/update/${id}`);
      console.log(percentNotCompleted)
  } 

  return (
    <>
    <div className='parent'>
    <label className="progressLabel">TOTAL</label>
        <div className="mainDiv">
        {/* <ProgressBar className='childDiv total' now={percentNotCompleted} style={  {"width":`${percentNotCompleted}.toString().includes("0") ? ${percentNotCompleted} : "" `}} ><div className="percentage">{percentNotCompleted.toString().includes("0") ? "you have no todos done in total" : percentNotCompleted}</div></ProgressBar> */}
        <ProgressBar className='childDiv total' now={percentNotCompleted} style={{"width" : `${percentNotCompleted}`}} ><div className="percentage">{percentNotCompleted.toString().includes("NaN" || "0%") ? "you have no todos done in total" : percentNotCompleted}</div></ProgressBar>
        </div>
    </div>

    <div className='parent'>
    <label className="progressLabel">TODAY</label>
        <div className="mainDiv">
        <ProgressBar className='childDiv today' now={todaysProgress} style={{"width" : `${todaysProgress}`}}><div className="percentage">{todaysProgress.toString().includes("NaN" || "0") ? "you have no todos for today" : todaysProgress}</div></ProgressBar>
        </div>
    </div>


      <div className="todoList">
        <div><h2>{todos.length>0 ? title : "You have no TODOS to display... "} </h2></div>
        <div className="todoItems">
          {todos.map((todo) => (
            <div className="singularTodoBar" key={todo.id}>
              <span className="checkbox checkbox-wrapper-39 ">
                <label>
                  <input type="checkbox disabled"/>
                  <span className="checkbox"></span>
                </label>
              </span>

              <div className="todoText">
                <div className="dateTimeContainer">
                  <span className="dateSpan">{`${(todo.duedate).slice(0,10)}`} </span>
                  <span className="timeSpan">{`${(todo.duedate).slice(11,16)}`} </span> 
                </div>
              <span className="listRowSpan">{`${(todo.name)}`} </span>
              </div>

              <div className="todoActions">
                <div className="isCompleted"><button className={`btn isCompletedBtn ${todo.completed ? 'btnClicked' : ""}`} onClick={() => handleCompleted(todo.id, todo.completed, setTodos)}>{todo.completed ? 'COMPLETED' : "TODO"}</button></div>
                <div><button className={`btn btnPriority ${todo.priority === "HIGH" ? 'high' : (todo.priority === 'LOW' ? 'low' : 'medium')}`}>{todo.priority}</button></div>
                <div className="trash">
                  <FaTrashCan onClick={() => handleDelete(todo.id)} />
                </div>
                <div className="todoEdit">
                  <button onClick={() => handleUpdate(todo.id)} className="btn">EDIT</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TodoList;
