import React from 'react'
import Card from "../../shared/components/UIElements/Card/Card";
import Button from '../../shared/components/FormElements/Button/Button';


const PlaceItem = ({id,image,title,description,address,creatorId,coordinates}) => {
  return (
    <Card>
        <div>
            <img src={image} alt={title} />
        </div>
        <div>
            <div className='font-bold text-[32px]'>{title}</div>
            <div className='font-bold text-[24px]'>{address}</div>
            <div>{description}</div>
        </div>
        <div className='flex gap-2 mt-[16px]'>
            <Button inverse>View on Map</Button>
            <Button to={`/places/${id}`}>Edit</Button>
            <Button danger>Delete</Button>
        </div>
    </Card>
  )
}

export default PlaceItem