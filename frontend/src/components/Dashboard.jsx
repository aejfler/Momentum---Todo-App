import { useState, useEffect } from "react";
import TodoBar from "./TodoBar";
import TodoList from "./TodoList";



export const Dashboard = () => {
    const [todos, setTodos] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const userToken = localStorage.getItem("authToken");
        async function getTodos() {
        try{
            const response = await fetch(`http://localhost:8080/api/todos/`, {
                "method": "GET", 
                headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${userToken}`}
            })
            const data = await response.json();
    
            console.log(data);
            setTodos(data)
            setIsLoading(false);
        } catch (error) { console.error('Error during fetching the data...', error);}
    }
    getTodos()
        .catch(error =>{setError(error.message)})
    }, [])

    const handleDelete = (id) => {
        async function deleteTodos() {
            await fetch(`http://localhost:8080/api/todos/delete/${id}`, {
                method: "DELETE",
            })
            const updatedList = todos.filter(todo => todo.id !== id)
            setTodos(updatedList);
            setIsLoading(false);
            setError(null)
            }
            deleteTodos()
                .catch(error =>{setError(error.message)})
    }

    return ( 
        <>
        <div className="insideBody"> 
        { error && <div> {error} </div> }
        { isLoading && <div><h1>Loading the data ...</h1></div> }
        {todos && <>
            <TodoBar  todos={todos} setTodos={setTodos}/>
            
            <TodoList todos={todos} title="These are your todos:" handleDelete={handleDelete} setTodos={setTodos} />
            </>
        }
        </div>
        </>
     );
}
 
export default Dashboard;
