import React from "react";
import { Container, Typography } from "@mui/material";
import styled from "styled-components";
import WelcomeBawah from "../assets/Home.png";

const BgBot = styled.div`
background-image: url(${WelcomeBawah});
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 90vh;
  position: relative;
  top: 0;
  left: 0;
  opacity: 0.5;

  /* Media queries untuk resolusi layar yang berbeda */
  @media (max-width: 1920px) {
    height: 96vh;
  }

  @media (max-width: 1366px) {
    height: 86vh;
  }

  @media (max-width: 1024px) {
    height: 76vh;
  }

  @media (max-width: 768px) {
    height: 66vh;
  }
`;

const WelcomePage: React.FC = () => {
  return (
    <>
      <Container
        maxWidth="lg"
        sx={{ pl: "0px !important", pr: "0px !important" }}
      >
        <Typography sx={{fontSize: "18px"}} >
          Welcome, Consol Team! We are glad to have you here. Let's make
          something amazing together.
        </Typography>
        <BgBot />
      </Container>
    </> 
  );
};

export default WelcomePage;
