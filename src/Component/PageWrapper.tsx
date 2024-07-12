import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Typography,
} from "@mui/material";

const PageWrapper = (props: { content: JSX.Element; title: string; headerTitle:string }) => {
  return (
    <Container maxWidth="xl" sx={{ p: "5px !important" }}>
      <Typography variant="h6">{props.headerTitle}</Typography>
      <Divider sx={{ mt: "2px", mb: "7px" }} />
      <Card>
        <CardHeader
          title={props.title}
          sx={{
            height: "47px",
          }}
          titleTypographyProps={{ style: { fontSize: "0.8rem" } }}
        />
        <Divider />
        <CardContent sx={{ pl: "2px", pr: "2px" }}>{props.content}</CardContent>
        <CardActions disableSpacing></CardActions>
      </Card>
    </Container>
  );
};

export default PageWrapper;
