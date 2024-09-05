import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { server_api } from '../server_ip';

const EnrollClass = () => {
  const [classes, setClasses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, [currentPage]);

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${server_api}/user/myClass`,{ withCredentials: true });
      console.log(response)
      setClasses(response.data.classes);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching classes:', error.response?.data?.message || error.message);
    }
  };



  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Classes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <div key={classItem._id} className="bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">{classItem.name}</h3>
            <p><strong>Year:</strong> {classItem.year}</p>
            <p><strong>Number of Students:</strong> {classItem.students.length}</p>
            <p><strong>Student Limit:</strong> {classItem.studentLimit}</p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => navigate(`/class/${classItem._id}`)}
                className="bg-indigo-500 text-white py-1 px-4 rounded hover:bg-indigo-600"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnrollClass;
