import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import WelcomePage from "./Welcome";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import { apiUrl, getToken } from "../Component/TemplateUrl";

const EmailUpdateTemplate: React.FC = () => {
  const [open, setOpen] = React.useState(true);
  const [subject, setSubject] = React.useState("");
  const [body, setBody] = React.useState("");
  const [type, setType] = React.useState("NotificationApprove"); // Default type
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
    resetDialogFields();
    navigate("/welcome");
  };

  const resetDialogFields = () => {
    setSubject("");
    setBody("");
  };

  // Function to fetch email template based on type
  const save_EmailApproval = async () => {
    try {
      const encodedBody = btoa(body);
      const response = await axios.post(apiUrl + "api/Setting/EditMail", {
        headers: {
          Authorization: `Bearer ` + getToken,
          Accept: "*/*",
        },
        subject: subject,
        body: encodedBody, 
        type: type,
      });
      // Assuming the API returns subject and body fields
      setSubject(response.data.subject);
      setBody(response.data.body);
    } catch (error) {
      console.error("Error fetching email template:", error);
    }
  };

  React.useEffect(() => {
    save_EmailApproval();
  }, [type]); // Fetch template when the type changes

  return (
    <>
      <WelcomePage />
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1 }
        }}
        noValidate
        autoComplete="off"
      >
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>Manage Email Template</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              id="outlined-subject"
              label="Subject"
              multiline
              rows={1}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              sx={{ mb: 1, mt: 1, fontSize: 12 }}
            />
            <TextField
              fullWidth
              id="outlined-body"
              label="Body"
              multiline
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              sx={{ mb: 1, fontSize: 12 }}
            />
            <Typography sx={{ mb: 1, mt: 2, fontSize: 14, fontWeight: "Bold" }}>
              Placeholder Variable :
            </Typography>
             <Typography sx={{ mb: 1, fontSize: 12 }}>Company : @Company</Typography>
             <Typography sx={{ mb: 1, fontSize: 12 }}>Approved : @Approved</Typography>
             <Typography sx={{ mb: 1, fontSize: 12 }}>Revised : @Revised</Typography>
             <Typography sx={{ mb: 1, fontSize: 12 }}>Month : @Month</Typography>
             <Typography sx={{ mb: 1, fontSize: 12 }}>Year : @Year</Typography>
             <Typography sx={{ mb: 1, fontSize: 12 }}>Link : @Link</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={save_EmailApproval}>Submit</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default EmailUpdateTemplate;
