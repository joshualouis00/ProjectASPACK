import { styled } from "@mui/material/styles";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import React from "react";
import ButtonAddNews from "../Component/ButtonAddNews";
import {
  apiUrl,
  getRole,
  getToken,
  generateYears,
  generateMonths,
  generateCategory,
} from "../Component/TemplateUrl";
import { IConsNewsProps } from "../Component/Interface/DataTemplate";
import { Download } from "@mui/icons-material";
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
  const [category, setCategory] = React.useState("ALL");
  const [dataNews, setDataNews] = React.useState<IConsNewsProps[]>([]);

  const handleChangeMonth = (event: SelectChangeEvent) => {
    setMonth(event.target.value as string);
  };

  const handleChangeYear = (event: SelectChangeEvent) => {
    setYear(event.target.value as string);
  };

  const handleChangeCategory = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
  };

  React.useEffect(() => {
    fetch(apiUrl + "api/Consolidate/GetConsolidateNews", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken}`,
      },
    }).then((resp) => {
      resp.json().then((news) => {
        setDataNews(
          news.data.map((val) => {
            return {
              uUid: val.uUid,
              vTitle: val.vTitle,
              vDescription: val.vDescription,
              vSubTitle: val.vSubTitle,
              vAttachment: val.vAttachment,
              vConsolidateCategory: val.vConsolidateCategory,
              dCrea: val.dCrea,
              vCrea: val.vCrea,
              bActive: val.bActive,
            };
          })
        );
      });
    });
  }, []);

  const handleClickDownload = (data: string) => {
    const encode = btoa(data)

    fetch(apiUrl + "api/Consolidate/DownloadAttachment?vAttachId=" + encode,
      {
        method: "GET",
        headers: {
          Authorization: `bearer ${getToken}`,
        },
      }
    ).then((resp) =>{
      if (resp.status === 200) {
        resp.blob().then((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "File Attachment " + data;
          a.click();
        });
      } else {
        if(resp.status === 404){
          return alert("file not found.please contact your IT Administrator")
        }
      }
    })

  }
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
                <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
                  <InputLabel id="category">Select Category</InputLabel>
                  <Select
                    labelId="category"
                    name="vCategory"
                    defaultValue={category}
                    value={category}
                    label="Select Category"
                    onChange={handleChangeCategory}
                  >
                    <MenuItem value="ALL">All</MenuItem>
                    {generateCategory.map((val, index) => {
                      return (
                        <MenuItem key={index} value={val.id}>
                          {val.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Item>
              <Item elevation={0}>
                <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
                  <InputLabel id="year">Select Periode Year</InputLabel>
                  <Select
                    labelId="year"
                    name="vYear"
                    value={year}
                    label="Select Periode Year"
                    onChange={handleChangeYear}
                  >
                    <MenuItem value="">Select Periode Year</MenuItem>
                    {generateYears().map((val, index) => {
                      return (
                        <MenuItem key={index} value={val}>
                          {val}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Item>
              <Item elevation={0}>
                <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
                  <InputLabel id="month">Select Periode Month</InputLabel>
                  <Select
                    labelId="month"
                    name="vMonth"
                    value={month}
                    label="Select Periode Month"
                    onChange={handleChangeMonth}
                  >
                    <MenuItem value="">Select Periode Month</MenuItem>
                    {generateMonths.map((val) => {
                      return (
                        <MenuItem key={val.id} value={val.id}>
                          {val.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Item>
            </Stack>
          </Item>
          <Item elevation={0}>
            {category === "ALL" && year === "" && month === "" ? (
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
                {dataNews?.map((item, index) => (
                  <Card
                    sx={{
                      maxWidth: 300,
                      maxHeight: 300,
                      marginBottom: 5,
                      borderRadius: 3,
                      marginTop: 1,
                      marginLeft: 1,
                      marginRight: 1,
                    }}
                    key={index}
                  >
                    <CardHeader
                      title={item.vTitle}
                      subheader={item.vSubTitle}
                      action={
                        <>
                          <IconButton
                            id="menu-button"                          
                            onClick={() => {handleClickDownload(item.uUid)}}
                          >
                            <Download />
                          </IconButton>
                          
                        </>
                      }
                    />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        {item.vDescription}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Carousel>
            ) : category === "ALL" && year !== "" && month !== "" ? (
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
                {dataNews?.filter((val) => (parseInt(val.dCrea.split("-")[2]) === parseInt(year) && parseInt(val.dCrea.split("-")[1]) === parseInt(month))).map((item, index) => (
                  <Card
                    sx={{
                      maxWidth: 300,
                      maxHeight: 300,
                      marginBottom: 5,
                      borderRadius: 3,
                      marginTop: 1,
                      marginLeft: 1,
                      marginRight: 1,
                    }}
                    key={index}
                  >
                    <CardHeader
                      title={item.vTitle}
                      subheader={item.vSubTitle}
                      action={
                        <>
                          <IconButton
                            id="menu-button"                          
                            onClick={() => {handleClickDownload(item.uUid)}}
                          >
                            <Download />
                          </IconButton>
                          
                        </>
                      }
                    />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        {item.vDescription}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Carousel>
            ) : category === "ALL" && year !== "" && month === "" ? (
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
                {dataNews?.filter((val) => (parseInt(val.dCrea.split("-")[2]) === parseInt(year))).map((item, index) => (
                  <Card
                    sx={{
                      maxWidth: 300,
                      maxHeight: 300,
                      marginBottom: 5,
                      borderRadius: 3,
                      marginTop: 1,
                      marginLeft: 1,
                      marginRight: 1,
                    }}
                    key={index}
                  >
                    <CardHeader
                      title={item.vTitle}
                      subheader={item.vSubTitle}
                      action={
                        <>
                          <IconButton
                            id="menu-button"                          
                            onClick={() => {handleClickDownload(item.uUid)}}
                          >
                            <Download />
                          </IconButton>
                          
                        </>
                      }
                    />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        {item.vDescription}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Carousel>
            ) : category === "ALL" && year === "" && month !== "" ? (
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
                {dataNews?.filter((val) => (parseInt(val.dCrea.split("-")[1]) === parseInt(month))).map((item, index) => (
                  <Card
                    sx={{
                      maxWidth: 300,
                      maxHeight: 300,
                      marginBottom: 5,
                      borderRadius: 3,
                      marginTop: 1,
                      marginLeft: 1,
                      marginRight: 1,
                    }}
                    key={index}
                  >
                    <CardHeader
                      title={item.vTitle}
                      subheader={item.vSubTitle}
                      action={
                        <>
                          <IconButton
                            id="menu-button"                          
                            onClick={() => {handleClickDownload(item.uUid)}}
                          >
                            <Download />
                          </IconButton>
                          
                        </>
                      }
                    />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        {item.vDescription}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Carousel>
            ) : category !== "ALL" && year === "" && month === "" ? (
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
                {dataNews?.filter((val) => (val.vConsolidateCategory === category)).map((item, index) => (
                  <Card
                    sx={{
                      maxWidth: 300,
                      maxHeight: 300,
                      marginBottom: 5,
                      borderRadius: 3,
                      marginTop: 1,
                      marginLeft: 1,
                      marginRight: 1,
                    }}
                    key={index}
                  >
                    <CardHeader
                      title={item.vTitle}
                      subheader={item.vSubTitle}
                      action={
                        <>
                          <IconButton
                            id="menu-button"                          
                            onClick={() => {handleClickDownload(item.uUid)}}
                          >
                            <Download />
                          </IconButton>
                          
                        </>
                      }
                    />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        {item.vDescription}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Carousel>
            ) : category !== "ALL" && year !== "" && month !== "" ? (
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
                {dataNews?.filter((val) => (val.vConsolidateCategory === category && parseInt(val.dCrea.split("-")[2]) === parseInt(year) && parseInt(val.dCrea.split("-")[1]) === parseInt(month))).map((item, index) => (
                  <Card
                    sx={{
                      maxWidth: 300,
                      maxHeight: 300,
                      marginBottom: 5,
                      borderRadius: 3,
                      marginTop: 1,
                      marginLeft: 1,
                      marginRight: 1,
                    }}
                    key={index}
                  >
                    <CardHeader
                      title={item.vTitle}
                      subheader={item.vSubTitle}
                      action={
                        <>
                          <IconButton
                            id="menu-button"                          
                            onClick={() => {handleClickDownload(item.uUid)}}
                          >
                            <Download />
                          </IconButton>
                          
                        </>
                      }
                    />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        {item.vDescription}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Carousel>
            ) : category !== "ALL" && year !== "" && month === "" ? (
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
                {dataNews?.filter((val) => (val.vConsolidateCategory === category && parseInt(val.dCrea.split("-")[2]) === parseInt(year))).map((item, index) => (
                  <Card
                    sx={{
                      maxWidth: 300,
                      maxHeight: 300,
                      marginBottom: 5,
                      borderRadius: 3,
                      marginTop: 1,
                      marginLeft: 1,
                      marginRight: 1,
                    }}
                    key={index}
                  >
                    <CardHeader
                      title={item.vTitle}
                      subheader={item.vSubTitle}
                      action={
                        <>
                          <IconButton
                            id="menu-button"                          
                            onClick={() => {handleClickDownload(item.uUid)}}
                          >
                            <Download />
                          </IconButton>
                          
                        </>
                      }
                    />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        {item.vDescription}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Carousel>
            ) : category !== "ALL" && year === "" && month !== "" ? (
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
                {dataNews?.filter((val) => (val.vConsolidateCategory === category && parseInt(val.dCrea.split("-")[1]) === parseInt(month))).map((item, index) => (
                  <Card
                    sx={{
                      maxWidth: 300,
                      maxHeight: 300,
                      marginBottom: 5,
                      borderRadius: 3,
                      marginTop: 1,
                      marginLeft: 1,
                      marginRight: 1,
                    }}
                    key={index}
                  >
                    <CardHeader
                      title={item.vTitle}
                      subheader={item.vSubTitle}
                      action={
                        <>
                          <IconButton
                            id="menu-button"                          
                            onClick={() => {handleClickDownload(item.uUid)}}
                          >
                            <Download />
                          </IconButton>
                          
                        </>
                      }
                    />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        {item.vDescription}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Carousel>
            ) : null}
          </Item>
        </Stack>
      </Box>
    </div>
  );
}
