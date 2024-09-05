import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { server_api } from '../server_ip';

const ClassesAnalytics = () => {
  const [classes, setClasses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, [currentPage]);

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${server_api}/class/allclass?page=${currentPage}&limit=9`, { withCredentials: true });
      setClasses(response.data.classes);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching classes:', error.response?.data?.message || error.message);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleClassClick = (id) => {
    navigate(`/classanalytics/${id}`);
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">All Classes</h2>
      <div className="space-y-4">
        {classes.map((classItem) => (
          <div
            key={classItem._id}
            onClick={() => handleClassClick(classItem._id)}
            className="w-full bg-gray-100 p-4 rounded-lg shadow-lg cursor-pointer hover:bg-gray-200"
          >
            <h3 className="text-lg font-semibold">{classItem.name}</h3>
            <p><strong>Teacher:</strong> {classItem.teacher?.name}</p>
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

export default ClassesAnalytics;
