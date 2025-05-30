import React, { useRef, useState, useEffect } from "react";
import Button from "../Button/Button";
import "./ImageUpload.css";

const ImageUpload = ({ id, center, errorText, onInput }) => {
  const filePickerRef = useRef();
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  }, [file]);

  const pickedHandler = (event) => {
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      const pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
      onInput(id, pickedFile, fileIsValid);
    } else {
      setIsValid(false);
      fileIsValid = false;
      onInput(id, null, fileIsValid);
    }
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className="form-control">
      <input
        id={id}
        ref={filePickerRef}
        style={{ display: "none" }}
        onChange={pickedHandler}
        type="file"
        accept=".jpg,.png,.jpeg"
      />
      <div className={`image-upload  ${center && "center"}`}>
        {previewUrl ? (
          <img
            className="image-upload__preview"
            src={previewUrl}
            alt="Preview"
          />
        ) : (
          <p>Please pick an image.</p>
        )}
        <Button type="button" onClick={pickImageHandler}>
          Pick Image
        </Button>
      </div>
      {!isValid && <p>{errorText}</p>}
    </div>
  );
};

export default ImageUpload;
