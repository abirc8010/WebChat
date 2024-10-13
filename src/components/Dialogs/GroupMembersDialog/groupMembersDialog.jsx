import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroupMembers } from "../../../redux/slices/groupSlice";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Typography,
} from "@mui/material";

const GroupMembersDialog = ({ open, onClose, groupId }) => {
  const dispatch = useDispatch();
  const { members, loading, error } = useSelector((state) => state.group);

  useEffect(() => {
    if (open && groupId) {
      dispatch(fetchGroupMembers(groupId));
    }
  }, [open, groupId, dispatch]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Group Members</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          members.map((member) => (
            <div
              key={member._id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <img
                src={member.profilePicture}
                alt={member.username}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  marginRight: "16px",
                }}
              />
              <div style={{ flex: 1 }}>
                <Typography variant="h6" style={{ marginBottom: "4px" }}>
                  {member.username}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {member.email}
                </Typography>
              </div>
            </div>
          ))
        )}
      </DialogContent>
      <DialogActions>
        <button onClick={onClose}>Close</button>
      </DialogActions>
    </Dialog>
  );
};

export default GroupMembersDialog;
