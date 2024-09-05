import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { server_api } from '../server_ip';
import { UserContext } from '../Context/UserContext';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

function ClassAnalytics() {
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
        console.log('Class Data:', response.data); 
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
        console.log('Teachers Data:', response.data);
        setTeachers(response.data);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };
    if (classData && !classData.teacher) fetchTeachers();
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

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = classData?.students?.slice(indexOfFirstStudent, indexOfLastStudent);

  const totalStudents = classData?.students?.length || 0;
  const totalPages = Math.ceil(totalStudents / studentsPerPage);

  if (!classData) return <div className="text-center py-4">Loading...</div>;

  const maleStudents = classData.students?.filter(student => student.gender === 'Male').length || 0;
  const femaleStudents = classData.students?.filter(student => student.gender === 'Female').length || 0;

  const data = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        label: 'Number of Students',
        data: [maleStudents, femaleStudents],
        backgroundColor: ['#4A90E2', '#FF6F61'],
      },
    ],
  };

  const handleStudentClick = (studentId) => {
    navigate(`/student/${studentId}`);
  };

  return (
    <div className="container mx-auto p-6">
      {/* Class details */}
      <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-bold mb-4">{classData.name}</h2>
        <p><strong>Year:</strong> {classData.year}</p>
        <p><strong>Teacher:</strong> {classData.teacher?.name || 'Not assigned'}</p>

        {/* Assign teacher if not assigned */}
        {!classData.teacher && (
          <div className="mt-4">
            <label className="mr-2">Assign Teacher:</label>
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
            >
              <option value="">Select Teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.name}
                </option>
              ))}
            </select>
            <button
              onClick={assignTeacher}
              className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Assign
            </button>
          </div>
        )}
      </div>

      {/* Graph showing male/female students */}
      <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
        <h3 className="text-xl font-semibold mb-4">Gender Distribution</h3>
        <Bar data={data} />
      </div>

      {/* Student List */}
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Students</h3>
        {currentStudents?.length ? (
          currentStudents.map((student) => (
            <div
              key={student._id}
              className="p-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
              onClick={() => handleStudentClick(student._id)}
            >
              {student.name} ({student.gender})
            </div>
          ))
        ) : (
          <p className="text-center">No students found.</p>
        )}

        {/* Pagination */}
        <div className="mt-4 flex justify-center">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 hover:bg-gray-400'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ClassAnalytics;
