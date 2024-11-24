import React, { useState } from "react";
import { useQuery, useMutation } from "react-query";
import { getUser, deleteUser } from "../service"; // Import deleteUser function

import { UserForm } from "./addUser";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import type { UserProps } from "../types/type";

const USERS_PER_PAGE = 3; // Number of users to display per page

export const User = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [userToEdit, setUserToEdit] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Track the current page

  const { data, isLoading, error, refetch } = useQuery(
    ["user_telkom_malang", currentPage], // Unique key includes current page
    () => getUser(currentPage, USERS_PER_PAGE), // Fetch users for the current page
    {
      refetchInterval: 3000,
      retry: 3,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
    }
  );

//   mutasi = perubahan data
  const mutation = useMutation(deleteUser, {
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.error("Error deleting user:", error);
    },
  });

  const handleDelete = (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      mutation.mutate(userId);
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1); // Go to the next page
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1)); // Go to the previous page
  };

  if (isLoading) {
    return <CircularProgress />;
  }
  if (error) {
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  return (
    <Box
      sx={{
        padding: "45px",
        maxWidth: "800px",
        margin: "0 auto",
        backgroundColor: "#F9F9F9",
        borderRadius: "12px",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setIsEdit(false);
          setUserToEdit("");
        }}
        sx={{ marginBottom: "20px", fontWeight: "bold", fontSize: "16px" }}
      >
        Add User
      </Button>
  
      {data.data.map((user: UserProps) => (
        <Card
          key={user.id_user}
          sx={{
            margin: "10px 0",
            padding: "10px",
            backgroundColor: "#FFFFFF",
            borderRadius: "10px",
            boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", fontSize: "16px", color: "#333" }}
            >
              {user.nama_user}
            </Typography>
            <Box sx={{ display: "flex", gap: "10px" }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  setIsEdit(true);
                  setUserToEdit(user.id_user);
                }}
                sx={{ fontWeight: "bold", fontSize: "14px" }}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDelete(user.id_user)}
                sx={{ fontWeight: "bold", fontSize: "14px" }}
              >
                Delete
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
  
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "20px",
          padding: "10px 0",
          borderTop: "1px solid #E0E0E0",
        }}
      >
        <Button
          variant="outlined"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          sx={{
            fontWeight: "bold",
            color: currentPage === 1 ? "#A0A0A0" : "#1976d2",
            borderColor: currentPage === 1 ? "#A0A0A0" : "#1976d2",
          }}
        >
          Previous
        </Button>
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: "14px",
            color: "#555",
          }}
        >
          Page {currentPage}
        </Typography>
        <Button
          variant="outlined"
          onClick={handleNextPage}
          disabled={data.data.length < USERS_PER_PAGE}
          sx={{
            fontWeight: "bold",
            color: data.data.length < USERS_PER_PAGE ? "#A0A0A0" : "#1976d2",
            borderColor: data.data.length < USERS_PER_PAGE ? "#A0A0A0" : "#1976d2",
          }}
        >
          Next
        </Button>
      </Box>
  
      <UserForm isEdit={isEdit} userId={userToEdit} />
    </Box>
  );
  
};
