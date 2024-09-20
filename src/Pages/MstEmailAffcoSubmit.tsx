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
import DateTimeFormatted from "../Component/formatDateTime";

const EmailAffcoSubmit: React.FC = () => {
  const [open, setOpen] = React.useState(true);
  const [subject, setSubject] = React.useState("");
  const [body, setBody] = React.useState("");
  const navigate = useNavigate();
  const bulan = new Date();
  const ibulan = bulan.getMonth();
  const namaBulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const handleClose = () => {
    setOpen(false);
    resetDialogFields();
    navigate("/welcome");
  };

  const resetDialogFields = () => {
    setSubject("");
    setBody("");
  };

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
              sx={{ mb: 1, mt: 1, fontSize: 12}}
            />
            <TextField
               fullWidth
               id="outlined-body"
               label="Body"
               multiline
               rows={8}
               value={body}
               onChange={(e) => setBody(e.target.value)}
               sx={{ mb: 1, fontSize: 12}}
            />
            <Typography sx={{ mb: 1, mt: 2, fontSize: 14, fontWeight: "Bold"}}>Placeholder Variable :</Typography>
            <Typography sx={{ mb: 1, fontSize: 12 }}>Company : @Company</Typography>
            <Typography sx={{ mb: 1, fontSize: 12 }}>Month : @Month</Typography>
            <Typography sx={{ mb: 1, fontSize: 12 }}>Year : @Year</Typography>
            <Typography sx={{ mb: 1, fontSize: 12 }}>Link : @Link</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button>Submit</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default EmailAffcoSubmit;
