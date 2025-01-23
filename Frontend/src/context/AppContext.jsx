import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();
export const AppContextProvider =(props)=>{
    
    const backendUrl= import.meta.env.VITE_BACKEND_URL
    console.log("Backend URL:", backendUrl);
    const [isLoggedin, setIsLoggedin]=useState(false)
    const [userData, setUserData] = useState(false);
    const getUserData = async ()=>{ 
        try{
            const {data} = await axios.get(`${backendUrl}/user/data`);
            data.success ? setUserData(data.userData):toast.error(data.message);
        }catch(error){
           toast.error('Something went wrong');
        }

    }
    const getAuthState = async ()=>{
        try{
            const {data} = await axios.get(`${backendUrl}/auth/is-auth`, {withCredentials: true});
            if (data.success) {
                setIsLoggedin(true);
                getUserData();
              } else {
                toast.error(data.message);
              }
              
        }catch(error){
           toast.error('Something went wrong');
        }
    }
    useEffect(()=>{
        getAuthState();
    },[])

    const value ={
        isLoggedin,setIsLoggedin,
        userData,setUserData,
        backendUrl,
        getUserData,
        getAuthState
      
      
        // other functions
    }
    return(
        <AppContext.Provider value={value}>
        {props.children}
        </AppContext.Provider>
    )
}