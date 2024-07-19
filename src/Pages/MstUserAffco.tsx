import { WidthFull } from "@mui/icons-material";
import { Box, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Tab, Tabs, Typography } from "@mui/material";
import { SelectChangeEvent } from '@mui/material/Select';
import * as React from 'react';
import { styled } from '@mui/material/styles';
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

  function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }
  
  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  export default function MstUserAffco() {
    const [value, setValue] = React.useState(0);
    const [age, setAge] = React.useState('');

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'left',
        color: theme.palette.text.secondary,
        
      }));
      

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
   
  };

  const handleChangeAge = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };
  return (
    <div>
      <Box sx={{ width: '100%'}}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Master User" {...a11yProps(0)} />
          <Tab label="Master Affco" {...a11yProps(1)} />          
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        Item One
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1} >
      <Stack direction={"row"} justifyContent="center"
  alignItems="center">
        <Item elevation={0}>
            <Typography>Nama</Typography>            
        </Item>
        <Item elevation={0}>
            <FormControl sx={{ m: 1, minWidth: 300 }}>
            <InputLabel id="demo-simple-select-label">Age</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    value={age}
    label="Age"
    onChange={handleChangeAge}

    
  >
    <MenuItem value={10}>Ten</MenuItem>
    <MenuItem value={20}>Twenty</MenuItem>
    <MenuItem value={30}>Thirty</MenuItem>
  </Select>
            </FormControl>
        </Item>
      </Stack>
      
      </CustomTabPanel>      
      </Box>
    </div>
  );
}
