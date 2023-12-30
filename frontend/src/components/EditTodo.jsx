import { useState, useEffect } from "react";
import { useParams,useNavigate } from "react-router-dom";


const EditTodo = () => {
    const [id, setId] = useState(""); 
    const [todo, setTodo] = useState({
        user_id: 1,
        name: "",
        duedate: "",
        priority: ""
    });

    const { id: urlId } = useParams(); //getting id from url path
    const navigate = useNavigate();
    useEffect(() => {
        setId(urlId); //setting id from url

        if (urlId) {
            fetch(`http://localhost:8080/api/todos/${urlId}`)
                .then(response => {
                    if (!response.ok) {
                        throw Error("Could not fetch the data ...")
                    }
                    return response.json();
                })
                .then(data => {
                    setTodo(data);
                })
                .catch(rejected => rejected.message);
        }
    }, [urlId]);

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setTodo({ ...todo, [name]: value });
    }
    const userToken = localStorage.getItem("authToken");
    const handleUpdate = () => {
        if (id) {
            fetch(`http://localhost:8080/api/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${userToken}`
                },
                body: JSON.stringify({...todo, duedate:todo.duedate})
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Could not update your todo!")
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("Updated successfully \n", data);
                    navigate('/dashboard');
                })
                
                .catch(err => err.message);
        }
        navigate('/');
    }

    return (
        <>
        <span><button className="btn btnX" onClick={()=> navigate("/dashboard")} >X</button></span>
            <form className="addForm" onSubmit={handleUpdate}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={todo.name}
                        onChange={handleUpdateChange}
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
                        onChange={handleUpdateChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="priority">Priority</label>
                    <select
                        name="priority"
                        id="priority"
                        value={todo.priority}
                        onChange={handleUpdateChange}
                        className="form-control"
                    >
                        <option className="options" value="">Select Priority</option>
                        <option className="options" value="HIGH">High</option>
                        <option className="options" value="LOW">Low</option>
                    </select>
                </div>
                <button type="submit" className="btn formButton">
                    Update
                </button>
            </form>
        </>
    );
}

export default EditTodo;
