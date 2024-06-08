import React, { useState, useEffect } from "react";
import NavigationBar from "./NavigationBar";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
    profilePhoto: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [newProfilePhoto, setNewProfilePhoto] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    Axios.defaults.withCredentials = true;
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await Axios.get("http://localhost:3000/user/profile");
      setUserProfile(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handlePhotoChange = (e) => {
    setNewProfilePhoto(e.target.files[0]);
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("firstname", userProfile.firstname);
    formData.append("lastname", userProfile.lastname);
    formData.append("password", newPassword);
    if (newProfilePhoto) {
      formData.append("profilePhoto", newProfilePhoto);
    }

    try {
      await Axios.put("http://localhost:3000/user/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setEditMode(false);
      fetchUserProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <>
      <NavigationBar />
      <div className="min-h-screen bg-secondary flex flex-col items-center py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full md:w-1/2 lg:w-1/3">
          <h2 className="text-2xl font-bold text-primary mb-4">Profile</h2>
          <div className="flex flex-col items-center mb-4">
            {userProfile.profilePhoto && (
              <img
                src={userProfile.profilePhoto}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover mb-4"
              />
            )}
            {editMode && (
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="mb-4"
              />
            )}
          </div>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col">
              <label className="text-gray-700">First Name</label>
              <input
                type="text"
                value={userProfile.firstname}
                onChange={(e) =>
                  setUserProfile({ ...userProfile, firstname: e.target.value })
                }
                readOnly={!editMode}
                className="mt-1 p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700">Last Name</label>
              <input
                type="text"
                value={userProfile.lastname}
                onChange={(e) =>
                  setUserProfile({ ...userProfile, lastname: e.target.value })
                }
                readOnly={!editMode}
                className="mt-1 p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700">Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                readOnly={!editMode}
                className="mt-1 p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            {editMode ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-primary text-white px-4 py-2 rounded-md mr-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="bg-secondary text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="bg-primary text-white px-4 py-2 rounded-md"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
