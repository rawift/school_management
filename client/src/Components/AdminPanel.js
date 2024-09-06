import React from 'react';

function AdminPanel({ selected, setSelected }) {
  return (
    <div className="w-full  dark:bg-gray-900 text-white p-2 sm:p-6">
      <ul className="flex flex-col">
        <li
          className={`cursor-pointer py-2 ${
            selected === 'CreateClass' ? 'bg-gray-700' : ''
          }`}
          onClick={() => setSelected('CreateClass')}
        >
          Create a Class
        </li>
        <li
          className={`cursor-pointer py-2 ${
            selected === 'AssignClass' ? 'bg-gray-700' : ''
          }`}
          onClick={() => setSelected('AssignClass')}
        >
          Assign a Class
        </li>
        <li
          className={`cursor-pointer py-2 ${
            selected === 'Analytics' ? 'bg-gray-700' : ''
          }`}
          onClick={() => setSelected('Analytics')}
        >
          Overall Analytics
        </li>

        <li
          className={`cursor-pointer py-2 ${
            selected === 'ClassesAnalytics' ? 'bg-gray-700' : ''
          }`}
          onClick={() => setSelected('ClassesAnalytics')}
        >
          Classes Analytics
        </li>
      </ul>
    </div>
  );
}

export default AdminPanel;
