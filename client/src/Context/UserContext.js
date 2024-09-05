import React, { useEffect, useState} from "react";
import axios from 'axios';
import { server_api } from "../server_ip";

export const UserContext = React.createContext();



export const UserProvider = ({children}) => {
    const [user, setUser]=useState({})
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${server_api}/user/me`, { withCredentials: true });
          setUser(response.data.user)
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData()
    },[])
  return (
    <UserContext.Provider value={{user, setUser}}>
        {children}
    </UserContext.Provider>
  )
}