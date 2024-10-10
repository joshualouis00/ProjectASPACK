import {
  Box,
  Tabs,
  Tab,
  ThemeProvider,
  Typography,
  Container,
  Button,
  Snackbar,
  Alert,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import CustomTheme from "../Theme/CustomTheme";
import axios from "axios";
import useHandleUnauthorized from "../Component/handleUnauthorized";
import { apiUrl, getToken } from "../Component/TemplateUrl";
import { useDropzone } from "react-dropzone";
import { MRT_ColumnDef, MaterialReactTable } from "material-react-table";
import { format, parse } from "date-fns";

interface FileData {
  fileName: string;
  createDate: string;
  status: string;
  file: File;
  vAttchId: string;
  iVersion: number;
  vStepId: string;
}

interface ITabContent {
  label: string;
  vStepId: string;
  vFileType: string;
  files: FileData[];
  setFiles: (files: FileData[]) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface AppTableProps {
  files: FileData[];
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const MasterTemplate = () => {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [data, setData] = useState<any[]>([]);
  const [files, setFiles] = useState<{ [key: string]: FileData[] }>({});
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const navigate = useHandleUnauthorized();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get(apiUrl + "api/WorkflowStep/getStep", {
          headers: {
            Authorization: `Bearer ` + getToken,
          },
        });
        setData(resp.data.data);
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          navigate();
        } else {
          console.error("Error fetching templates:", error);
        }
      }
    };

    fetchData();
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleFileChange = (stepId: string, newFiles: FileData[]) => {
    setFiles((prevFiles) => ({
      ...prevFiles,
      [stepId]: newFiles,
    }));
  };

  const getTemplates = async () => {
    try {
      const response = await axios.get(apiUrl + "api/Template/GetTemplates", {
        headers: {
          Authorization: `Bearer ` + getToken,
        },
      });

      if (response.status === 200) {
        const backendData = response.data.data;
        const updatedFiles: { [key: string]: FileData[] } = {};

        backendData.forEach((item: any) => {
          if (item.vAttchId !== "") {
            const filesForStep = item.attachment.map((element: any) => ({
              fileName: element?.vFileName || "",
              createDate: element?.dCrea,
              status: element?.vStatus === "1" ? "Active" : "Inactive",
              file: new File([], element?.vFileName || ""),
              vAttchId: item.vAttchId,
              iVersion: element.iVersion,
            }));
            updatedFiles[item.vStepId] = filesForStep;
          }
        });

        setFiles(updatedFiles);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        navigate();
      } else {
        console.error("Error fetching templates:", error);
      }
    }
  };

  useEffect(() => {
    getTemplates();
  }, []);

  const activeSteps = data.filter((item) => item.bActive);

  const gatherAllDraftFiles = () => {
    const allDraftFiles: FileData[] = [];

    for (const stepId in files) {
      const stepFiles = files[stepId].filter((file) => file.status === "Draft");
      allDraftFiles.push(...stepFiles);
    }

    return allDraftFiles;
  };

  const handleUploadAll = async () => {
    const allDraftFiles = gatherAllDraftFiles();

    if (allDraftFiles.length === 0) {
      console.error("No draft files to upload.");
      return;
    }

    const formData = new FormData();

    allDraftFiles.forEach((file, index) => {
      formData.append(`template[${index}].vAttchId`, file.vAttchId);
      formData.append(`template[${index}].vStepId`, file.vStepId);
      formData.append(`template[${index}].attachment[0].fFile`, file.file);
      formData.append(
        `template[${index}].attachment[0].vFileName`,
        file.fileName
      );
    });

    try {
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
        setUploadStatus("success");
        await getTemplates()
        setTimeout(() => {
          setUploadStatus(null);
        }, 5000);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        navigate();
      } else {
        console.error("Error uploading files:", error);
        setUploadStatus("error");
        setTimeout(() => {
          setUploadStatus(null);
        }, 5000);
      }
    }
  };

  return (
    <ThemeProvider theme={CustomTheme}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{
            style: {
              backgroundColor: CustomTheme.palette.accent.primary,
            },
          }}
          textColor="inherit"
          variant="scrollable"
          aria-label="full width tabs example"
          sx={{
            "& .MuiTabs-flexContainer": {
              gap: "10px",
            },
          }}
        >
          {activeSteps.map((item, index) => (
            <Tab
              label={item.vStepDesc}
              {...a11yProps(index)}
              key={item.vStepId}
              sx={{
                minWidth: "50px",
                fontSize: "10px",
                fontWeight: "bold",
                borderRight: 1,
              }}
            />
          ))}
        </Tabs>
        {activeSteps.map((item, index) => (
          <TabPanel value={value} index={index} key={item.vStepId}>
            <TabContent
              label={item.vStepDesc}
              vStepId={item.vStepId}
              vFileType={item.vAttType}
              files={files[item.vStepId] || []}
              setFiles={(newFiles: FileData[]) =>
                handleFileChange(item.vStepId, newFiles)
              }
            />
          </TabPanel>
        ))}
         <Button
          variant="contained"
          sx={{ mt: 1, mb: 1 }}
          onClick={handleUploadAll}
          disabled={
            gatherAllDraftFiles().filter((file) => file.status === "Draft").length === 0 || 
            gatherAllDraftFiles().length === 0
          }
        >
          {gatherAllDraftFiles().filter((val) => val.status === "Draft").length > 1
            ? "Submit All"
            : "Submit"}
        </Button>
      </Box>
    </ThemeProvider>
  );
};

const TabContent: React.FC<ITabContent> = ({
  label,
  vStepId,
  vFileType,
  files,
  setFiles,
}) => {
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [fileList, setFileList] = useState<FileData[]>(files);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useHandleUnauthorized();
  const [stepData, setStepData] = useState([]);

  const fetchData = async () => {
    try {
      const resp = await axios.get(apiUrl + "api/WorkflowStep/getStep", {
        headers: {
          Authorization: `Bearer ` + getToken,
        },
      });
      setStepData(resp.data.data); // Simpan step data di state
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        navigate();
      } else {
        console.error("Error fetching steps:", error);
      }
    }
  };

  useEffect(() => {
    setFileList(files);
  }, [files]);

  useEffect(() => {
    fetchData();
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const fileTypeMap: { [key: string]: string[] } = {
        PDF: ["application/pdf"],
        Excel: [
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
        ],
        Both: [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
        ],
      };

      if (vFileType === "Both") {
        const invalidFiles = acceptedFiles.filter(
          (file) => !fileTypeMap["Both"].includes(file.type)
        );
        if (invalidFiles.length > 0) {
          setErrorMessage("Uploaded files must be either PDF or Excel.");
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
          return;
        }
      } else {
        const validExtension = fileTypeMap[vFileType] || [];
        const invalidFiles = acceptedFiles.filter(
          (file) => !validExtension.includes(file.type)
        );

        if (invalidFiles.length > 0) {
          setErrorMessage(`The uploaded template must be ${vFileType}.`);
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
          return;
        }
      }

      const newFiles = acceptedFiles.map((file) => ({
        fileName: file.name,
        createDate: new Date().toDateString(),
        status: "Draft",
        file: file,
        vAttchId: "",
        iVersion: 1,
        vStepId: vStepId,
      }));

      const updatedFileList = [...files, ...newFiles].sort((a, b) => {
        if (a.status === "Draft" && b.status !== "Draft") return -1;
        if (a.status !== "Draft" && b.status === "Draft") return 1;
        return 0;
      });

      setFileList(updatedFileList);
      setFiles(updatedFileList);
      setErrorMessage(null);
    },
    [vFileType, files, setFiles]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <Box>
      <Container
        maxWidth="xl"
        sx={{ paddingLeft: "2px !important", paddingRight: "2px !important" }}
      >
        <Typography
          variant="h4"
          component="div"
          sx={{ fontSize: "14px", mb: 1 }}
        >
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
          <Typography>Drop or select your {vFileType} file here</Typography>
        </Box>
        <AppTable
          files={fileList}
          uploadStatus={uploadStatus}
          errorMessage={errorMessage}
        />
        {errorMessage && (
          <Typography color="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Typography>
        )}
        {uploadStatus && (
          <Snackbar open={uploadStatus === "success"} autoHideDuration={5000}>
            <Alert
              severity={uploadStatus === "success" ? "success" : "error"}
              sx={{ width: "100%" }}
            />
          </Snackbar>
        )}
      </Container>
    </Box>
  );
};

const AppTable: React.FC<
  AppTableProps & { uploadStatus: string | null; errorMessage: string | null }
> = ({ files, uploadStatus }) => {
  const navigate = useHandleUnauthorized();
  const [showAlert, setShowAlert] = React.useState(false);

  const downloadFile = async (
    fileName: string,
    vAttchId: string,
    status: string,
    iVersion: any // Pastikan iVersion diterima sebagai parameter
  ) => {
    const encodedFileName = btoa(fileName); // Encode filename

    const url =
      apiUrl +
      `api/Template/DownloadTemplate?vName=${encodedFileName}&vAttachId=${vAttchId}&iVersion=${iVersion}`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ` + getToken,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        navigate();
      } else {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 5000);
        console.error("Error fetching templates:", error);
      }
    }
  };

  const columns = React.useMemo<MRT_ColumnDef<FileData>[]>(
    () => [
      {
        accessorKey: "fileName",
        header: "File Name",
        size: 300,
        Cell: ({ cell }) => (
          <span
            style={{
              display: "block",
              width: "100%", // Agar mengambil lebar kolom
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {cell.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "createDate",
        header: "Create Date",
        Cell: ({ cell }) => {
          const dateStr = cell.getValue<string>();
          let formattedDate = " ";

          try {
            const date = parse(dateStr, "dd-MM-yyyy", new Date());
            if (!isNaN(date.getTime())) {
              formattedDate = format(date, "dd/MM/yyyy");
            }
          } catch (error) {
            console.error("Error parsing or formatting date:", error);
          }

          return (
            <span
              style={{
                display: "block",
                width: "100%", // Agar mengambil lebar kolom
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {formattedDate}
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ cell }) => <span>{cell.getValue<string>()}</span>,
      },
      {
        header: "Download",
        Cell: ({ row }) => {
          const fileName = row.original.fileName;
          const vAttchId = row.original.vAttchId;
          const fileStatus = row.original.status;
          const iVersion = row.original.iVersion;

          return (
            <Button
              onClick={() =>
                downloadFile(fileName, vAttchId, fileStatus, iVersion)
              }
              variant="outlined"
              color="info"
              size="small"
              disabled={
                fileStatus === "Draft" || uploadStatus === "Upload successful"
              }
            >
              Download
            </Button>
          );
        },
      },
    ],
    []
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={files}
      enableStickyHeader
      muiTableBodyProps={{
        sx: {
          "tr:last-child td": {
            borderBottom: "1px solid #e0e0e0",
          },
        },
      }}
    />
  );
};

export default MasterTemplate;
