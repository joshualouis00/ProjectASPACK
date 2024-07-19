import React, { useState } from "react";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import LayersIcon from "@mui/icons-material/Layers";
import { useNavigate } from "react-router-dom";
import {
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import DatasetIcon from "@mui/icons-material/Dataset";
export interface MenuItemsProps {
  DrawerStatus: boolean;
}

const MenuItems = (props: MenuItemsProps) => {
  const [openMaster, setOpenMaster] = useState(false);
  const [openApproval, setOpenApproval] = useState(false);
  const [openLibrary, setOpenLibrary] = useState(false);
  const [openUserWorkflow, setUserWorkflow] = useState(false);
  const navigate = useNavigate();

  const handleOpenMaster = () => {
    setOpenMaster(!openMaster);
  };

  const handleOpenApproval = () => {
    setOpenApproval(!openApproval);
  };

  const handleOpenLibrary = () => {
    setOpenLibrary(!openLibrary);
  };

  const handleUserWorkflow = () => {
    setUserWorkflow(!openUserWorkflow);
  };

  React.useEffect(() => {
    if (!props.DrawerStatus) {
      setOpenMaster(false);
      setOpenApproval(false);
      setOpenApproval(false);
    }
  }, [props.DrawerStatus]);


  return (
    <List component="nav" sx={{ color: "white" }}>
      {/* Aspack Template */}
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
              navigate("/Dashboard");
            }}
            sx={{ bgcolor: '#223c49', color: 'white' }}
          >
            <ListItemIcon>
              <FolderOpenOutlinedIcon color="inherit" />
            </ListItemIcon>
            <ListItemText primary="Master Template" />
          </ListItemButton>
        </List>
      </Collapse>

      {/* Aspack Approval */}
      <ListItemButton onClick={handleOpenApproval}>
        <ListItemIcon>
          <DatasetIcon color="inherit" />
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
            sx={{ bgcolor: '#223c49', color: 'white' }}
          >
            <ListItemIcon>
              <FolderOpenOutlinedIcon color="inherit" />
            </ListItemIcon>
            <ListItemText primary="Aspack Approval" />
          </ListItemButton>
        </List>
      </Collapse>

      {/* Aspack Approval */}
      <ListItemButton onClick={handleOpenLibrary}>
        <ListItemIcon>
          <DatasetIcon color="inherit" />
        </ListItemIcon>
        <ListItemText primary="Consolidation Library" />
        {openLibrary ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openLibrary} timeout="auto" unmountOnExit>
        <List component="div" disablePadding className="subMenus">

          {/* Archived News */}
          <ListItemButton
            onClick={() => {
              navigate("/Archived");
            }}
            sx={{ bgcolor: '#223c49', color: 'white' }}
          >
            <ListItemIcon>
              <FolderOpenOutlinedIcon color="inherit" />
            </ListItemIcon>
            <ListItemText primary="Archived News" />
          </ListItemButton>

          {/* Recent News */}
          <ListItemButton
            onClick={() => {
              navigate("/Recent");
            }}
            sx={{ bgcolor: '#223c49', color: 'white' }}
          >
            <ListItemIcon>
              <FolderOpenOutlinedIcon color="inherit" />
            </ListItemIcon>
            <ListItemText primary="Recent News" />
          </ListItemButton>

          {/* Kategori News */}
          <ListItemButton
            onClick={() => {
              navigate("/Kategori");
            }}
            sx={{ bgcolor: '#223c49', color: 'white' }}
          >
            <ListItemIcon>
              <FolderOpenOutlinedIcon color="inherit" />
            </ListItemIcon>
            <ListItemText primary="Kategori News" />
          </ListItemButton>
        </List>
      </Collapse>


      {/* Master User & Workflow */}
      <ListItemButton onClick={handleUserWorkflow}>
        <ListItemIcon>
          <DatasetIcon color="inherit" />
        </ListItemIcon>
        <ListItemText primary="Master User & Workflow" />
        {openUserWorkflow ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={openUserWorkflow} timeout="auto" unmountOnExit>
        <List component="div" disablePadding className="subMenus">

          {/* Master User & Workflow */}
          <ListItemButton
            onClick={() => {
              navigate("/MstUserAffco");
            }}
            sx={{ bgcolor: '#223c49', color: 'white' }}
          >
            <ListItemIcon>
              <FolderOpenOutlinedIcon color="inherit" />
            </ListItemIcon>
            <ListItemText primary="Master User & Affco" />
          </ListItemButton>

          {/* Master Workflow */}
          <ListItemButton
            onClick={() => {
              navigate("/MasterWorkflow");
            }}
            sx={{ bgcolor: '#223c49', color: 'white' }}
          >
            <ListItemIcon>
              <FolderOpenOutlinedIcon color="inherit" />
            </ListItemIcon>
            <ListItemText primary="Master Workflow" />
          </ListItemButton>
        </List>
      </Collapse>

      <ListItemButton onClick={() => {
              navigate("/histUpload");
            }}>
        <ListItemIcon>
          <LayersIcon color="inherit" />
        </ListItemIcon>
        <ListItemText primary="History Upload AFFCO" />
      </ListItemButton>
    </List>
  );
};

export default MenuItems;
