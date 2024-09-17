import { Box, Tabs, Tab, ThemeProvider, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomTheme from "../Theme/CustomTheme";
import TabContent from "../Component/CustomTabPanel";
import axios from "axios";
import useHandleUnauthorized from "../Component/handleUnauthorized";
import { apiUrl, getToken } from "../Component/TemplateUrl";
import { TabPanelProps, FileData } from "../Component/Interface/MasterTemplates";

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
  const navigate = useHandleUnauthorized();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axios.get(
         apiUrl + "api/WorkflowStep/getStep",
          {
            headers: {
              Authorization: `Bearer ` + getToken,
            },
          }
        );
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
        
        const updatedFiles: { [key: string]: FileData[] } = {};

        backendData.forEach((item: any) => {
          if (item.vAttchId !== "") {
            const filesForStep = item.attachment.map((element: any) => ({
              fileName: element?.vFileName || "",
              createDate: element?.dCrea,
              status: element?.vStatus === "1" ? "Active" : "Inactive",
              file: new File([], element?.vFileName || ""),
              vAttchId: item.vAttchId,
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
              setFiles={(newFiles: FileData[]) =>
                handleFileChange(item.vStepId, newFiles)
              }
            />
          </TabPanel>
        ))}
      </Box>
    </ThemeProvider>
  );
};

export default MasterTemplate;
