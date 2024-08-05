import * as React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import IconButton from "@mui/material/IconButton";

import Textfield from "../common/Textfield";
import ImageDropzone from "../common/ImageDropzone";

import { updateUser } from "../../services/api/user";

import { User } from "../../utils/types/userTypes";

import "../../styles/modal/UpdateUserInfoModal.scss";

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
  user: User;
  image: any;

  open: boolean;
  handleClose: () => void;
}

const UpdateUserInfoModal = (props: ICreateRoomModalProps) => {
  const { open, handleClose } = props;
  const [updatedUser, setUpdatedUser] = React.useState({
    id: props.user.id,
    firstName: props.user.firstName,
    lastName: props.user.lastName,
    email: props.user.email,
    image: null,
  });

  const updateUserOnSubmit = async () => {
    const data = new FormData();

    data.append("firstName", updatedUser.firstName);
    data.append("lastName", updatedUser.lastName);
    data.append("email", updatedUser.email);

    if (updatedUser.image) data.append("image", updatedUser.image);

    let response = await updateUser(data);

    if (response.success) {
      handleClose();
    } else {
      console.log("Failed to update user");
    }
  };

  const updateOnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setUpdatedUser({ ...updatedUser, [field]: e.target.value });
  };

  const setImage = (image: any) => {
    setUpdatedUser((prevState) => ({
      ...prevState,
      image: image,
    }));
  };

  return (
    <div className="edit-user-page__container">
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <form
            className="edit-room-modal__form"
            onSubmit={(e) => {
              e.preventDefault();

              updateUserOnSubmit();
            }}
          >
            <div className="close-button">
              <IconButton onClick={handleClose} style={{ color: "white" }}>
                <CancelRoundedIcon />
              </IconButton>
            </div>

            <Textfield
              label="First name"
              value={updatedUser.firstName}
              onChange={(e) => updateOnChange(e, "firstName")}
            />

            <Textfield
              label="Last name"
              value={updatedUser.lastName}
              onChange={(e) => updateOnChange(e, "lastName")}
            />

            <Textfield
              label="Email"
              value={updatedUser.email}
              onChange={(e) => updateOnChange(e, "email")}
            />

            <div className="image_container">
              <ImageDropzone image={updatedUser.image} setImage={setImage} />
            </div>

            <Button className="submit-button" type="submit">
              Submit
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default UpdateUserInfoModal;
