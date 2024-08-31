import React, { useCallback, useState, useEffect } from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import AppTable from "./TableComponent/MaterialTableUploadTemplate";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import useHandleUnauthorized from "../Component/handleUnauthorized";
import { apiUrl, getToken } from "./TemplateUrl";
import { ITabContent, FileData } from "./Interface/MasterTemplates";

const TabContent: React.FC<ITabContent> = ({ label, vStepId, vFileType, files, setFiles }) => {
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [fileList, setFileList] = useState<FileData[]>(files);
  const navigate = useHandleUnauthorized();

  useEffect(() => {
    setFileList(files);
  }, [files]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const validExtensions = vFileType === "PDF"
        ? ["application/pdf"]
        : vFileType === "Excel"
        ? ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"]
        : ["application/pdf", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"];

      const newFiles = acceptedFiles.filter((file) =>
        validExtensions.includes(file.type)
      ).map((file) => ({
        fileName: file.name,
        createDate: new Date().toDateString(),
        status: "Draft",
        file: file,
        vAttchId: "",
      }));

      setFileList((prevList) => [...prevList, ...newFiles]);
      setFiles([...files, ...newFiles]); // Update the files in the parent component
    },
    [vFileType, files, setFiles]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleUpload = async () => {
    try {
      const formData = new FormData();

      // Filter only files with "Draft" status for upload
      const draftFiles = fileList.filter(file => file.status === "Draft");

      draftFiles.forEach((file, index) => {
        formData.append(`template[${index}].vAttchId`, "");
        formData.append(`template[${index}].vStepId`, vStepId);
        formData.append(`template[${index}].attachment[0].fFile`, file.file);
        formData.append(`template[${index}].attachment[0].vFileName`, file.fileName);
      });

      const response = await axios.post(
        apiUrl + "api/Template/AddTemplate",
        formData,
        {
          headers: {
            Authorization: `Bearer ` + getToken,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setUploadStatus("Upload successful");
        setTimeout(() => setUploadStatus(null), 5000);
        await getTemplates(); // Update file list after successful upload
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      if (error.response && error.response.status === 401) {
        setUploadStatus("Upload failed");
        setTimeout(() => setUploadStatus(null), 5000);
        navigate();
      } else {
        console.error("Error Add templates:", error);
      }
    }
  };

  const getTemplates = async () => {
    try {
      const response = await axios.get(
        apiUrl + "api/Template/GetTemplates",
        {
          headers: {
            Authorization: `Bearer ` + getToken,
          },
        }
      );

      if (response.status === 200) {
        const backendData = response.data.data;

        if (Array.isArray(backendData)) {
          const updatedFiles: FileData[] = backendData
            .filter((x) => x.vStepId === vStepId && x.vAttchId !== "")
            .flatMap((item: any) =>
              item.attachment.map((element: any) => ({
                fileName: element?.vFileName || "",
                createDate: element?.dCrea,
                status: element?.vStatus === "1" ? "Active" : "Inactive",
                file: new File([], element?.vFileName || ""),
              }))
            );

          setFileList(updatedFiles);
          setFiles(updatedFiles);
        } else {
          console.error("Expected array but got:", backendData);
        }
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        navigate();
      } else {
      console.error("Error Get templates:", error);
      }
    }
  };
  
  return (
    <Container
      maxWidth="xl"
      sx={{ paddingLeft: "2px !important", paddingRight: "2px !important" }}
    >
      <Typography variant="h4" component="div" sx={{ fontSize: "14px", mb: 1 }}>
        {"Upload Template " + label}
      </Typography>
      <Typography component="div" sx={{ fontSize: "12px", mb: 2 }}>
        {"A new file will automatically deactivate the previous file. The file accessible by affco will be the latest uploaded file."}
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
      <Button
        onClick={handleUpload}
        variant="contained"
        color="info"
        sx={{mb: 1}}
      >
        Submit
      </Button>
      <AppTable files={fileList} />
      {uploadStatus && (
        <Typography
          variant="body1"
          color={uploadStatus.includes("successful") ? "green" : "red"}
          sx={{ marginTop: "20px" }}
        >
          {uploadStatus}
        </Typography>
      )}
    </Container>
  );
};

export default TabContent;
