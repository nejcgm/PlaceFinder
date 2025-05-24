import React, { useState, useEffect } from "react";
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  // const [isImageLoaded, setIsImageLoaded] = useState(false);

  // useEffect(() => {
  //   const img = new Image();
  //   img.src = image;
  //   img.onload = () => setIsImageLoaded(true);
  //   img.onerror = () => setIsImageLoaded(true); // or handle error
  // }, [image]);

  // if (!isImageLoaded) return null;

  const handleShowDeleteDialog = () => {
    setShowDeleteDialog(true);
  };
  const handleCancelDeleteDialog = () => {
    setShowDeleteDialog(false);
  };

  const confirmDelete = () => {
    //delete
    console.log("ne");
    setShowDeleteDialog(false);
  };

  const openMapHandler = () => setShowMap(false);

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
        <Map
          height={400}
          defaultCenter={[coordinates.lat, coordinates.lng]}
          defaultZoom={11}
        >
          <Marker width={50} anchor={[coordinates.lat, coordinates.lng]} />
        </Map>
      </Modal>
      <Modal
        header="Are you sure you want to delete?"
        footerClass="place-item__modal-actions"
        footerContent={
          <>
            <Button danger onClick={confirmDelete}>
              Delete
            </Button>
            <Button inverse onClick={handleCancelDeleteDialog}>
              Cancel
            </Button>
          </>
        }
        onCancel={handleCancelDeleteDialog}
        show={showDeleteDialog}
      >
        <p>This action can not be undone.</p>
      </Modal>
      <Card className="w-full max-w-[800px]">
        <div className="relative w-full aspect-[16/9]">
          <img className="w-full h-full" src={image} alt={title} />
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
          <Button danger onClick={handleShowDeleteDialog}>
            Delete
          </Button>
        </div>
      </Card>
    </>
  );
};

export default PlaceItem;
