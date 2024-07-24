import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import AppTable from "./TableComponent/MaterialTableUploadTemplate";
import { useDropzone } from "react-dropzone";

export interface ITabContent {
  label: string;
}

const TabContent = (props: ITabContent) => {
  //Drag n Drop dengan react-dropzone
  const onDrop = React.useCallback((acceptedFiles: any) => {
    // Handle the files here
    console.log(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <Container
      maxWidth="xl"
      sx={{ pl: "2px !important", pr: "2px !important" }}
    >
      <Typography variant="h5" color="initial">
        {"Upload Template " + props.label}
      </Typography>
      <Typography sx={{ color: "red", fontSize: "0.8rem" }}>
        {
          "*Template aspack harus di upload dan mekanisme status aktif adalah file template terakhir yang di upload"
        }
      </Typography>
      <Typography sx={{ fontSize: "0.8rem" }}>
        {
          "a new file will automatically deactivate the previous file. the file accessible by affco will be the latest uploaded file."
        }
      </Typography>
      <Box
        {...getRootProps()}
        sx={{
          border: "0.5px dashed #ccc",
          borderRadius: "4px",
          padding: "20px",
          height: "300px",
          textAlign: "center",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <input {...getInputProps()} />
        <Typography color="textSecondary">
          Drag 'n' drop some files here, or click to select files
        </Typography>
      </Box>
      <Box sx={{ width: "100%" }}>
        <AppTable />
      </Box>
    </Container>
  );
};

export default TabContent;
