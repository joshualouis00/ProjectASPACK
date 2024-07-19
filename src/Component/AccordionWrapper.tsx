import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Container,
    Divider,
    Typography,
  } from "@mui/material";
  import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
  
  const AcordionWrapper = (props: { content: JSX.Element; headerTitle:string }) => {
    return (
      <Container maxWidth="xl" sx={{ p: "5px !important" }}>
        <Typography variant="h6">{props.headerTitle}</Typography>
        <Divider sx={{ mt: "2px", mb: "7px" }} />
        
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header">
            { props.headerTitle }
            </AccordionSummary>
            <AccordionDetails >
                {props.content}
            </AccordionDetails>
        </Accordion>
      </Container>
    );
  };
  
  export default AcordionWrapper ;
  