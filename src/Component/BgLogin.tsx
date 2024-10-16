import React from "react";
import { Container, Typography } from "@mui/material";
import styled from "styled-components";
import BackGroundLogin from "../assets/BgLogin.png";

const BgBot = styled.div`
  background-image: url(${BackGroundLogin});
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

const LoginPage: React.FC = () => {
  return (
    <>
      <Container
        maxWidth="lg"
        sx={{ pl: "2px !important", pr: "2px !important" }}
      >
        <BgBot />
      </Container>
    </>
  );
};

export default LoginPage;
