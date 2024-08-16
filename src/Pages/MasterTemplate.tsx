import { Box, Tabs, Tab, ThemeProvider, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomTheme from "../Theme/CustomTheme";
import TabContent from "../Component/CustomTabPanel";
import axios from "axios";

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

interface FileData {
  fileName: string;
  createDate: string;
  status: string;
  file: File; // Menyimpan file asli
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
  const [value, setValue] = React.useState(0);
  const [data, setData] = useState<any[]>([]);
  const [files, setFiles] = useState<{ [key: string]: FileData[] }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get(
          "http://192.168.1.207:9020/api/WorkflowStep/getStep"
        );
        setData(resp.data.data);
      } catch (error) {
        console.error("Errornya : ", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
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
      const response = await axios.get(
        "http://192.168.1.207:9020/api/Template/GetTemplates",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        const backendData = response.data.data;
        const updatedFiles: { [key: string]: FileData[] } = {};

        backendData.forEach((item: any) => {
          if (item.vAttchId !== '') {
            const filesForStep = item.attachment.map((element: any) => ({
              fileName: element?.vFileName || '',
              createDate: new Date().toDateString(),
              status: element?.vStatus === "1" ? "Active" : "Inactive",
              file: new File([], element?.vFileName || '')
            }));

            updatedFiles[item.vStepId] = filesForStep;
          }
        });

        setFiles(updatedFiles);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  useEffect(() => {
    getTemplates();
  }, []);

  const activeSteps = data.filter((item) => item.bActive);

  return (
    <ThemeProvider theme={CustomTheme}> {/* Wrap with ThemeProvider */}
      <Box>
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
              }}
            />
          ))}
        </Tabs>
        {activeSteps.map((item, index) => (
          <TabPanel
            value={value}
            index={index}
            dir={theme.direction}
            key={item.vStepId}
          >
            <TabContent
              label={item.vStepDesc}
              vStepId={item.vStepId}
              vFileType={item.vAttType}
              files={files[item.vStepId] || []}
              setFiles={(newFiles: FileData[]) => handleFileChange(item.vStepId, newFiles)}
            />
          </TabPanel>
        ))}
      </Box>
    </ThemeProvider>
  );
};

export default MasterTemplate;
