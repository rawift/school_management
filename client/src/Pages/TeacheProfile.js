import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { server_api } from '../server_ip'; // Adjust the import based on your setup

function TeacherProfile() {
  const { id } = useParams(); // Get teacher ID from URL
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeacherProfile = async () => {
      try {

        const response = await axios.post(
          `${server_api}/user/teacherProfile`,
          { userId: id }, 
          { withCredentials: true }
        );
        setTeacherData(response.data);
      } catch (error) {
        setError('Error fetching teacher profile');
        console.error('Error fetching teacher profile:', error);
      } finally {
        setLoading(false); 
      }
    };

    fetchTeacherProfile();
  }, [id]);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  if (!teacherData) {
    return <div className="text-center py-4">No teacher data found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Teacher Profile</h1>
      <div className="p-4 border rounded-md bg-white shadow-md">
        <p className="text-lg font-semibold">Name: <span className="font-normal">{teacherData.name}</span></p>
        <p className="text-lg font-semibold">Gender: <span className="font-normal">{teacherData.gender}</span></p>
        <p className="text-lg font-semibold">Date of Birth: <span className="font-normal">{teacherData.dateOfBirth}</span></p>
        <p className="text-lg font-semibold">Phone: <span className="font-normal">{teacherData.phone}</span></p>
        <p className="text-lg font-semibold">Email: <span className="font-normal">{teacherData.email}</span></p>
        <p className="text-lg font-semibold">User Type: <span className="font-normal">{teacherData.userType}</span></p>
        <p className="text-lg font-semibold">Salary: <span className="font-normal">${teacherData.salary}</span></p>
      </div>

      {teacherData.assignedClasses && teacherData.assignedClasses.length > 0 ? (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Assigned Classes</h2>
          {teacherData.assignedClasses.map((classData) => (
            <div key={classData._id} className="p-4 border rounded-md bg-white shadow-md mb-2">
              <p className="text-lg font-bold">Class Name: {classData.name}</p>
              <p>Year: {classData.year}</p>
              <p>Student Limit: {classData.studentLimit}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4">No classes assigned.</p>
      )}
    </div>
  );
}

export default TeacherProfile;
