import { ArrowBack, Create, Person } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import * as React from "react";
import { styled } from "@mui/material/styles";
import { MaterialReactTable } from "material-react-table";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import IDataAffco, {
  IAddAffcoProps,
  IAffcoProps,
} from "../Component/Interface/DataAffco";
import IDataUser, {
  IAddUserProps,
  IUserProps,
} from "../Component/Interface/DataUser";
import { CustomTabs, a11yProps } from "../Component/CustomTab";
import {
  columnMasterUser,
  columnMasterAffco,
} from "../Component/TableComponent/ColumnDef/IColumnMaster";
import { apiUrl, getToken } from "../Component/TemplateUrl";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "left",
  color: theme.palette.text.secondary,
}));
export default function MstUserAffco() {
  const [value, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openAffco, setOpenAffco] = React.useState(false);
  const [openEditAffco, setOpenEditAffco] = React.useState(false);
  const [dataUser, setDataUser] = React.useState<IDataUser[]>([]);
  const [dataAffco, setDataAffco] = React.useState<IDataAffco[]>([]);
  const [user, setUser] = React.useState<IDataUser>({
    id: "",
    name: "",
    role: "",
    status: "",
    email: "",
    ldapLogin: false,
    vLdap: "",
    affcoId: "",
    vPicAffco: "",
  });
  const [affco, setAffco] = React.useState<IDataAffco>({
    no: 100,
    id: "",
    name: "",
    category: "",
    status: "",
  });
  const [message, setMessage] = React.useState("");
  const [openSnack, setOpenSnack] = React.useState(false);
  const [error, setError] = React.useState(false);

  function AddUserDialog(props: IAddUserProps) {
    const { onClose, selectedValue, open, data } = props;
    const [value, setValue] = React.useState("nonldap");
    const [userId, setUserId] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [userLdap, setUserldap] = React.useState("");
    const [role, setRole] = React.useState("");
    const [affcom, setAffcom] = React.useState<IDataAffco[]>([]);
    const [affco, setAffco] = React.useState("");
    const [status, setStatus] = React.useState("active");

    const submitAddUser = () => {
      const vUserId = userId;
      const vUserName = username;
      const vEmail = email;
      const vRole = role;
      let vAffcoid = "";
      if (role === "A") {
        const id = data.filter((v) => v.name === affco);
        vAffcoid = id[0].id;
      }
      const vAffcoId = role === "C" ? "CO" : vAffcoid;
      const vPicAff = affcom.map((val) => {
        return val.id;
      });
      const vPicAffco = vPicAff.toString();
      const nUserLdap = value === "nonldap" ? false : true;
      const vLdap = userLdap;

      fetch(apiUrl + "api/Auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${getToken}`,
        },
        body: JSON.stringify({
          vUserId: vUserId,
          vUserName: vUserName,
          vEmail: vEmail,
          vRole: vRole,
          vAffcoId: vAffcoId,
          vPicAffco: vPicAffco,
          vLdap: vLdap,
          nUserLdap: nUserLdap,
        }),
      }).then((resp) => {
        if (resp.ok) {
          fetchUser();
          setMessage("Add User Success.");
          setOpenSnack(true);
          setError(false);
          onClose();
        } else {
          fetchUser();
          setMessage("Add User Failed.");
          setOpenSnack(true);
          setError(true);
          onClose();
        }
      });
    };

    const handleClose = () => {
      onClose();
    };

    const handleChangeMode = (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue((event.target as HTMLInputElement).value);
    };

    const handleChangeRole = (event: SelectChangeEvent) => {
      setRole(event.target.value as string);
    };

    const handleChangeStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
      setStatus((event.target as HTMLInputElement).value);
    };

    const handleChangeUserId = (event: React.ChangeEvent<HTMLInputElement>) => {
      setUserId(event.target.value);
    };

    const handleChangeUsername = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      setUsername(event.target.value);
    };

    const handleChangeUserLdap = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      setUserldap(event.target.value);
    };

    const handleChageEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(event.target.value);
    };

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    const affcomData: IDataAffco[] = [...data];

    return (
      <Dialog onClose={handleClose} open={open} fullWidth={true}>
        <DialogTitle>Create User</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "left",
            }}
          >
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <TextField
                size="small"
                aria-labelledby="userid"
                label="User ID"
                name="userID"
                value={userId}
                onChange={handleChangeUserId}
              />
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <FormLabel id="loginmode">Login Mode</FormLabel>
              <RadioGroup
                row
                aria-labelledby="loginmode"
                name="loginMode"
                value={value}
                onChange={handleChangeMode}
              >
                <FormControlLabel
                  value="ldap"
                  control={<Radio />}
                  label="LDAP"
                />
                <FormControlLabel
                  value="nonldap"
                  control={<Radio />}
                  label="Non LDAP"
                />
              </RadioGroup>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <TextField
                disabled={value === "ldap" ? false : true}
                size="small"
                aria-labelledby="ldaplogin"
                label="LDAP Login"
                name="ldapLogin"
                value={userLdap}
                onChange={handleChangeUserLdap}
              />
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <TextField
                size="small"
                aria-labelledby="nameuser"
                label="Name"
                name="nameUser"
                value={username}
                onChange={handleChangeUsername}
              />
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <TextField
                size="small"
                aria-labelledby="emailuser"
                label="Email"
                name="emailUser"
                value={email}
                onChange={handleChageEmail}
              />
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel id="roleuser">Role</InputLabel>
              <Select
                labelId="roleuser"
                name="roleUser"
                value={role}
                label="Role"
                onChange={handleChangeRole}
              >
                <MenuItem value="C">Console</MenuItem>
                <MenuItem value="A">Affco</MenuItem>
              </Select>
            </FormControl>
            {role !== "" ? (
              <Stack direction={"column"}>
                <Item elevation={0} hidden={role === "A" ? false : true}>
                  <FormControl fullWidth>
                    <Autocomplete
                      id="affco-autocomplete"
                      size="small"
                      disablePortal
                      isOptionEqualToValue={(option, value) => true}
                      inputValue={affco}
                      onInputChange={(event, newValue) => {
                        setAffco(newValue);
                      }}
                      options={affcomData}
                      getOptionLabel={(option) => option.name}
                      renderOption={(props, option) => {
                        const { key, ...optionProps } = props;
                        return (
                          <Box key={key} component="li" {...optionProps}>
                            {option.name}
                          </Box>
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Affiliate Company"
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: "new-password", // disable autocomplete and autofill
                          }}
                        />
                      )}
                    />
                  </FormControl>
                </Item>
                <Item elevation={0} hidden={role === "C" ? false : true}>
                  <FormControl fullWidth>
                    <Autocomplete
                      id="cons-autocomplete"
                      size="small"
                      multiple
                      value={affcom}
                      disableCloseOnSelect
                      onChange={(event, newValue) => {
                        setAffcom(newValue);
                      }}
                      disablePortal
                      options={affcomData}
                      getOptionLabel={(option) => option.name}
                      renderOption={(props, option, { selected }) => {
                        const { key, ...optionProps } = props;
                        return (
                          <Box key={key} component="li" {...optionProps}>
                            <Checkbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              style={{ marginRight: 8 }}
                              checked={selected}
                            />
                            {option.name}
                          </Box>
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="PIC of Affiliate Company"
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: "new-password", // disable autocomplete and autofill
                          }}
                        />
                      )}
                    />
                  </FormControl>
                </Item>
              </Stack>
            ) : null}
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <FormLabel id="statususer">Status User</FormLabel>
              <RadioGroup
                row
                aria-labelledby="statususer"
                name="statusUser"
                value={status}
                onChange={handleChangeStatus}
              >
                <FormControlLabel
                  value="active"
                  control={<Radio />}
                  label="Active"
                />
                <FormControlLabel
                  value="nonactive"
                  control={<Radio />}
                  label="Non Active"
                />
              </RadioGroup>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            color="success"
            variant="contained"
            startIcon={<Create />}
            type="submit"
            onClick={submitAddUser}
          >
            Create
          </Button>
          <Button
            onClick={handleClose}
            color="inherit"
            variant="contained"
            startIcon={<ArrowBack />}
          >
            Back
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  function EditUserDialog(props: IUserProps) {
    const { open, onClose, data, affco } = props;
    const [username, setUsername] = React.useState("");
    const [status, setStatus] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [ldapLogin, setLdapLogin] = React.useState(false);
    const [ldapName, setLdapName] = React.useState("");
    const [affcom, setAffcom] = React.useState<IDataAffco[]>([]);
    const [vAffco, setVAffco] = React.useState("");
    const [affcoData, setAffcoData] = React.useState<IDataAffco>({
      no: 1,
      id: "AAIJ",
      name: "PT Akebono Brake Astra Indonesia",
      category: "SUBS",
      status: "Active",
    });
    const [role, setRole] = React.useState("");

    React.useEffect(() => {
      setUsername(data.name);
      setStatus(data.status);
      setEmail(data.email);
      setLdapLogin(data.ldapLogin);
      setLdapName(data.vLdap);
      setRole(data.role === "Console" ? "C" : "A");
      const picAffco =
        data.vPicAffco.length > 0 ? data.vPicAffco.split(",") : [];

      if (picAffco.length > 0) {
        setAffcom([]);

        for (var arr in picAffco) {
          affco
            .filter((v) => v.id === picAffco[arr])
            .map((val) => setAffcom((prev) => [...prev, val]));
        }
      } else {
        setAffcom([]);
        if (data.affcoId !== "") {
          const dataX = affco.filter((v) => v.id === data.affcoId);

          setAffcoData(dataX[0]);
          setVAffco(dataX[0].name);
        }
      }
    }, [data, affco]);

    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    const affcomData: IDataAffco[] = [...affco];

    const submitEditUser = () => {
      const vUserId = data.id;
      const vUserName = username;
      const vEmail = email;
      const vRole = role;
      const vAffcoid = affco.filter((id) => id.name === vAffco);
      const vAffcoId = role === "C" ? "CO" : vAffcoid[0].id;
      const vPicAff = affcom.map((val) => {
        return val.id;
      });
      const vPicAffco = vPicAff.toString();
      const nUserLdap = ldapLogin;
      const vLdap = ldapName;
      const bActive = status === "Active" ? true : false;

      fetch(apiUrl + "api/Master/editUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${getToken}`,
        },
        body: JSON.stringify({
          vUserId: vUserId,
          vUserName: vUserName,
          vEmail: vEmail,
          vRole: vRole,
          vAffcoId: vAffcoId,
          vPicAffco: vPicAffco,
          vLdap: vLdap,
          nUserLdap: nUserLdap,
          bActive: bActive,
        }),
      }).then((resp) => {
        if (resp.ok) {
          fetchUser();
          setMessage("Edit Data Success.");
          setError(false);
          setOpenSnack(true);
          onClose();
        } else {
          fetchUser();
          setMessage("Edit Data Failed.");
          setError(true);
          setOpenSnack(true);
          onClose();
        }
      });
    };

    return (
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "left",
            }}
          >
            <FormControl sx={{ m: 1 }} fullWidth>
              <TextField
                value={data.id}
                disabled
                label="User ID"
                size="small"
              />
            </FormControl>
            <FormControl sx={{ m: 1 }} fullWidth>
              <FormLabel>Login Mode</FormLabel>
              <RadioGroup
                row
                aria-labelledby="loginmode"
                name="loginMode"
                value={ldapLogin}
                onChange={(val) => {
                  setLdapLogin(val.target.value === "true" ? true : false);
                }}
              >
                <FormControlLabel
                  value={"true"}
                  control={<Radio />}
                  label="LDAP"
                />
                <FormControlLabel
                  value={"false"}
                  control={<Radio />}
                  label="Non LDAP"
                />
              </RadioGroup>
            </FormControl>
            <FormControl sx={{ m: 1 }} fullWidth>
              <TextField
                disabled={ldapLogin ? false : true}
                value={ldapName}
                onChange={(val) => {
                  setLdapName(val.target.value);
                }}
                size="small"
                label="LDAP Login"
              />
            </FormControl>
            <FormControl sx={{ m: 1 }} fullWidth>
              <TextField
                value={username}
                label="Name"
                onChange={(val) => {
                  setUsername(val.target.value);
                }}
                size="small"
              />
            </FormControl>
            <FormControl sx={{ m: 1 }} fullWidth>
              <TextField
                value={email}
                label="Email"
                onChange={(val) => {
                  setEmail(val.target.value);
                }}
                size="small"
              />
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel>Role</InputLabel>
              <Select disabled value={role} label="Role">
                <MenuItem value="C">Console</MenuItem>
                <MenuItem value="A">Affco</MenuItem>
              </Select>
            </FormControl>
            <Stack direction={"column"}>
              <Item elevation={0} hidden={role === "A" ? false : true}>
                <FormControl fullWidth>
                  <Autocomplete
                    id="affco-autocomplete"
                    size="small"
                    disablePortal
                    isOptionEqualToValue={(option, value) => true}
                    value={affcoData}
                    inputValue={vAffco}
                    onInputChange={(event, newValue) => {
                      setVAffco(newValue);
                    }}
                    options={affcomData}
                    getOptionLabel={(option) => option.name}
                    renderOption={(props, option) => {
                      const { key, ...optionProps } = props;
                      return (
                        <Box key={key} component="li" {...optionProps}>
                          {option.name}
                        </Box>
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Affiliate Company"
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: "new-password", // disable autocomplete and autofill
                        }}
                      />
                    )}
                  />
                </FormControl>
              </Item>
              <Item elevation={0} hidden={role === "C" ? false : true}>
                <FormControl fullWidth>
                  <Autocomplete
                    id="cons-autocomplete"
                    size="small"
                    multiple
                    value={affcom}
                    disableCloseOnSelect
                    onChange={(event, newValue) => {
                      setAffcom(newValue);
                    }}
                    disablePortal
                    options={affcomData}
                    getOptionLabel={(option) => option.name}
                    renderOption={(props, option, { selected }) => {
                      const { key, ...optionProps } = props;
                      return (
                        <Box key={key} component="li" {...optionProps}>
                          <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          {option.name}
                        </Box>
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="PIC of Affiliate Company"
                        inputProps={{
                          ...params.inputProps,
                          autoComplete: "new-password", // disable autocomplete and autofill
                        }}
                      />
                    )}
                  />
                </FormControl>
              </Item>
            </Stack>
            <FormControl size="small" sx={{ m: 1 }} fullWidth>
              <FormLabel>Status User</FormLabel>
              <RadioGroup
                row
                value={status}
                onChange={(val) => {
                  setStatus(val.target.value);
                }}
              >
                <FormControlLabel
                  value="Active"
                  control={<Radio />}
                  label="Active"
                />
                <FormControlLabel
                  value="Nonactive"
                  control={<Radio />}
                  label="Non Active"
                />
              </RadioGroup>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Box>
            <Button
              variant="contained"
              size="small"
              color="primary"
              sx={{ m: 1 }}
              onClick={submitEditUser}
            >
              Edit
            </Button>
            <Button
              onClick={onClose}
              variant="contained"
              size="small"
              color="inherit"
              sx={{ m: 1 }}
            >
              Cancel
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    );
  }
  function AddAffcoDialog(props: IAddAffcoProps) {
    const { open, onClose } = props;
    const [catAffco, setCatAffco] = React.useState("");
    const [statusAffco, setStatusAffco] = React.useState("active");
    const [affcoID, setAffcoID] = React.useState("");
    const [affcoName, setAffcoName] = React.useState("");

    const handleChangeAffcoId = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      setAffcoID(event.target.value);
    };

    const handleChangeAffcoName = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      setAffcoName(event.target.value);
    };

    const handleChangeCatAffco = (event: SelectChangeEvent) => {
      setCatAffco(event.target.value as string);
    };

    const handleChangeStatusAffco = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      setStatusAffco(event.target.value);
    };

    const submitAddAffco = () => {
      if (affcoID !== "" && affcoName !== "" && catAffco !== "") {
        fetch(apiUrl + "api/Master/addAffco", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${getToken}`,
            Accept: "*/*",
          },
          body: JSON.stringify({
            vAffcoId: affcoID,
            vAffcoName: affcoName,
            vAffcoType: catAffco,
            bActive: statusAffco === "Active" ? true : false,
          }),
        }).then((resp) => {
          if (resp.ok) {
            fetchAffco();
            setMessage("Affco Added Successfully.");
            setError(false);
            setOpenSnack(true);
            onClose();
          } else {
            fetchAffco();
            setMessage("Affco Added Failed.");
            setError(true);
            setOpenSnack(true);
            onClose();
          }
        });
      }
    };

    const handleClose = () => {
      onClose();
    };

    return (
      <Dialog onClose={onClose} open={open} fullWidth>
        <DialogTitle>Create Affco</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "left",
            }}
          >
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <TextField
                size="small"
                label="Affco ID"
                name="affcoID"
                value={affcoID}
                onChange={handleChangeAffcoId}
              />
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <TextField
                size="small"
                label="Affco Name"
                name="affcoName"
                value={affcoName}
                onChange={handleChangeAffcoName}
              />
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel >
                Category Affiliate Company
              </InputLabel>
              <Select
                size="small"                
                name="catAffco"
                value={catAffco}
                label="Category Affiliate Company"
                onChange={handleChangeCatAffco}
              >
                <MenuItem value="ASSO JV">ASSO JV</MenuItem>
                <MenuItem value="SUBS">SUBS</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <FormLabel id="statusAffco">Status Affiliate Company</FormLabel>
              <RadioGroup
                row
                aria-labelledby="statusAffco"
                name="statusAffco"
                value={statusAffco}
                onChange={handleChangeStatusAffco}
              >
                <FormControlLabel
                  value="Active"
                  control={<Radio />}
                  label="Active"
                />
                <FormControlLabel
                  value="Nonactive"
                  control={<Radio />}
                  label="Non Active"
                />
              </RadioGroup>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            color="success"
            variant="contained"
            startIcon={<Create />}
            onClick={submitAddAffco}
          >
            Create
          </Button>
          <Button
            onClick={handleClose}
            color="inherit"
            variant="contained"
            startIcon={<ArrowBack />}
          >
            Back
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  function EditAffcoDialog(props: IAffcoProps) {
    const { open, onClose, data } = props;
    const [catAffco, setCatAffco] = React.useState("");
    const [statusAffco, setStatusAffco] = React.useState("");
    const [affcoID, setAffcoID] = React.useState("");
    const [affcoName, setAffcoName] = React.useState("");

    React.useEffect(() => {
      setCatAffco(data.category)
      setStatusAffco(data.status)
      setAffcoID(data.id)
      setAffcoName(data.name)
    },[data])

    const submitEditAffco = () => {

      fetch(apiUrl + "api/Master/editAffco", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${getToken}`,
          Accept: "*/*",
        },
        body: JSON.stringify({
          vAffcoId: affcoID,
          vAffcoName: affcoName,
          vAffcoType: catAffco,
          bActive: statusAffco === "Active" ? true : false,
        }),
      }).then((resp) => {
        if (resp.ok) {
          fetchAffco();
          setMessage("Affco Edited Successfully.");
          setError(false);
          setOpenSnack(true);
          onClose();
        } else {
          fetchAffco();
          setMessage("Affco Edited Failed.");
          setError(true);
          setOpenSnack(true);
          onClose();
        }
      })

    }

    return (
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>Edit Affco</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "left",
            }}
          >
            <FormControl sx={{ m: 1}} >
              <TextField
                fullWidth
                disabled
                size="small"
                label="Affco ID"
                value={affcoID}
              />
            </FormControl>
            <FormControl sx={{ m: 1 }}>
              <TextField
                fullWidth
                size="small"
                label="Affco Name"
                value={affcoName}
                onChange={(val) => {
                  setAffcoName(val.target.value);
                }}
              />
            </FormControl>
            <FormControl sx={{ m: 1}}>
            <InputLabel >
                Category Affiliate Company
              </InputLabel>
              <Select size="small" disabled value={catAffco} label="Category Affiliate Company" fullWidth>
                <MenuItem value="ASSO JV">ASSO JV</MenuItem>
                <MenuItem value="SUBS">SUBS</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <FormLabel>Status Affiliate Company</FormLabel>
              <RadioGroup
                row
                value={statusAffco}
                onChange={(val) => {
                  setStatusAffco(val.target.value);
                }}
              >
                <FormControlLabel
                  value="Active"
                  control={<Radio />}
                  label="Active"
                />
                <FormControlLabel
                  value="Nonactive"
                  control={<Radio />}
                  label="Non Active"
                />
              </RadioGroup>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            color="success"
            variant="contained"
            startIcon={<Create />}
            onClick={submitEditAffco}
          >
            Edit
          </Button>
          <Button
            onClick={onClose}
            color="inherit"
            variant="contained"
            startIcon={<ArrowBack />}
          >
            Back
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  const fetchUser = () => {
    fetch(apiUrl + "api/Master/getUser", {
      headers: {
        Authorization: `Bearer ${getToken}`,
      },
    }).then((resp) => {
      resp.json().then((valData) => {
        setDataUser(
          valData.map((val, index) => {
            return {
              id: val.vUserId,
              name: val.vUserName,
              email: val.vEmail,
              role: val.vRole === "C" ? "Console" : "Affco",
              status: val.bActive === true ? "Active" : "Nonactive",
              ldapLogin: val.nUserLdap,
              affcoId: val.vAffcoId,
              vLdap: val.vLdap,
              vPicAffco: val.vPicAffco,
            };
          })
        );
      });
    });
  };
  const fetchAffco = () => {
    fetch(apiUrl + "api/Master/getAffco", {
      headers: {
        Authorization: `Bearer ${getToken}`,
      },
    }).then((resp) => {
      resp.json().then((valData) => {
        setDataAffco(
          valData.map((val, index) => {
            return {
              no: index + 1,
              id: val.vAffcoId,
              name: val.vAffcoName,
              category: val.vAffcoCtgry,
              status: val.bActive === true ? "Active" : "Nonactive",
            };
          })
        );
      });
    });
  };

  React.useEffect(() => {
    fetchUser();
    fetchAffco();
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleOpenAffco = () => {
    setOpenAffco(true);
  };

  const handleCloseAffco = () => {
    setOpenAffco(false);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const test: IDataUser[] = [...dataUser];

  const testAffco: IDataAffco[] = [...dataAffco];

  const handleClickEditUser = (data: IDataUser) => {
    setOpenEdit(true);
    setUser(data);
  };

  const handleClickEditAffco = (data: IDataAffco) => {
    setOpenEditAffco(true);
    setAffco(data);
  };

  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Master User" {...a11yProps(0)} />
            <Tab label="Master Affco" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabs value={value} index={0}>
          <Box>
            {message && (
              <Snackbar
                open={openSnack}
                onClose={() => {
                  setOpenSnack(false);
                }}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                autoHideDuration={5000}
              >
                <Alert
                  severity={error ? "error" : "success"}
                  sx={{ width: "100%" }}
                >
                  {message}
                </Alert>
              </Snackbar>
            )}
            <Stack direction={"column"}>
              <Item elevation={0}>
                <Button
                  variant="contained"
                  startIcon={<Person />}
                  color="primary"
                  onClick={handleClickOpen}
                >
                  Add User
                </Button>
                <AddUserDialog
                  selectedValue="test"
                  open={open}
                  onClose={handleClose}
                  data={testAffco}
                ></AddUserDialog>
                <EditUserDialog
                  open={openEdit}
                  onClose={() => {
                    setOpenEdit(false);
                  }}
                  data={user}
                  affco={dataAffco}
                />
              </Item>
              <Item elevation={0}>
                <MaterialReactTable
                  columns={columnMasterUser}
                  data={test}
                  enableRowActions
                  positionActionsColumn="last"
                  renderRowActions={({ row }) => {
                    const index = row.original.id;
                    const editUser = dataUser.filter((v) => v.id === index);
                    return (
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => {
                          handleClickEditUser(editUser[0]);
                        }}
                      >
                        Edit
                      </Button>
                    );
                  }}
                />
              </Item>
            </Stack>
          </Box>
        </CustomTabs>
        <CustomTabs value={value} index={1}>
        {message && (
              <Snackbar
                open={openSnack}
                onClose={() => {
                  setOpenSnack(false);
                }}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                autoHideDuration={5000}
              >
                <Alert
                  severity={error ? "error" : "success"}
                  sx={{ width: "100%" }}
                >
                  {message}
                </Alert>
              </Snackbar>
            )}
          <Stack direction={"column"}>
            <Item elevation={0}>
              <Button
                variant="contained"
                startIcon={<Person />}
                color="primary"
                onClick={handleOpenAffco}
              >
                Add Affco
              </Button>
              <AddAffcoDialog open={openAffco} onClose={handleCloseAffco} />
              <EditAffcoDialog
                open={openEditAffco}
                onClose={() => {
                  setOpenEditAffco(false);
                }}
                data={affco}
              />
            </Item>
            <Item elevation={0}>
              <MaterialReactTable
                columns={columnMasterAffco}
                data={testAffco}
                enableRowActions
                positionActionsColumn="last"
                renderRowActions={({ row }) => {
                  const index = row.original.id;
                  const editAffco = dataAffco.filter((v) => v.id === index);
                  return (
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => {
                        handleClickEditAffco(editAffco[0]);
                      }}
                    >
                      Edit
                    </Button>
                  );
                }}
              />
            </Item>
          </Stack>
        </CustomTabs>
      </Box>
    </div>
  );
}
