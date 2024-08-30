import { styled } from "@mui/material/styles";
import {
  Box,  
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import React from "react";
import ButtonAddNews from "../Component/ButtonAddNews";
import { getRole } from "../Component/TemplateUrl";
export default function Kategori() {
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "left",
    color: theme.palette.text.secondary,
  }));

  const [month, setMonth] = React.useState("");
  const [year, setYear] = React.useState("");
  const [category, setCategory] = React.useState("");

  const handleChangeMonth = (event: SelectChangeEvent) => {
    setMonth(event.target.value as string);
  };

  const handleChangeYear = (event: SelectChangeEvent) => {
    setYear(event.target.value as string);
  };

  const handleChangeCategory = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
  };
  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <Stack direction={"column"}>
        {getRole === "C" ? (
            <Item elevation={0}>
              <ButtonAddNews />
            </Item>
          ) : null}
          <Item elevation={0}>
            <Stack direction={"row"}>
              <Item elevation={0}>
                <FormControl sx={{ m: 1, minWidth: 200 }}>
                  <InputLabel id="category">Select Category</InputLabel>
                  <Select
                    labelId="category"
                    name="vCategory"
                    value={category}
                    label="Select Category"
                    onChange={handleChangeCategory}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="kategori1">Kategori 1</MenuItem>
                    <MenuItem value="kategori2">Kategori 2</MenuItem>
                  </Select>
                </FormControl>
              </Item>
              <Item elevation={0}>
                <FormControl sx={{ m: 1, minWidth: 200 }}>
                  <InputLabel id="month">Select Periode Month</InputLabel>
                  <Select
                    labelId="month"
                    name="vMonth"
                    value={month}
                    label="Select Periode Month"
                    onChange={handleChangeMonth}
                  >
                    <MenuItem value="januari">Januari</MenuItem>
                    <MenuItem value="februari">Februari</MenuItem>
                  </Select>
                </FormControl>
              </Item>
              {month !== "" ? (
                <Item elevation={0}>
                  <FormControl sx={{ m: 1, minWidth: 200 }}>
                    <InputLabel id="year">Select Periode Year</InputLabel>
                    <Select
                      labelId="year"
                      name="vYear"
                      value={year}
                      label="year"
                      onChange={handleChangeYear}
                    >
                      <MenuItem value="2024">2024</MenuItem>
                      <MenuItem value="2023">2023</MenuItem>
                    </Select>
                  </FormControl>
                </Item>
              ) : null}
            </Stack>
          </Item>
          <Item elevation={0}>
            <Carousel
              swipeable={true}
              draggable={true}
              showDots={true}
              responsive={responsive}
              ssr={true} // means to render carousel on server-side.
              infinite={true}
              autoPlay={true}
              autoPlaySpeed={2000}
              keyBoardControl={true}
              customTransition="all .5"
              transitionDuration={500}
              containerClass="carousel-container"
              removeArrowOnDeviceType={["tablet", "mobile"]}
              dotListClass="custom-dot-list-style"
              itemClass="carousel-item-padding-40-px"
            >
              { category !== "" ? Array.from({ length: 3 }).map((item, index) => (
                <div
                  style={{
                    background: "yellow",
                    width: 250,
                    height: 250,
                    border: "10px solid white",
                    textAlign: "center",
                    lineHeight: "240px",
                    boxSizing: "border-box",
                  }}
                  key={index}
                >
                  {index}
                </div>
              )): Array.from({ length: 10 }).map((item, index) => (
                <div
                  style={{
                    background: "yellow",
                    width: 250,
                    height: 250,
                    border: "5px solid white",                                        
                    boxSizing: "border-box",
                  }}
                  key={index}
                >
                  <p style={{ textAlign:"center"}}>
                    Title {index}                     
                  </p>
                  
                  <p style={{ textAlign:"center"}}>Subtitle</p>
                  
                  <p style={{ textAlign:"justify", paddingLeft:15, paddingRight:15}}>lorem ipsum dolor is amet, lorem ipsum dolor is ametlorem ipsum dolor is ametlorem ipsum dolor is ametlorem ipsum dolor is ametlorem ipsum dolor is amet</p>
                </div>
              ))}
            </Carousel>
          </Item>
        </Stack>
      </Box>
    </div>
  );
}
