import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { cloudinaryUpload } from "../../../services/cloudinary";
import Button from "@mui/material/Button";
import apiClient from "../../../services/axiosConfig";
import { updateProfilePicture } from "../../../redux/slices/authSlice";
import LogoutButton from "../../Auth/Logout/logout";
export default function Settings() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [profilePhoto, setProfilePhoto] = useState(user.profilePicture);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const imageUrl = await cloudinaryUpload(file);
      setProfilePhoto(imageUrl);

      await apiClient.post(`/api/v1/users/change-profile-picture/${user._id}`, {
        profilePicture: imageUrl,
      });

      dispatch(updateProfilePicture(imageUrl));
    } catch (error) {
      console.error("Error uploading or updating profile photo:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <div style={{ color: "#ffffff", fontSize: "20px", fontWeight: "600" }}>
        Settings
      </div>
      <div
        style={{
          width: "200px",
          height: "200px",
          overflow: "hidden",
          borderRadius: "50%",
          margin: "20px auto",
          border: "2px solid #ddd",
        }}
      >
        <img
          src={profilePhoto}
          alt="Profile"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <Button
        variant="contained"
        onClick={() => fileInputRef.current.click()}
        sx={{
          marginTop: "10px",
          backgroundColor: "#1976d2",
          color: "#fff",
          "&:hover": { backgroundColor: "#1565c0" },
        }}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Change Photo"}
      </Button>
      <br />
      <br />
      <LogoutButton />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
}
