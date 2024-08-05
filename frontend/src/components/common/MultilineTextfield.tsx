import React from "react";

import TextField from "@mui/material/TextField";

interface Props {
  label: string;
  rows: number;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const MultiLineTextfield = (props: Props) => {
  const { label, value, onChange, rows = 4 } = props;

  return (
    <TextField
      InputProps={{
        style: { color: "white" },
      }}
      InputLabelProps={{
        style: { color: "white" },
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "white !important",
          },
          "&:hover fieldset": {
            borderColor: "white !important",
          },
          "&.Mui-focused fieldset": {
            borderColor: "white !important",
          },
        },
        "& .MuiInput-underline:after": {
          borderBottomColor: "white",
        },
      }}
      label={label}
      value={value}
      onChange={onChange}
      multiline
      rows={rows}
      fullWidth
    />
  );
};

export default MultiLineTextfield;
