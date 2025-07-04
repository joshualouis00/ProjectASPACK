import { styled } from "@mui/material/styles";
import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
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
  getRole,
  getToken,
  generateYears,
  generateMonths,
} from "../Component/TemplateUrl";
import {
  ICategory,
  IConsNewsProps,
  IConsProps,
} from "../Component/Interface/DataTemplate";
import { Download } from "@mui/icons-material";
import useHandleUnauthorized from "../Component/handleUnauthorized";
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
  const [dataCategory, setDataCategory] = React.useState<ICategory[]>([]);
  const navigate = useHandleUnauthorized();
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
    dLastSend: "",
    category: "",
    vImage: "",
  });

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
    const fetchAll = async () => {
      try {
        const categoryResp = await fetch(
          apiUrl + "api/Setting/GetSettingValue?types=CATEGORY",
          {
            method: "GET",
            headers: { Authorization: `bearer ${getToken}` },
          }
        );
        const categoryData = await categoryResp.json();
        const categories = categoryData.data.map((val) => ({
          vCode: val.vCode,
          vType: val.vType,
          vValue1: val.vValue1,
          vValue2: val.vValue2,
          bActive: val.bActive,
        }));

        setDataCategory(categories);

        const newsResp = await fetch(
          apiUrl + "api/Consolidate/GetConsolidateNews",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${getToken}` },
          }
        );
        const newsData = await newsResp.json();
        const mappedNews = newsData.data.map((val) => {
          const matchedCategory = categories.find(
            (cat) =>
              cat.vCode === val.vConsolidateCategory &&
              cat.bActive === val.bActive
          );
          return {
            uUid: val.uUid,
            vTitle: val.vTitle,
            vDescription: val.vDescription,
            vSubTitle: val.vSubTitle,
            vAttachment: val.vAttachment,
            vConsolidateCategory: val.vConsolidateCategory,
            dCrea: val.dCrea,
            vCrea: val.vCrea,
            bActive: matchedCategory ? matchedCategory.bActive : false,
            dLastSend: val.dLastSend,
            category: val.vConsolidateCategoryName,
            vImage: val.vImage,
          };
        });

        setDataNews(mappedNews);
      } catch (error) {
        navigate();
      }
    };
    fetchAll();
  }, []);

  const handleClickDownload = (data: string) => {
    const encode = btoa(data);

    window.open(
      apiUrl + "api/Consolidate/DownloadAttachment?vAttachId=" + encode
    );
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
                    //defaultValue={category}
                    value={category}
                    label="Select Category"
                    onChange={handleChangeCategory}
                  >
                    <MenuItem value="ALL">All</MenuItem>
                    {dataCategory
                      .filter((x) => x.bActive === true)
                      .map((val, index) => {
                        return (
                          <MenuItem key={index} value={val.vCode}>
                            {val.vValue1}
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
                    {generateMonths
                      .filter((val) => val.id !== 13)
                      .map((val) => {
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
                ?.filter((val) => {
                  if (category === "ALL" && year === "" && month === "") {
                    return val.bActive === true;
                  }
                  if (category === "ALL" && year !== "" && month !== "") {
                    return (
                      parseInt(val.dCrea.split("-")[2]) === parseInt(year) &&
                      parseInt(val.dCrea.split("-")[1]) === parseInt(month) &&
                      val.bActive === true
                    );
                  }
                  if (category === "ALL" && year !== "" && month === "") {
                    return (
                      parseInt(val.dCrea.split("-")[2]) === parseInt(year) &&
                      val.bActive === true
                    );
                  }
                  if (category === "ALL" && year === "" && month !== "") {
                    return (
                      parseInt(val.dCrea.split("-")[1]) === parseInt(month) &&
                      val.bActive === true
                    );
                  }
                  if (category !== "ALL" && year === "" && month === "") {
                    return (
                      val.vConsolidateCategory === category &&
                      val.bActive === true
                    );
                  }
                  if (category !== "ALL" && year !== "" && month !== "") {
                    return (
                      val.vConsolidateCategory === category &&
                      parseInt(val.dCrea.split("-")[2]) === parseInt(year) &&
                      parseInt(val.dCrea.split("-")[1]) === parseInt(month) &&
                      val.bActive === true
                    );
                  }
                  if (category !== "ALL" && year !== "" && month === "") {
                    return (
                      val.vConsolidateCategory === category &&
                      parseInt(val.dCrea.split("-")[2]) === parseInt(year) &&
                      val.bActive === true
                    );
                  }
                  if (category !== "ALL" && year === "" && month !== "") {
                    return (
                      val.vConsolidateCategory === category &&
                      parseInt(val.dCrea.split("-")[1]) === parseInt(month) &&
                      val.bActive === true
                    );
                  }
                })
                .map((item, index) => (
                  <Card
                    sx={{
                      maxWidth: 300,
                      maxHeight: 500,
                      marginBottom: 5,
                      borderRadius: 3,
                      marginTop: 1,
                      marginRight: 2,
                    }}
                    key={index}
                  >
                    <CardMedia
                      sx={{
                        maxWidth: 300,
                        height: 150,
                      }}
                      component={"img"}
                      src={item.vImage}
                    />
                    <CardHeader
                      sx={{
                        "& .MuiCardHeader-title": { color: "white" },
                        "& .MuiCardHeader-subheader": { color: "white" },
                        backgroundColor: "seagreen",
                      }}
                      title={
                        item.vTitle.length < 20
                          ? item.vTitle
                          : item.vTitle.substring(0, 15) + "..."
                      }
                      subheader={
                        item.vSubTitle.length <= 25
                          ? item.vSubTitle
                          : item.vSubTitle.substring(0, 20) + "..."
                      }
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
          </Item>
        </Stack>
      </Box>
    </div>
  );
}
