import React, { useState, useContext, useEffect } from 'react';
import Classes from '../Components/Classes';
import Panel from '../Components/Panel';
import Profile from '../Components/Profile';
import AdminPanel from '../Components/AdminPanel';
import { UserContext } from '../Context/UserContext';
import CreateClass from '../Components/CreateClass';
import AssignClass from '../Components/AssignClass';
import Analytics from '../Components/Analytics';
import EnrollClass from '../Components/EnrollClass';
import ClassesAnalytics from '../Components/ClassesAnalytics';

const Home = () => {
  const { user } = useContext(UserContext);
  const [panel, setPanel] = useState(true);
  const [selected, setSelected] = useState('Profile');

  useEffect(() => {
    if (user && user.userType === 'admin') {
      setPanel(false);
      setSelected('CreateClass');
    }
  }, [user]);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {panel ? (
        <>
          {/* Panel for normal users */}
          <div className="w-full md:w-1/4 dark:bg-gray-900 text-white p-6 transition-all duration-300">
            <Panel selected={selected} setSelected={setSelected} />
          </div>
          <div className="flex-1 w-full md:w-3/4 p-6 transition-all duration-300">
            {selected === 'Profile' && <Profile />}
            {selected === 'Class' && <Classes />}
            {selected === 'EnrollClass' && <EnrollClass />}
          </div>
        </>
      ) : (
        <>
          {/* Admin Panel */}
          <div className="w-full md:w-1/4 dark:bg-gray-900 text-white p-6 transition-all duration-300">
            <AdminPanel selected={selected} setSelected={setSelected} />
          </div>
          <div className="flex-1 w-full md:w-3/4 p-6 transition-all duration-300">
            {selected === 'CreateClass' && <CreateClass />}
            {selected === 'AssignClass' && <AssignClass />}
            {selected === 'Analytics' && <Analytics />}
            {selected === 'ClassesAnalytics' && <ClassesAnalytics />}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
