import React from "react";
import { Link } from "react-router-dom";
import Avatar from "../../shared/components/UIElements/Avatar/Avatar";
import Card from "../../shared/components/UIElements/Card/Card";

const UserItem = ({ image, name, placeCount, id }) => {
  return (
    <div className="w-[250px]">
      <Link to={`/${id}/places`}>
        <Card className="flex gap-4 items-center">
          <div className="aspect-[1] w-[64px]">
            <Avatar image={`http://localhost:8000/${image}`} alt={name} />
          </div>
          <div>
            <div className="text-[20px] font-bold">{name}</div>
            <div>
              {placeCount} {placeCount === 1 ? "Place" : "Places"}
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
};

export default UserItem;
