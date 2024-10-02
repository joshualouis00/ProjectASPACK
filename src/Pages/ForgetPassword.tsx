import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { apiUrl } from "../Component/TemplateUrl";
import { genSaltSync } from "bcrypt-ts";
import { VisibilityOff, Visibility } from "@mui/icons-material";

export let forgetToken: string | null = "";

interface IChangePassProps {
  open: boolean;
  onClose: () => void;
}

export default function ChangePassword() {
  const location = useLocation();
  const param = new URLSearchParams(location.search);

  forgetToken = param.get("token");
  return <Box></Box>;
}

export function ForgetPassword(props: IChangePassProps) {
  const { open, onClose } = props;
  const [newpass, setNewPass] = useState("");
  const [confirmpass, setConfirmPass] = useState("");
  const [showNewPass, setShowNewPass] = useState(false); 
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [haserrornewpass, setHasErrorNewPassword] = useState(false);
  const [haserrorconfirmpass, setHasErrorConfirmPassword] = useState(false);
  const [isEkual, setIsEkual] = useState(true);
  const btnstyle = { margin: "8px 0" };
  const encodeString = btoa(newpass);
  const salt = genSaltSync(8);
  const hasPassword = salt + encodeString;

  const handleChangePassword = async () => {
    if (newpass !== "" && confirmpass !== "") {
      if (newpass === confirmpass) {
        setIsEkual(false);
        setHasErrorNewPassword(false);
        setHasErrorConfirmPassword(false);
        try {
          const resp = await axios.post(
            apiUrl + "api/Auth/ForgotCreatePassword",
            {
              Token: forgetToken,
              NewPassword: hasPassword,
            }
          );

          if (resp.data.succes) {
            alert(resp.data.message);
            window.location.reload()
          } else {
            alert(resp.data.message);
            window.location.reload()
          }
        } catch (error) {
          alert(error);
          window.location.reload()
        }
      } else {
        setIsEkual(false);
        setHasErrorConfirmPassword(true);
      }
    } else {
      if (newpass === "") {
        setHasErrorNewPassword(true);
      }

      if (confirmpass === "") {
        setHasErrorConfirmPassword(true);
        setIsEkual(true);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Form Change Password</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          noValidate
          sx={{
            mt: 0.5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <FormControl fullWidth sx={{mt: 1}}>
            <TextField
              id="newpassword"
              label="New Password"
              name="newpassword"
              type={showNewPass ? "text" : "password"}
              error={haserrornewpass}
              value={newpass}
              onChange={(e) => {
                if (e.target.value !== "") {
                  setHasErrorNewPassword(false);
                  setNewPass(e.target.value);
                } else {
                  setHasErrorNewPassword(true);
                  setNewPass(e.target.value);
                }
              }}
              size="medium"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNewPass(!showNewPass)} // Toggle visibilitas
                      edge="end"
                    >
                      {showNewPass ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {haserrornewpass && (
              <FormHelperText sx={{ color: "red" }}>
                This is required!
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{mt: 1}}>
            <TextField
              error={haserrorconfirmpass}
              name="confirmpassword"
              label="Confirm Password"
              type={showConfirmPass ? "text" : "password"}
              id="confirmpassword"
              value={confirmpass}
              onChange={(e) => {
                if (e.target.value !== "") {
                  setIsEkual(false);
                  setHasErrorConfirmPassword(false);
                  setConfirmPass(e.target.value);
                } else {
                  setIsEkual(true);
                  setHasErrorConfirmPassword(true);
                  setConfirmPass(e.target.value);
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPass(!showConfirmPass)} // Toggle visibilitas
                      edge="end"
                    >
                      {showConfirmPass ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {haserrorconfirmpass && (
              <FormHelperText sx={{ color: "red" }}>
                {isEkual
                  ? "This is required!"
                  : "Confirm password not match with new password!"}
              </FormHelperText>
            )}
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 1, mb: 1 }}
          style={btnstyle}
          size="medium"
          onClick={handleChangePassword}
        >
          Change Password
        </Button>
      </DialogActions>
    </Dialog>
  );
}
