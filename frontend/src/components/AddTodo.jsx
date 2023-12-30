import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddTodo = () => {

  const [todo, setTodo] = useState({
    user_id: 1,
    name: "",
    created: new Date(),
    duedate: "",
    priority: ""
  });
  const userToken = localStorage.getItem("authToken");
  const navigate = useNavigate();

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setTodo({ ...todo, [name]: value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    await fetch(`http://localhost:8080/api/todos/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userToken}`
      },
      body: JSON.stringify({ ...todo, duedate: todo.duedate })
    })
      .then(() => {
        console.log('new todo added');
        console.log(todo)
      })
      .catch((error) => {
        console.error('Error adding todo:', error);
      });
      navigate("/dashboard");
  };

  return (
    <>
      <div className="formContainer">
        <span><button className="btn btnX" onClick={()=> navigate("/dashboard")}>X</button></span>
        <form className="addForm" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={todo.name}
              onChange={handleFormChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="duedate">Due Date</label>
            <input
              type="datetime-local"
              name="duedate"
              id="duedate"
              value={todo.duedate}
              onChange={handleFormChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              name="priority"
              id="priority"
              value={todo.priority}
              onChange={handleFormChange}
              className="form-control"
            >
              <option className="options" value="">Select Priority</option>
              <option className="options" value="HIGH">High</option>
              <option className="options" value="LOW">Low</option>
            </select>
          </div>
          <button type="submit" className="btn formButton">
            Add Todo
          </button>
        </form>
      </div>
    </>
  );
};

export default AddTodo;
