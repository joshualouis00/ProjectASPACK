import React, { useState } from "react";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import LayersIcon from "@mui/icons-material/Layers";
import { useNavigate } from "react-router-dom";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import DatasetIcon from "@mui/icons-material/Dataset";
import { getRole } from "./TemplateUrl";
import { MenuItemsProps } from "./Interface/MenuItemsProps";

const MenuItems = (props: MenuItemsProps) => {
  const [openMaster, setOpenMaster] = useState(false);
  const [openApproval, setOpenApproval] = useState(false);
  const [openLibrary, setOpenLibrary] = useState(false);
  const [aspackAffco, setAspackAffco] = useState(false);
  const [libraryAffco, setLibraryAffco] = useState(false);
  const [openUserWorkflow, setUserWorkflow] = useState(false);
  const [openEmail, setEmail] = useState(false);
  const navigate = useNavigate();

  const handleEmail = () => {
    setEmail(!openEmail);
  }

  const handleOpenMaster = () => {
    setOpenMaster(!openMaster);
  };

  const handleOpenApproval = () => {
    setOpenApproval(!openApproval);
  };

  const handleOpenLibrary = () => {
    setOpenLibrary(!openLibrary);
  };
  const handleOpenAspackAffco = () => {
    setAspackAffco(!aspackAffco);
  };

  const handleOpenLibraryAffco = () => {
    setLibraryAffco(!libraryAffco);
  };

  const handleUserWorkflow = () => {
    setUserWorkflow(!openUserWorkflow);
  };

  React.useEffect(() => {
    if (!props.DrawerStatus) {
      setOpenMaster(false);
      setOpenApproval(false);
      setOpenLibrary(false);
      setAspackAffco(false);
      setLibraryAffco(false);
      setUserWorkflow(false);
    }
  }, [props.DrawerStatus]);

  return (
    <List component="nav" sx={{ color: "white" }}>
      {/* Aspack Template */}
      {getRole === "C" && (
        <>
          <ListItemButton onClick={handleOpenMaster}>
            <ListItemIcon>
              <DatasetIcon color="inherit" />
            </ListItemIcon>
            <ListItemText primary="Aspack Template" />
            {openMaster ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openMaster} timeout="auto" unmountOnExit>
            <List component="div" disablePadding className="subMenus">
              <ListItemButton
                onClick={() => {
                  navigate("/MstTemplate");
                }}
                sx={{ bgcolor: "#223c49", color: "white", ml: "10px" }}
              >
                <ListItemIcon>
                  <FolderOpenOutlinedIcon color="inherit" sx={{mb: "5px"}}/>
                </ListItemIcon>
                <ListItemText primary="Master Template" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Aspack Approval */}
          <ListItemButton onClick={handleOpenApproval} >
            <ListItemIcon>
              <DatasetIcon color="inherit" sx={{mb: "5px"}}/>
            </ListItemIcon>
            <ListItemText primary="Aspack Approval" />
            {openApproval ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openApproval} timeout="auto" unmountOnExit>
            <List component="div" disablePadding className="subMenus">
              <ListItemButton
                onClick={() => {
                  navigate("/Approval");
                }}
                sx={{ bgcolor: "#223c49", color: "white", ml: "10px" }}
              >
                <ListItemIcon>
                  <FolderOpenOutlinedIcon color="inherit" sx={{mb: "5px"}}/>
                </ListItemIcon>
                <ListItemText primary="Aspack Approval" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Aspack Approval */}
          <ListItemButton onClick={handleOpenLibrary} >
            <ListItemIcon>
              <DatasetIcon color="inherit" sx={{mb: "5px"}}/>
            </ListItemIcon>
            <ListItemText primary="Consolidation Library" />
            {openLibrary ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openLibrary} timeout="auto" unmountOnExit>
            <List component="div" disablePadding className="subMenus">
              <ListItemButton
                onClick={() => {
                  navigate("/Archived");
                }}
                sx={{ bgcolor: "#223c49", color: "white", ml: "10px" }}
              >
                <ListItemIcon>
                  <FolderOpenOutlinedIcon color="inherit" sx={{mb: "5px"}}/>
                </ListItemIcon>
                <ListItemText primary="Archived News" />
              </ListItemButton>
              <ListItemButton
                onClick={() => {
                  navigate("/Recent");
                }}
                sx={{ bgcolor: "#223c49", color: "white", ml: "10px" }}
              >
                <ListItemIcon>
                  <FolderOpenOutlinedIcon color="inherit" sx={{mb: "10px"}} />
                </ListItemIcon>
                <ListItemText primary="Recent News" />
              </ListItemButton>
              <ListItemButton
                onClick={() => {
                  navigate("/Kategori");
                }}
                sx={{ bgcolor: "#223c49", color: "white", ml: "10px" }}
              >
                <ListItemIcon>
                  <FolderOpenOutlinedIcon color="inherit" sx={{mb: "5px"}}/>
                </ListItemIcon>
                <ListItemText primary="Category News" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Master User & Workflow */}
          <ListItemButton onClick={handleUserWorkflow} >
            <ListItemIcon>
              <DatasetIcon color="inherit" sx={{mb: "5px"}}/>
            </ListItemIcon>
            <ListItemText primary="Master User & Workflow" />
            {openUserWorkflow ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openUserWorkflow} timeout="auto" unmountOnExit>
            <List component="div" disablePadding className="subMenus">
              <ListItemButton
                onClick={() => {
                  navigate("/MstUserAffco");
                }}
                sx={{ bgcolor: "#223c49", color: "white", ml: "10px" }}
              >
                <ListItemIcon>
                  <FolderOpenOutlinedIcon color="inherit" sx={{mb: "5px"}}/>
                </ListItemIcon>
                <ListItemText primary="Master User & Affco" />
              </ListItemButton>
              <ListItemButton
                onClick={() => {
                  navigate("/MasterWorkflow");
                }}
                sx={{ bgcolor: "#223c49", color: "white", ml: "10px" }}
              >
                <ListItemIcon>
                  <FolderOpenOutlinedIcon color="inherit" sx={{mb: "5px"}}/>
                </ListItemIcon>
                <ListItemText primary="Master Workflow" />
              </ListItemButton>
            </List>
          </Collapse>

          <ListItemButton
            onClick={() => {
              navigate("/hisUploadAffco");
            }}
          >
            <ListItemIcon>
              <LayersIcon color="inherit" sx={{mb: "5px"}}/>
            </ListItemIcon>
            <ListItemText primary="History Upload AFFCO" />
          </ListItemButton>

          <ListItemButton
            onClick={() => {
              navigate("/oPeriode");
            }}
          >
            <ListItemIcon>
              <LayersIcon color="inherit" sx={{mb: "5px"}}/>
            </ListItemIcon>
            <ListItemText primary="Open Period Settings" />
          </ListItemButton>

          {/* Manage Email Template */}
          <ListItemButton onClick={handleEmail} >
            <ListItemIcon>
              <DatasetIcon color="inherit" sx={{mb: "5px"}}/>
            </ListItemIcon>
            <ListItemText primary="Manage Email Template" />
            {openEmail ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openEmail} timeout="auto" unmountOnExit>
            <List component="div" disablePadding className="subMenus">
              <ListItemButton
                onClick={() => {
                  navigate("/emailUpdateTemp");
                }}
                sx={{ bgcolor: "#223c49", color: "white", ml: "10px" }}
              >
                <ListItemIcon>
                  <FolderOpenOutlinedIcon color="inherit" sx={{mb: "5px"}}/>
                </ListItemIcon>
                <ListItemText primary="Update Aspack Template" />
              </ListItemButton>
              <ListItemButton
                onClick={() => {
                  navigate("/emailApproval");
                }}
                sx={{ bgcolor: "#223c49", color: "white", ml: "10px" }}
              >
                <ListItemIcon>
                  <FolderOpenOutlinedIcon color="inherit" sx={{mb: "5px"}}/>
                </ListItemIcon>
                <ListItemText primary="Approval Aspack" />
              </ListItemButton>
              <ListItemButton
                onClick={() => {
                  navigate("/emailAffcoSubmit");
                }}
                sx={{ bgcolor: "#223c49", color: "white", ml: "10px" }}
              >
                <ListItemIcon>
                  <FolderOpenOutlinedIcon color="inherit" sx={{mb: "5px"}}/>
                </ListItemIcon>
                <ListItemText primary="Affco Submit" />
              </ListItemButton>
            </List>
          </Collapse>
        </>
      )}

      {/* User Affco Aspack */}
      {getRole === "A" && (
        <>
          <ListItemButton onClick={handleOpenAspackAffco} >
            <ListItemIcon>
              <DatasetIcon color="inherit" sx={{mb: "5px"}}/>
            </ListItemIcon>
            <ListItemText primary="Aspack" />
            {aspackAffco ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={aspackAffco} timeout="auto" unmountOnExit>
            <List component="div" disablePadding className="subMenus">
              <ListItemButton
                onClick={() => {
                  navigate("/AffcoUpload");
                }}
                sx={{ bgcolor: "#223c49", color: "white", ml: "10px" }}
              >
                <ListItemIcon>
                  <FolderOpenOutlinedIcon color="inherit" sx={{mb: "5px"}}/>
                </ListItemIcon>
                <ListItemText primary="Aspack Upload Form" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* User Affco Aspack - Library */}
          <ListItemButton onClick={handleOpenLibraryAffco} >
            <ListItemIcon>
              <DatasetIcon color="inherit" sx={{mb: "5px"}}/>
            </ListItemIcon>
            <ListItemText primary="Library" />
            {libraryAffco ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={libraryAffco} timeout="auto" unmountOnExit>
            <List component="div" disablePadding className="subMenus">
              <ListItemButton
                onClick={() => {
                  navigate("/Recent");
                }}
                sx={{ bgcolor: "#223c49", color: "white", ml: "10px" }}
              >
                <ListItemIcon>
                  <FolderOpenOutlinedIcon color="inherit" sx={{mb: "5px"}}/>
                </ListItemIcon>
                <ListItemText primary="Recent News" />
              </ListItemButton>
              <ListItemButton
                onClick={() => {
                  navigate("/Kategori");
                }}
                sx={{ bgcolor: "#223c49", color: "white", ml: "10px" }}
              >
                <ListItemIcon>
                  <FolderOpenOutlinedIcon color="inherit" sx={{mb: "5px"}}/>
                </ListItemIcon>
                <ListItemText primary="Category News" />
              </ListItemButton>
            </List>
          </Collapse>
        </>
      )}
    </List>
  );
};

export default MenuItems;
