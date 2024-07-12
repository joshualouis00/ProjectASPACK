import {Box, Card, CardMedia } from '@mui/material'
import DashboardImage from '../assets/Home.png'
import React from 'react';
const Dashboard =()=>{
    React.useEffect(() => {
        document.title = "Dashboard"
     }, []);
return(
    <Box>
        <Card>
            <CardMedia
            sx={{objectFit:'cover'}}
                    component="img"
                    alt="Astra Otoparts"
                    height="470"
                    image={DashboardImage}
                />
        </Card>
    </Box>
);
}

export default Dashboard;