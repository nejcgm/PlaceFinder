import React from "react";
import UserItem from "./UserItem";
import Card from "../../shared/components/UIElements/Card/Card";

const UsersList = ({ users }) => {
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center py-4">
        <Card>No users found.</Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {users.map((user) => (
        <UserItem
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          placeCount={user.places.length}
        />
      ))}
    </div>
  );
};

export default UsersList;
