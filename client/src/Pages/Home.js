import React, {useState, useContext, useEffect} from 'react'
import Classes from '../Components/Classes';
import Panel from '../Components/Panel';
import Profile from '../Components/Profile';
import AdminPanel from '../Components/AdminPanel';
import { UserContext } from '../Context/UserContext';
import CreateClass from '../Components/CreateClass';
import AssignClass from '../Components/AssignClass';
import Analytics from '../Components/Analytics';
import EnrollClass from '../Components/EnrollClass';
import  ClassesAnalytics from '../Components/ClassesAnalytics';

const Home = () => {
   const { user, setUser } = useContext(UserContext);
   const [panel,setpanel] =useState(true)
   const [selected, setSelected] = useState('Profile');
   useEffect(()=>{
    if(user){
      if(user.userType=='admin'){
        setpanel(false)
        setSelected('CreateClass')
      }
    }
   },[user])

   return (
     <div className="flex h-screen">
      {
        panel?(
          <>
        <Panel selected={selected} setSelected={setSelected} />
       <div className="flex-1 p-6 transition-all duration-300">
         {selected === 'Profile' && <Profile />}
         {selected === 'Class' && <Classes />}
         {selected === 'EnrollClass' && <EnrollClass />}
       </div>
          </>
        ):(
          <>
          <AdminPanel selected={selected} setSelected={setSelected} />
       <div className="flex-1 p-6 transition-all duration-300">
         {selected === 'CreateClass' && <CreateClass />}
         {selected === 'AssignClass' && <AssignClass />}
         {selected === 'Analytics' && <Analytics />}
         {selected === 'ClassesAnalytics' && <ClassesAnalytics />}

       </div>
          </>
        )
      }
     </div>
   );
}

export default Home