import React, { useEffect, useState } from "react";
import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/ErrorModal/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/HttpHook";

const Users = () => {
  const [usersData, setUsersData] = useState([]);
  const { isLoading, error, sendRequest, handleErrorClear } = useHttpClient();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await sendRequest("http://localhost:8000/api/users");
        setUsersData(response.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    getUsers();
  }, []);

  return (
    <>
      {error && <ErrorModal error={error} onClear={handleErrorClear} />}
      {isLoading && (
        <div className="flex justify-center items-center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && <UsersList users={usersData} />}
    </>
  );
};

export default Users;
