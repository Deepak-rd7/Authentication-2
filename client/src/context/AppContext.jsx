import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export  const Appcontent=createContext();

export const AppContextProvider = (props)=>{

    const backendUrl=import.meta.env.VITE_BACKEND_URL;

    const [isLoggedIn,setIsLoggedIn]=useState(false);

    const [userData,setUserData]=useState(false);

    const getAuthState=async()=>{

        axios.defaults.withCredentials=true;
        
        try {
            const {data}=await axios.get(backendUrl+"/auth/is-auth");
            if(data.success){
                setIsLoggedIn(true);

                getUserData();
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    const getUserData= async()=>{
        try {
            const {data}=await axios.get(backendUrl+'/user/user-data')

            data.success ? setUserData(data.userData) : toast.error(data.message);
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(()=>{
        getAuthState();
    },[])

    const value={
        backendUrl,
        isLoggedIn,setIsLoggedIn,
        userData,setUserData,
        getUserData
    }
    return (
        <Appcontent.Provider value={value}>
            {props.children}
        </Appcontent.Provider>
    )
}