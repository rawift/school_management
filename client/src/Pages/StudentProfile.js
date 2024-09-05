import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { server_api } from '../server_ip'; 

function StudentProfile() {
  const { id } = useParams(); 
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
      
        const response = await axios.post(
          `${server_api}/user/studentProfile`,
          { userId: id }, 
          { withCredentials: true }
        );
        setStudentData(response.data); 
      } catch (error) {
        setError('Error fetching student profile');
        console.error('Error fetching student profile:', error);
      } finally {
        setLoading(false); 
      }
    };

    fetchStudentProfile();
  }, [id]);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  if (!studentData) {
    return <div className="text-center py-4">No student data found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Student Profile</h1>
      <div className="p-4 border rounded-md bg-white shadow-md">
        <p className="text-lg font-semibold">Name: <span className="font-normal">{studentData.name}</span></p>
        <p className="text-lg font-semibold">Gender: <span className="font-normal">{studentData.gender}</span></p>
        <p className="text-lg font-semibold">Date of Birth: <span className="font-normal">{studentData.dateOfBirth}</span></p>
        <p className="text-lg font-semibold">Phone: <span className="font-normal">{studentData.phone}</span></p>
        <p className="text-lg font-semibold">Email: <span className="font-normal">{studentData.email}</span></p>
        <p className="text-lg font-semibold">User Type: <span className="font-normal">{studentData.userType}</span></p>
        <p className="text-lg font-semibold">Fee Paid: <span className="font-normal">{studentData.feePaid}</span></p>
      </div>

      {studentData.classes && studentData.classes.length > 0 ? (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Enrolled Classes</h2>
          {studentData.classes.map((classData) => (
            <div key={classData._id} className="p-4 border rounded-md bg-white shadow-md mb-2">
              <p className="text-lg font-bold">Class Name: {classData.name}</p>
              <p>Year: {classData.year}</p>
              <p>Student Limit: {classData.studentLimit}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4">No classes enrolled.</p>
      )}
    </div>
  );
}

export default StudentProfile;
