import React from "react";
import { CardMedia, Container } from "@mui/material";
import WelcomeBawah from "../assets/Home.png";

const WelcomePage: React.FC = () => {
  return (
    <>
      <Container
        maxWidth="lg"
        sx={{ pl: "0px !important", pr: "0px !important" }}
      >
          <CardMedia
            sx={{
              objectFit: "contain",
              aspectRatio: "16 / 9",
              height: "100%",
              width: "100%",
              position: "relative",
              maxHeight: "90vh",
            }}
            component="img"
            alt="Astra Otoparts"
            image={WelcomeBawah}
          />
      </Container>
    </>
  );
};

export default WelcomePage;
