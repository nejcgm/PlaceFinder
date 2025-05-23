import React, { useState } from "react";
import Card from "../../shared/components/UIElements/Card/Card";
import Button from "../../shared/components/FormElements/Button/Button";
import Modal from "../../shared/components/UIElements/Modal/Modal";
import "../../shared/components/UIElements/Modal/Modal.css";
import { Map, Marker } from "pigeon-maps";

const PlaceItem = ({
  id,
  image,
  title,
  description,
  address,
  creatorId,
  coordinates,
}) => {
  const [showMap, setShowMap] = useState(false);

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  return (
    <>
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footerContent={<Button onClick={closeMapHandler}>Close</Button>}
      >
        <Map height={400} defaultCenter={[coordinates.lat, coordinates.lng]} defaultZoom={11}>
          <Marker width={50} anchor={[coordinates.lat, coordinates.lng]} />
        </Map>
      </Modal>
      <Card>
        <div>
          <img src={image} alt={title} />
        </div>
        <div>
          <div className="font-bold text-[32px]">{title}</div>
          <div className="font-bold text-[24px]">{address}</div>
          <div>{description}</div>
        </div>
        <div className="flex gap-2 mt-[16px]">
          <Button inverse onClick={openMapHandler}>
            View on Map
          </Button>
          <Button to={`/places/${id}`}>Edit</Button>
          <Button danger>Delete</Button>
        </div>
      </Card>
    </>
  );
};

export default PlaceItem;
