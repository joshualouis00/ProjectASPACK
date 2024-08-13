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
import { MaterialReactTable, MRT_ColumnDef } from "material-react-table";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface AddUserProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
  data: DataAffco[];
}

interface AddAffcoProps {
  open: boolean;
  onClose: () => void;
}

interface DataUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface DataAffco {
  no: number;
  id: string;
  name: string;
  category: string;
  status: string;
}

function AddAffcoDialog(props: AddAffcoProps) {
  const { open, onClose } = props;
  const [catAffco, setCatAffco] = React.useState("");
  const [statusAffco, setStatusAffco] = React.useState("active");
  const [affcoID, setAffcoID] = React.useState("");
  const [affcoName, setAffcoName] = React.useState("");

  const handleChangeAffcoId = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      fetch("http://192.168.1.207:9020/api/Master/addAffco", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${token}`,
          Accept: "*/*",
        },
        body: JSON.stringify({
          vAffcoId: affcoID,
          vAffcoName: affcoName,
          vAffcoType: catAffco,
          bActive: statusAffco === "active" ? true : false,
        }),
      }).then((resp) => {
        if (resp.ok) {
          alert("Affco Added Successfully");
          window.location.reload();
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
      <DialogContent dividers>
        <Box
          sx={{ display: "flex", flexDirection: "column", alignItems: "left" }}
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
            <InputLabel id="categoryAffco">
              Category Affiliate Company
            </InputLabel>
            <Select
              labelId="categoryAffco"
              name="catAffco"
              value={catAffco}
              label="Category Affco"
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
function AddUserDialog(props: AddUserProps) {
  const { onClose, selectedValue, open, data } = props;
  const [value, setValue] = React.useState("nonldap");
  const [userId, setUserId] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [userLdap, setUserldap] = React.useState("")
  const [role, setRole] = React.useState("");
  const [affcom, setAffcom] = React.useState<DataAffco[]>([]);
  const [affco, setAffco] = React.useState("");
  const [status, setStatus] = React.useState("active");

  const submitAddUser = () => {
    const vUserId = userId;
    const vUserName = username;
    const vEmail = email;
    const vRole = role;
    const vAffcoid = data.filter((id) => id.name === affco);
    const vAffcoId = role === "CONS" ? "CO" : vAffcoid[0].id;
    const vPicAff = affcom.map((val) => {
      return val.id
    })
    const vPicAffco = vPicAff.toString();
    const nUserLdap = value === "nonldap" ? false : true;
    const vLdap = userLdap; 
    
    fetch("http://192.168.1.207:9020/api/Auth/register",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },
        body: JSON.stringify({
          "vUserId" : vUserId,
          "vUserName" : vUserName,
          "vEmail": vEmail,
          "vRole": vRole,
          "vAffcoId": vAffcoId,
          "vPicAffco": vPicAffco,
          "vLdap": vLdap,
          "nUserLdap": nUserLdap

        })      
    }).then((resp) => {
      if (resp.ok) {
        alert("User Added Successfully");
        window.location.reload();
      }
    })
  };

  const handleClose = () => {
    onClose(selectedValue);
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
  }

  const handleChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  }

  const handleChangeUserLdap = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserldap(event.target.value);
  }

  const handleChageEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  }



  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const affcomData: DataAffco[] = [...data];

  return (
    <Dialog onClose={handleClose} open={open} fullWidth={true}>
      <DialogTitle>Create User</DialogTitle>
      <DialogContent>
        <Box
          sx={{ display: "flex", flexDirection: "column", alignItems: "left" }}
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
              <FormControlLabel value="ldap" control={<Radio />} label="LDAP" />
              <FormControlLabel
                value="nonldap"
                control={<Radio />}
                label="Non LDAP"
              />
            </RadioGroup>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <TextField
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
              <MenuItem value="CONS">Console</MenuItem>
              <MenuItem value="AFFCO">Affco</MenuItem>
            </Select>
          </FormControl>
          {role !== "" ? (
            <Stack direction={"column"}>
              <Item elevation={0} hidden={role === "AFFCO" ? false : true}>
                {" "}
                <FormControl fullWidth >
                  <Autocomplete
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
              <Item elevation={0} hidden={role === "CONS" ? false : true}>
                <FormControl fullWidth >
                  <Autocomplete
                   size="small"
                    multiple
                    value={affcom}
                    disableCloseOnSelect
                    onChange={(event, newValue) => {
                      setAffcom([
                        ...affcom,
                        ...newValue.filter(
                          (option) => affcom.indexOf(option) === -1
                        ),
                      ]);
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

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const token = localStorage.getItem("token");

console.log(" tokennya : ", token);
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
  const [openAffco, setOpenAffco] = React.useState(false);
  const [data, setData] = React.useState<DataUser[]>([]);
  const [dataAffco, setDataAffco] = React.useState<DataAffco[]>([]);

  React.useEffect(() => {
    fetch("http://192.168.1.207:9020/api/Master/getUser", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((resp) => {
      resp.json().then((valData) => {
        setData(
          valData.map((val, index) => {
            return {
              id: val.vuserid,
              name: val.vusername,
              email: val.vemail,
              role: val.vrole,
              status: val.bactive === true ? "Active" : "Nonactive",
            };
          })
        );
      });
    });
    fetch("http://192.168.1.207:9020/api/Master/getAffco", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((resp) => {
      resp.json().then((valData) => {
        setDataAffco(
          valData.map((val, index) => {
            return {
              no: index + 1,
              id: val.vaffcoid,
              name: val.vaffconame,
              category: val.vaffcoctgry,
              status: val.bactive === true ? "Active" : "Nonactive",
            };
          })
        );
      });
    });
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

  const handleClose = (value: string) => {
    setOpen(false);
  };
  const test: DataUser[] = [...data];

  const testAffco: DataAffco[] = [...dataAffco];

  const columnAffco: MRT_ColumnDef<(typeof testAffco)[0]>[] = [
    {
      accessorKey: "no",
      header: "No",
    },
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Affco Name",
    },
    {
      accessorKey: "category",
      header: "Affco Category",
    },
    {
      accessorKey: "status",
      header: "Affco Status",
    },
  ];

  const columnUser: MRT_ColumnDef<(typeof test)[0]>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
  ];

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
        <CustomTabPanel value={value} index={0}>
          <Box>
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
              </Item>
              <Item elevation={0}>
                <MaterialReactTable
                  columns={columnUser}
                  data={test}
                  enableRowSelection
                />
              </Item>
            </Stack>
          </Box>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
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
            </Item>
            <Item elevation={0}>
              <MaterialReactTable
                columns={columnAffco}
                data={testAffco}
                enableRowSelection
              />
            </Item>
          </Stack>
        </CustomTabPanel>
      </Box>
    </div>
  );
}
