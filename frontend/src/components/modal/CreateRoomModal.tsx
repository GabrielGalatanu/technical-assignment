import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import IconButton from "@mui/material/IconButton";

import Textfield from "../common/Textfield";
import ImageDropzone from "../common/ImageDropzone";

import "../../styles/rooms/CreateRoomModal.scss";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  height: 600,
  bgcolor: "rgba(0, 0, 0, 0.5);",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface ICreateRoomModalProps {
  name: string;
  image: any;

  open: boolean;
  handleClose: () => void;
  handleSubmit: () => void;

  setName: (name: string) => void;
  setImage: (image: any) => void;
}

const CreateRoomModal = (props: ICreateRoomModalProps) => {
  const { name, image, open, handleClose, handleSubmit, setName, setImage } =
    props;

  return (
    <div className="edit-room-modal__container">
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <form
            className="edit-room-modal__form"
            onSubmit={(e) => {
              e.preventDefault();

              handleSubmit();
            }}
          >
            <div className="close-button">
              <IconButton onClick={handleClose} style={{ color: "white" }}>
                <CancelRoundedIcon />
              </IconButton>
            </div>

            <Textfield
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <ImageDropzone image={image} setImage={setImage} />

            <Button className="submit-button" type="submit">
              Submit
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default CreateRoomModal;
