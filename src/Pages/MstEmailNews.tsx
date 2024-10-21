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
  const [type, setType] = React.useState("ConsolidateNews"); // Default type
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

  const save_EmailNews = async () => {
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

      handleClose();
      alert("Email News Template berhasil diubah!");

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
          <DialogTitle>Manage Email News Template</DialogTitle>
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
              Attachment : @ATTACHMENT
            </Typography>
            <Typography sx={{ mb: 1, fontSize: 12 }}>Banner : @BANNER</Typography>
            <Typography sx={{ mb: 1, fontSize: 12 }}>Title : @TITLE</Typography>
            <Typography sx={{ mb: 1, fontSize: 12 }}>Sub-Title : @SUBTITLE</Typography>
            <Typography sx={{ mb: 1, fontSize: 12 }}>Description : @DESCRIPTION</Typography>
            <Typography sx={{ mb: 1, fontSize: 12 }}>Category : @CATEGORY</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={save_EmailNews}>Submit</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default EmailUpdateTemplate;
