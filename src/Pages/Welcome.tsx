// src/components/WelcomePage.tsx

import React, {useEffect} from "react";
import { Container, Typography } from "@mui/material";
import styled from "styled-components";
import WelcomeBawah from "../assets/Home.png";

const BgBot = styled.div`
  background-image: url(${WelcomeBawah});
  background-size: cover;
  background-position: center; /* Menjaga gambar tetap berada di tengah */
  width: 100%;
  height: 112vh; 
  position: relative;
  top: 1;
  bottom: 0; 
  left: 0;
  opacity: 0.5; 
`;

const WelcomePage: React.FC = () => {
  return (
    <>
      <Container
        maxWidth="lg"
        sx={{ pl: "2px !important", pr: "2px !important" }}
      >
        <Typography sx={{mb:"10px", fontSize: "18px"}} >
          Welcome, Console Team! We are glad to have you here. Let's make
          something amazing together.
        </Typography>
        <BgBot />
      </Container>
    </>
  );
};

export default WelcomePage;
