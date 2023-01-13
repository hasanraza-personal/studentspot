import { Navigate, Outlet } from "react-router-dom"; 

const ProtectedRoutes = () => {
    // const userAuth = localStorage.getItem('token')
    if (localStorage.getItem('token')){
        return <Outlet /> 
    }else{
        return <Navigate to='/login' />
    }
    
}

export default ProtectedRoutes