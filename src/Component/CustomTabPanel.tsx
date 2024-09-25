import React, { useCallback, useState, useEffect } from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import AppTable from "./TableComponent/MaterialTableUploadTemplate";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import useHandleUnauthorized from "../Component/handleUnauthorized";
import { apiUrl, getToken } from "./TemplateUrl";
import { ITabContent, FileData } from "./Interface/MasterTemplates";

const TabContent: React.FC<ITabContent> = ({
  label,
  vStepId,
  vFileType,
  files,
  setFiles,
}) => {
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [fileList, setFileList] = useState<FileData[]>(files);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useHandleUnauthorized();

  // Update file list when files prop changes
  useEffect(() => {
    setFileList(files);
  }, [files]);

  // Handling file drop
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const validExtensions = [
        "application/pdf", // PDF
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Excel .xlsx
        "application/vnd.ms-excel"// Word .doc
      ];

      const invalidFiles = acceptedFiles.filter(
        (file) => !validExtensions.includes(file.type)
      );

      // Menampilkan pesan error jika ada file yang tidak valid
      if (invalidFiles.length > 0) {
        setErrorMessage(`Template yang di-upload harus berupa ${vFileType}.`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        return;
      }

      // Memproses file yang valid
      const newFiles = acceptedFiles
        .filter((file) => validExtensions.includes(file.type))
        .map((file) => ({
          fileName: file.name,
          createDate: new Date().toDateString(),
          status: "Draft",
          file: file,
          vAttchId: "",
          iVersion: 1,
        }));

      // Sort so Draft files appear at the top
      const updatedFileList = [...files, ...newFiles].sort((a, b) => {
        if (a.status === "Draft" && b.status !== "Draft") return -1;
        if (a.status !== "Draft" && b.status === "Draft") return 1;
        return 0; // Maintain order for files with same status
      });

      setFileList((prevList) => [...prevList, ...newFiles]);
      setFiles(updatedFileList); // Update parent state with sorted files
      setErrorMessage(null);
    },
    [vFileType, files, setFiles]
  );

  // Handle error message timeout
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (errorMessage) {
      timeout = setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [errorMessage]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  // Handling file upload
  const handleUpload = async () => {
    setIsUploading(true); // Mencegah upload ganda dengan men-disable tombol
    try {
      const formData = new FormData();
      const draftFiles = fileList.filter((file) => file.status === "Draft");

      draftFiles.forEach((file, index) => {
        formData.append(`template[${index}].vAttchId`, "");
        formData.append(`template[${index}].vStepId`, vStepId);
        formData.append(`template[${index}].attachment[0].fFile`, file.file);
        formData.append(
          `template[${index}].attachment[0].vFileName`,
          file.fileName
        );
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
        await getTemplates(); // Refresh file list after successful upload
        setTimeout(() => setUploadStatus(null), 5000);
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
    } finally {
      setIsUploading(false); // Re-enable button after upload
    }
  };

  // Fetching templates from backend
  const getTemplates = async () => {
    try {
      const response = await axios.get(apiUrl + "api/Template/GetTemplates", {
        headers: {
          Authorization: `Bearer ` + getToken,
        },
      });

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

  const draftExists = fileList.some((file) => file.status === "Draft");

  return (
    <Container
      maxWidth="xl"
      sx={{ paddingLeft: "2px !important", paddingRight: "2px !important" }}
    >
      <Typography variant="h4" component="div" sx={{ fontSize: "14px", mb: 1 }}>
        {"Upload Template " + label}
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
        <Typography
          color="textSecondary"
          component="div"
          sx={{ fontSize: "10px" }}
        >
          Drag 'n' drop some files here, or click to select files
        </Typography>
      </Box>
      <Button
        onClick={handleUpload}
        variant="contained"
        color="info"
        sx={{ mb: 1 }}
        disabled={!draftExists || isUploading} // Disable if no draft exists or already uploading
      >
        Submit
      </Button>
      <AppTable
        files={fileList}
        uploadStatus={uploadStatus}
        errorMessage={errorMessage}
      />
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
