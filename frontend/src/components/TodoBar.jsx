import { Link } from "react-router-dom";



const TodoBar = ({todos, setTodos}) => {
    const userToken = localStorage.getItem("authToken");

    const handleSorted = (order) => {
        console.log(order)
        async function getSorted() {
            const response = await fetch(`http://localhost:8080/api/todos/sorted/${order}`, {
                method:"GET",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${userToken}`
                    },
            })
            const data = await response.json();
            setTodos(data)   
        }
        getSorted()
            .catch(error => console.log(error.message))
    }
    
    return ( 
        <>
        <div className="todoBar">
            <div className="filter">
                <label className="filterLabel">Sort by priority: </label>
                <button onClick={(e)=> handleSorted(e.target.value)}  value='HIGH' className="btnBar btn high">HIGH</button>
                <button onClick={(e)=> handleSorted(e.target.value)} value='LOW' className="btnBar btn low">LOW</button>
            </div>
            <div><Link to="/add"><button className="btn addBtn">ADD TODO</button></Link></div>
        </div>
        </>
        
     );
}
 
export default TodoBar
