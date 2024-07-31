import { Container, Divider, Typography } from "@mui/material";

const PageContent = (props: {content: JSX.Element, headerTitle: string}) => {
    return(
        <Container maxWidth="xl" sx={{ p: "5px !important" }}>
            <Typography variant="h6">{props.headerTitle}</Typography>
            <Divider sx={{ mt: "2px", mb: "7px" }} />
            {props.content}
        </Container>
    );    
};

export default PageContent;