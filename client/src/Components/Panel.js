import React, { useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../Context/UserContext';

function Panel({ selected, setSelected }) {
  const { user } = useContext(UserContext);

  return (
    <div className="w-full  dark:bg-gray-900 text-white p-6">
      <ul className="flex flex-col space-y-2">
        <li
          className={`cursor-pointer py-2 ${
            selected === 'Profile' ? 'bg-gray-700' : ''
          }`}
          onClick={() => setSelected('Profile')}
        >
          My Profile
        </li>
        <li
          className={`cursor-pointer py-2 ${
            selected === 'Class' ? 'bg-gray-700' : ''
          }`}
          onClick={() => setSelected('Class')}
        >
          My Classes
        </li>
        {user?.userType !== 'teacher' ? (
          <li
            className={`cursor-pointer py-2 ${
              selected === 'EnrollClass' ? 'bg-gray-700' : ''
            }`}
            onClick={() => setSelected('EnrollClass')}
          >
            Enroll in a Class
          </li>
        ) : null}
      </ul>
    </div>
  );
}

export default Panel;
