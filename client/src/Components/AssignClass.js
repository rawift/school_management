import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { server_api } from '../server_ip';

const ClassesList = () => {
  const [classes, setClasses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, [currentPage]);

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${server_api}/class/allclass?page=${currentPage}&limit=9`,{ withCredentials: true });
      setClasses(response.data.classes);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching classes:', error.response?.data?.message || error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response=await axios.delete(`${server_api}/class/deleteclass/${id}`,{ withCredentials: true });
      fetchClasses();
    } catch (error) {
      console.error('Error deleting class:', error.response?.data?.message || error.message);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Classes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <div key={classItem._id} className="bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">{classItem.name}</h3>
            <p><strong>Year:</strong> {classItem.year}</p>
            <p><strong>Teacher:</strong> {classItem.teacher?.name}</p>
            <p><strong>Number of Students:</strong> {classItem.students.length}</p>
            <p><strong>Student Limit:</strong> {classItem.studentLimit}</p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => navigate(`/class/${classItem._id}`)}
                className="bg-indigo-500 text-white py-1 px-4 rounded hover:bg-indigo-600"
              >
                View Details
              </button>
              <button
                onClick={() => handleDelete(classItem._id)}
                className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="mx-1 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="mx-1 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ClassesList;
