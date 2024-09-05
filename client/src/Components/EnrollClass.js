import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { UserContext } from '../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import { server_api } from '../server_ip';

const EnrollClass = () => {
  const [classes, setClasses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, [currentPage]);

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${server_api}/class/allclass?page=${currentPage}&limit=9`, { withCredentials: true });
      const filteredClasses = response.data.classes.filter(
        (classItem) => !user.classes.includes(classItem._id)
      );
      setClasses(filteredClasses);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching classes:', error.response?.data?.message || error.message);
    }
  };

  const handleEnroll = async (id) => {
    try {
      const response = await axios.post(`${server_api}/class/enroll/${id}`, {}, { withCredentials: true });

      setClasses((prevClasses) => prevClasses.filter((classItem) => classItem._id !== id));
      
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message);
      console.error('Error enrolling in class:', error.response?.data?.message || error.message);
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
                onClick={() => handleEnroll(classItem._id)}
                className="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600"
              >
                Enroll
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

export default EnrollClass;
