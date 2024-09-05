import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { server_api } from '../server_ip';
import { UserContext } from '../Context/UserContext';

function ClassDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const response = await axios.get(`${server_api}/class/singleclass/${id}`, { withCredentials: true });
        setClassData(response.data);
      } catch (error) {
        console.error('Error fetching class data:', error);
      }
    };
    fetchClassDetails();
  }, [id]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(`${server_api}/user/getTeacher`, { withCredentials: true });
        setTeachers(response.data);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };
    if (!classData?.teacher) fetchTeachers();
  }, [classData]);

  const assignTeacher = async () => {
    try {
      await axios.post(`${server_api}/class/assignTeacher/${id}`, { teacherId: selectedTeacher }, { withCredentials: true });
      setClassData(prev => ({
        ...prev,
        teacher: teachers.find(teacher => teacher._id === selectedTeacher),
      }));
    } catch (error) {
      console.error('Error assigning teacher:', error);
    }
  };

  const removeTeacher = async () => {
    try {
      await axios.post(`${server_api}/class/removeTeacher/${id}`, { teacherId: classData.teacher._id }, { withCredentials: true });
      setClassData(prev => ({
        ...prev,
        teacher: null,
      }));
    } catch (error) {
      console.error('Error removing teacher:', error);
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = classData?.students?.slice(indexOfFirstStudent, indexOfLastStudent);

  const totalStudents = classData?.students?.length || 0;
  const totalPages = Math.ceil(totalStudents / studentsPerPage);

  if (!classData) return <div className="text-center py-4">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
    {/* Class Details on the left */}
    <div>
      <h1 className="text-2xl font-bold">Class Details: {classData.name}</h1>
      <div className="mt-2">
        <p className="text-lg font-semibold">Year: <span className="font-normal">{classData.year}</span></p>
        <p className="text-lg font-semibold">Student Limit: <span className="font-normal">{classData.studentLimit}</span></p>
        <p className="text-lg font-semibold">Student Fees: <span className="font-normal">{classData.studentFees}</span></p>
      </div>
    </div>

    {/* View Analytics button on the right */}
    <button
      onClick={() => navigate(`/classanalytics/${classData._id}`)}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
    >
      View Analytics
    </button>
  </div>

      {
          user?.userType=='admin'?
        (
          <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Teacher</h2>
          {classData.teacher  ? (
            <div className="flex items-center space-x-4">
              <div
                className="p-4 border rounded-md bg-white shadow-md cursor-pointer hover:bg-gray-100"
                onClick={() => navigate(`/teacher/${classData.teacher._id}`)}
              >
                <p className="font-bold">Name: {classData.teacher.name}</p>
                <p>Email: {classData.teacher.email}</p>
              </div>
              <button
                onClick={removeTeacher}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Remove Teacher
              </button>
            </div>
          ) : (
            <div className="p-4 border rounded-md bg-white shadow-md">
              <label className="block text-lg font-semibold mb-2">Select Teacher to Assign:</label>
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded-md mb-4"
              >
                <option value="">--Select Teacher--</option>
                {teachers.map((teacher) => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.name} ({teacher.email})
                  </option>
                ))}
              </select>
              <button
                onClick={assignTeacher}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Assign Teacher
              </button>
            </div>
          )}
          
        </div>
        ):(
          <div className="flex items-center space-x-4">
          <div
            className="p-4 border rounded-md bg-white shadow-md cursor-pointer hover:bg-gray-100"
            onClick={() => navigate(`/teacher/${classData.teacher._id}`)}
          >
            <p className="font-bold">Name: {classData.teacher.name}</p>
            <p>Email: {classData.teacher.email}</p>
          </div>
        </div>
      )}


      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Students (Page {currentPage}/{totalPages})</h2>
        {currentStudents?.map((student) => (
          <div
            key={student._id}
            className="p-4 border rounded-md bg-white shadow-md mb-2 cursor-pointer hover:bg-gray-100"
            onClick={() => navigate(`/student/${student._id}`)}
          >
            <p className="font-bold">Name: {student.name}</p>
            <p>Email: {student.email}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center space-x-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            disabled={currentPage === index + 1}
            className={`px-4 py-2 border rounded-md ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border-blue-500'} hover:bg-blue-100`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ClassDetails;
