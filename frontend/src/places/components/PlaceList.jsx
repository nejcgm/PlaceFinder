import React from "react";
import Card from "../../shared/components/UIElements/Card/Card";
import PlaceItem from "./PlaceItem";
import Button from "../../shared/components/FormElements/Button/Button";

const PlaceList = ({places}) => {
  if (places.length === 0) {
    return (
      <div className="flex flex-col items-center py-4">
        <Card className='flex flex-col'>No users found.
        <Button to='/places/new'>Share Place</Button>
        </Card>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {places.map((place) => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.image}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator}
          coordinates={place.location}
        />
      ))}
    </div>
  );
};

export default PlaceList;
