import { styled } from "@mui/material/styles";
import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  generateMonths,
  generateYears,
  getRole,
  getToken,
} from "../Component/TemplateUrl";
import {
  IConsNewsProps,
  IConsProps,
} from "../Component/Interface/DataTemplate";
import { Download } from "@mui/icons-material";

export default function Recent() {
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
  const [dataNews, setDataNews] = React.useState<IConsNewsProps[]>([]);
  const [recentItem, setRecentItem] = React.useState<number>(4);
  const [openFull, setOpenFull] = React.useState(false);
  const [detailNews, setDetailNews] = React.useState<IConsNewsProps>({
    uUid: "",
    vTitle: "",
    vSubTitle: "",
    vDescription: "",
    vConsolidateCategory: "",
    vAttachment: "",
    dCrea: "",
    vCrea: "",
    bActive: false,
  });

  const handleChangeMonth = (event: SelectChangeEvent) => {
    setMonth(event.target.value as string);
  };

  const handleChangeYear = (event: SelectChangeEvent) => {
    setYear(event.target.value as string);
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
    const encode = btoa(data);

    fetch(apiUrl + "api/Consolidate/DownloadAttachment?vAttachId=" + encode, {
      method: "GET",
      headers: {
        Authorization: `bearer ${getToken}`,
      },
    }).then((resp) => {
      if (resp.status === 200) {
        resp.blob().then((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "File Attachment " + data;
          a.click();
        });
      } else {
        if (resp.status === 404) {
          return alert("file not found.please contact your IT Administrator");
        }
      }
    });
  };

  const handleClickFull = (data: IConsNewsProps) => {
    setOpenFull(true);
    setDetailNews(data);
  };

  function ExpandNews(props: IConsProps) {
    const { open, onClose, data } = props;

    return (
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle sx={{ backgroundColor: "seagreen", color: "white" }}>
          <Typography>Detail News {data.vTitle}</Typography>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          x
        </IconButton>
        <DialogContent dividers>
          <Typography variant="body1" color="black">
            {data.vSubTitle}
          </Typography>
          <br />
          <Typography variant="body2">{data.vDescription}</Typography>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "seagreen", color: "white" }}>
          <IconButton
            id="menu-button"
            onClick={() => {
              handleClickDownload(data.uUid);
            }}
          >
            <Download color="inherit" />{" "}
            <Typography variant="body2" color="inherit">
              Download
            </Typography>
          </IconButton>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <Box>
          {getRole === "C" ? (
            <Item elevation={0}>
              <ButtonAddNews />
            </Item>
          ) : null}
          <Item elevation={0}>
            <Stack direction={"row"}>
              <Item elevation={0}>
                <FormControl sx={{ minWidth: 200 }} size="small">
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
                <FormControl sx={{ minWidth: 200 }} size="small">
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
            <ExpandNews
              open={openFull}
              onClose={() => {
                setOpenFull(false);
              }}
              data={detailNews}
            />

{month !== "" && year !== "" ? (
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
                {dataNews
                  ?.filter(
                    (val) =>
                      parseInt(val.dCrea.split("-")[1]) === parseInt(month) &&
                      parseInt(val.dCrea.split("-")[2]) === parseInt(year) &&
                      val.bActive === true
                  )
                  .map((item, index) => (
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
                          sx={{
                            "& .MuiCardHeader-title": { color: "white" },
                            "& .MuiCardHeader-subheader": { color: "white" },
                            backgroundColor: "seagreen",
                          }}
                          title={item.vTitle}
                          subheader={item.vSubTitle}
                        />
                        <CardActionArea
                          onClick={() => {
                            handleClickFull(item);
                          }}
                        >
                          <CardContent sx={{ minHeight: 100 }}>
                            <Typography
                              variant="body1"
                              color="text.secondary"
                              noWrap
                            >
                              {item.vDescription}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                        <CardActions sx={{ backgroundColor: "seagreen" }}>                          
                          <IconButton
                            id="menu-button"
                            onClick={() => {
                              handleClickDownload(item.uUid);
                            }}
                          >
                            <Download color="inherit" />
                            <Typography variant="body2" color="white">
                              Download
                            </Typography>
                          </IconButton>
                        </CardActions>
                      </Card>
                  ))}
              </Carousel>
            ) : month === "" && year === "" ? (
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
                {dataNews
                  ?.filter((val) => val.bActive === true)
                  .map((item, index) => {
                    return index < recentItem ? (
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
                          sx={{
                            "& .MuiCardHeader-title": { color: "white" },
                            "& .MuiCardHeader-subheader": { color: "white" },
                            backgroundColor: "seagreen",
                          }}
                          title={item.vTitle}
                          subheader={item.vSubTitle}
                        />
                        <CardActionArea
                          onClick={() => {
                            handleClickFull(item);
                          }}
                        >
                          <CardContent sx={{ minHeight: 100 }}>
                            <Typography
                              variant="body1"
                              color="text.secondary"
                              noWrap
                            >
                              {item.vDescription}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                        <CardActions sx={{ backgroundColor: "seagreen" }}>                          
                          <IconButton
                            id="menu-button"
                            onClick={() => {
                              handleClickDownload(item.uUid);
                            }}
                          >
                            <Download color="inherit" />
                            <Typography variant="body2" color="white">
                              Download
                            </Typography>
                          </IconButton>
                        </CardActions>
                      </Card>
                    ) : null;
                  })}
              </Carousel>
            ) : month !== "" ? (
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
                {dataNews
                  ?.filter(
                    (val) =>
                      parseInt(val.dCrea.split("-")[1]) === parseInt(month) &&
                      val.bActive === true
                  )
                  .map((item, index) => (
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
                          sx={{
                            "& .MuiCardHeader-title": { color: "white" },
                            "& .MuiCardHeader-subheader": { color: "white" },
                            backgroundColor: "seagreen",
                          }}
                          title={item.vTitle}
                          subheader={item.vSubTitle}
                        />
                        <CardActionArea
                          onClick={() => {
                            handleClickFull(item);
                          }}
                        >
                          <CardContent sx={{ minHeight: 100 }}>
                            <Typography
                              variant="body1"
                              color="text.secondary"
                              noWrap
                            >
                              {item.vDescription}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                        <CardActions sx={{ backgroundColor: "seagreen" }}>                          
                          <IconButton
                            id="menu-button"
                            onClick={() => {
                              handleClickDownload(item.uUid);
                            }}
                          >
                            <Download color="inherit" />
                            <Typography variant="body2" color="white">
                              Download
                            </Typography>
                          </IconButton>
                        </CardActions>
                      </Card>
                  ))}
              </Carousel>
            ) : year !== "" ? (
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
                {dataNews
                  ?.filter(
                    (val) =>
                      parseInt(val.dCrea.split("-")[2]) === parseInt(year) &&
                      val.bActive === true
                  )
                  .map((item, index) => (
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
                          sx={{
                            "& .MuiCardHeader-title": { color: "white" },
                            "& .MuiCardHeader-subheader": { color: "white" },
                            backgroundColor: "seagreen",
                          }}
                          title={item.vTitle}
                          subheader={item.vSubTitle}
                        />
                        <CardActionArea
                          onClick={() => {
                            handleClickFull(item);
                          }}
                        >
                          <CardContent sx={{ minHeight: 100 }}>
                            <Typography
                              variant="body1"
                              color="text.secondary"
                              noWrap
                            >
                              {item.vDescription}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                        <CardActions sx={{ backgroundColor: "seagreen" }}>                          
                          <IconButton
                            id="menu-button"
                            onClick={() => {
                              handleClickDownload(item.uUid);
                            }}
                          >
                            <Download color="inherit" />
                            <Typography variant="body2" color="white">
                              Download
                            </Typography>
                          </IconButton>
                        </CardActions>
                      </Card>
                  ))}
              </Carousel>
            ) : null}
          </Item>
        </Box>
      </Box>
    </div>
  );
}
