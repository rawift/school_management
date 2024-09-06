import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../Context/UserContext';
import axios from 'axios';
import { server_api } from '../server_ip';

function Profile() {
  const { user } = useContext(UserContext);

  const [formData, setFormData] = useState({
    name: '',
    gender: '', 
    dateOfBirth: '',
    phone: '',
    feePaid: '',
    salary: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        gender: user.gender || 'Male',
        dateOfBirth: user.dateOfBirth || '', 
        phone: user.phone || '',
        feePaid: user.feePaid || '',
        salary: user.salary || ''
      });
    }
  }, [user]);

  const isStudent = user?.userType === 'student';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${server_api}/user/form`, formData, {
        withCredentials: true
      });

      if (response.status === 200) {
        alert("Successful!")
      
      } else {
        console.error('Form submission failed:', response.statusText);
 
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    
    }
  };

  if (!user || Object.keys(user).length === 0) {
    return (
      <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Please Login First</h2>
        <p className="text-gray-700">You need to log in to access this information.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">{isStudent ? 'Student Form' : 'Teacher Form'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="border border-gray-300 p-2 w-full rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Gender</label>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                id="genderMale"
                name="gender"
                value="Male"
                checked={formData.gender === 'Male'}
                onChange={handleChange}
                className="form-radio"
              />
              <span className="ml-2">Male</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                id="genderFemale"
                name="gender"
                value="Female"
                checked={formData.gender === 'Female'}
                onChange={handleChange}
                className="form-radio"
              />
              <span className="ml-2">Female</span>
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dateOfBirth">
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="border border-gray-300 p-2 w-full rounded"
          />
        </div>

        {isStudent && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="feePaid">
              Fee Paid
            </label>
            <input
              type="number"
              id="feePaid"
              name="feePaid"
              value={formData.feePaid}
              onChange={handleChange}
              placeholder="Enter fee paid"
              className="border border-gray-300 p-2 w-full rounded"
            />
          </div>
        )}

        {!isStudent && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="salary">
              Salary
            </label>
            <input
              type="number"
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="Enter your salary"
              className="border border-gray-300 p-2 w-full rounded"
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Profile;
