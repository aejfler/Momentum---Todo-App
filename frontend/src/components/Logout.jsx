const Logout = () => {
    const userToken = localStorage.getItem("authToken");

    const handlelogout = async() => {
        try {
            const response = await fetch('http://localhost:8080/api/auth/authenticate', {
                method: 'POST',
                credentials: "include",
                headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${userToken}`
                },
            });
        } catch(error) { console.log(error) }
        
    handlelogout();

    return ( 
        <>
        <h2>Logout successful</h2>
        </>
     );
}
}
export default Logout;