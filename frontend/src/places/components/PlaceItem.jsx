import React, { useState, useContext} from "react";
import Card from "../../shared/components/UIElements/Card/Card";
import Button from "../../shared/components/FormElements/Button/Button";
import Modal from "../../shared/components/UIElements/Modal/Modal";
import "../../shared/components/UIElements/Modal/Modal.css";
import { Map, Marker } from "pigeon-maps";
import { AuthContext } from "../../shared/context/AuthContext";
import { useHttpClient } from "../../shared/hooks/HttpHook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/ErrorModal/LoadingSpinner";
import { osm } from 'pigeon-maps/providers';

const PlaceItem = ({
  id,
  image,
  title,
  description,
  address,
  coordinates,
  creatorId,
  onDelete,
}) => {
  const [showMap, setShowMap] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, handleErrorClear } = useHttpClient();
  
  const handleShowDeleteDialog = () => {
    setShowDeleteDialog(true);
  };
  const handleCancelDeleteDialog = () => {
    setShowDeleteDialog(false);
  };

  const confirmDelete = async () => {
    try {
      setShowDeleteDialog(false);
      await sendRequest(`http://localhost:8000/api/places/${id}`, "DELETE", null, {
        Authorization: "Bearer " + auth.token,
      });
      onDelete(id);
    } catch (error) {
      console.error("Error deleting place:", error);
    }
  };

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  return (
    <>
      <ErrorModal error={error} onClear={handleErrorClear} />
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
          defaultCenter={[coordinates.lat, coordinates.long]}
          defaultZoom={10}
          provider={osm}
        >
          <Marker
           width={50} 
           anchor={[coordinates.lat, coordinates.long]} 
           />
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
        {isLoading && <LoadingSpinner asOverlay />}
        <div className="relative w-full aspect-[16/9]">
          <img
            className="w-full h-full"
            src={`http://localhost:8000/${image}`}
            alt={title}
          />
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
          {auth.userId  === creatorId && (
            <>
              <Button to={`/places/${id}`}>Edit</Button>
              <Button danger onClick={handleShowDeleteDialog}>
                Delete
              </Button>
            </>
          )}
        </div>
      </Card>
    </>
  );
};

export default PlaceItem;
