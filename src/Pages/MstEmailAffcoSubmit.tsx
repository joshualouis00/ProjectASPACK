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
import useHandleUnauthorized from "../Component/handleUnauthorized";

const EmailUpdateTemplate: React.FC = () => {
  const [open, setOpen] = React.useState(true);
  const [subject, setSubject] = React.useState("");
  const [body, setBody] = React.useState("");
  const [type, setType] = React.useState("NotificationSubmit"); // Default type
  const navigate = useNavigate();
  const navigate401 = useHandleUnauthorized();

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
  const fetchEmailTemplate = async () => {
    try {
      const response = await axios.get(apiUrl + "api/Setting/GetMailTemplate", {
        params: { type: type },
        headers: {
          Authorization: `Bearer ` + getToken,
          Accept: "*/*",
        },
      });
      
      setSubject(response.data.data.subject);
      setBody(response.data.data.body); 
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        navigate401();
      } else {
        console.error("Error saving email template:", error);
      }
    }
  };

  const save_EmailAffcoSubmit = async () => {
    try {
      const encodedBody = btoa(body); // Encode body to base64 if necessary
      await axios.post(
        apiUrl + "api/Setting/EditMail",
        {
          subject: subject,
          body: encodedBody,
          type: type,
        },
        {
          headers: {
            Authorization: `Bearer ` + getToken,
            Accept: "*/*",
          },
        }
      );
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        navigate401();
      } else {
        console.error("Error saving email template:", error);
      }
    }
  };

  // Fetch email template when component mounts or type changes
  React.useEffect(() => {
    fetchEmailTemplate();
  }, [type]);

  return (
    <>
      <WelcomePage />
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1 },
        }}
        noValidate
        autoComplete="off"
      >
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>Manage Email Affco Submit Template</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              id="outlined-subject"
              label="Subject"
              multiline
              rows={1}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              sx={{ mb: 1, mt: 1, fontSize: 10 }}
            />
            <TextField
              fullWidth
              id="outlined-body"
              label="Body"
              multiline
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              sx={{ mb: 1, fontSize: 10 }}
            />
            <Typography sx={{ mb: 1, mt: 2, fontSize: 14, fontWeight: "Bold" }}>
              Placeholder Variable :
            </Typography>
            <Typography sx={{ mb: 1, fontSize: 12 }}>
              Company : @Company
            </Typography>
            <Typography sx={{ mb: 1, fontSize: 12 }}>Month : @MONTH</Typography>
            <Typography sx={{ mb: 1, fontSize: 12 }}>Year : @YEAR</Typography>
            <Typography sx={{ mb: 1, fontSize: 12 }}>Link : @LINK</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={save_EmailAffcoSubmit}>Submit</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default EmailUpdateTemplate;
