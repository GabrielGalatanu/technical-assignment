import React, { useCallback } from "react";

import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { useDropzone } from "react-dropzone";

import "../../styles/common/ImageDropzone.scss";

const baseStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  borderWidth: 1,
  borderRadius: 10,
  borderColor: "white",
  borderStyle: "solid",
  backgroundColor: "none",
  color: "white",
  outline: "none",
  transition: "border .24s ease-in-out",
  width: "460px",
};

interface Props {
  //image is a file
  image: File | null;
  //   setImage: (image: File) => void;
  setImage: (image: any) => void;
}

const ImageDropzone = (props: Props) => {
  const onDrop = useCallback((acceptedFiles: any) => {
    props.setImage(acceptedFiles[0]);
  }, []);

  const handleRemoveImage = () => {
    props.setImage(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
      {props.image ? (
        <div className="image-drop-zone__container">
          <CancelRoundedIcon
            onClick={handleRemoveImage}
            className="image-drop-zone__remove-icon"
          />
          <img
            className="image-drop-zone__image"
            src={URL.createObjectURL(props.image)}
            alt=""
          />
        </div>
      ) : (
        <div
          {...getRootProps({
            style: baseStyle,
          })}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
        </div>
      )}
    </>
  );
};

export default ImageDropzone;
