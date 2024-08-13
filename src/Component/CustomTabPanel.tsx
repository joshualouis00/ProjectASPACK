import React, { useCallback, useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import AppTable from "./TableComponent/MaterialTableUploadTemplate";
import { useDropzone } from "react-dropzone";

export interface ITabContent {
  label: string;
}

interface FileData {
  fileName: string;
  createDate: string;
  status: string;
  fileURL: string;
}

const TabContent: React.FC<ITabContent> = (props: ITabContent) => {
  const [files, setFiles] = useState<FileData[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      fileName: file.name,
      createDate: new Date().toDateString(),
      status: "Active",
      fileURL: URL.createObjectURL(file),
    }));

    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.fileURL));
    };
  }, [files]);

  return (
    <Container
      maxWidth="xl"
      sx={{ paddingLeft: "2px !important", paddingRight: "2px !important" }}
    >
      <Typography variant="h4" component="div" sx={{ fontSize: "14px", mb: 1 }}>
        {"Upload Template " + props.label}
      </Typography>
      <Typography component="div" sx={{ fontSize: "12px", mb: 2 }}>
        {
          "A new file will automatically deactivate the previous file. The file accessible by affco will be the latest uploaded file."
        }
      </Typography>
      <Box
        {...getRootProps()}
        sx={{
          border: "0.5px dashed #ccc",
          borderRadius: "4px",
          padding: "20px",
          height: "200px",
          textAlign: "center",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
        }}
      >
        <input {...getInputProps()} />
        <Typography color="textSecondary" component="div" sx={{ fontSize: "10px" }}>
          Drag 'n' drop some files here, or click to select files
        </Typography>
      </Box>
      <Box sx={{ width: "100%" }}>
        <AppTable files={files} setFiles={setFiles} />
      </Box>
    </Container>
  );
  
};

export default TabContent;