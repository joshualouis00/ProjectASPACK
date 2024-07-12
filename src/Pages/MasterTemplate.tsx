import {
  Box,
  // Card,
  // CardActions,
  // CardContent,
  // CardHeader,
  // Container,
  // Divider,
  Typography,
  Tabs,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import TabContent from "../Component/CustomTabPanel";
import React from "react";
import Tab from "@mui/material/Tab";
import CustomTheme from "../Theme/CustomTheme";

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
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
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
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

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };
  return (
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
      >
        {[...Array(15)].map((x, i) => (
          <Tab label={"Aspack " + (i + 1)} {...a11yProps(i)} />
        ))}
      </Tabs>

      {[...Array(15)].map((x, i) => (
        <TabPanel value={value} index={i} dir={theme.direction}>
         <TabContent label={"Aspack " + (i + 1)} />
        </TabPanel>
      ))}
    </Box>
  );
};

export default MasterTemplate;
