import React from "react";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import { useNavigate } from "react-router-dom";
import {
  ConnectWithoutContact,
} from "@mui/icons-material";
export interface MenuItemsProps {
  DrawerStatus: boolean;
}

const MenuItems = (props: MenuItemsProps) => {
  const [openMaster, setOpenMaster] = React.useState(false);
  const navigate = useNavigate();

  const handleOpenMaster = () => {
    setOpenMaster(!openMaster);
  };

  React.useEffect(() => {
    if (!props.DrawerStatus) {
      setOpenMaster(false);
    }
  }, [props.DrawerStatus]);
  return (
    <List component="nav" sx={{ color: "white" }}>
      <ListItemButton
        onClick={() => {
          navigate("/Dashboard");
        }}
      >
        <ListItemIcon>
          <DashboardIcon color="inherit" />
        </ListItemIcon>
        <ListItemText primary="Aspack Template" />
      </ListItemButton>
      {/* <ListItemButton onClick={handleOpenMaster}>
          <ListItemIcon>
            <DatasetIcon color="inherit" />
          </ListItemIcon>
          <ListItemText primary="Master" />
          {openMaster ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton> */}
      {/* <Collapse in={openMaster} timeout="auto" unmountOnExit>
          <List component="div" disablePadding className="subMenus">
            <ListItemButton sx={{ pl: 6 }} onClick={() => {
              navigate("/MasterRole");
            }}>
              <ListItemText primary="Master Role" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 6 }} onClick={() => {
              navigate("/MasterUser");
            }}>
              <ListItemText primary="Master User" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 6 }} onClick={() => {
              navigate("/MasterQap");
            }}>
              <ListItemText primary="Master Qap" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 6 }} onClick={() => {
              navigate("/MasterUserDist");
            }}>
              <ListItemText primary="Master User Distributor" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 6 }}
              onClick={() => {
                navigate("/MasterGeneral");
              }}>
              <ListItemText primary="Master General" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 6 }} onClick={() => {
              navigate("/MasterActivity");
            }}>
              <ListItemText primary="Master Activity" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 6 }}
              onClick={() => {
                navigate("/MasterDistributor");
              }}>
              <ListItemText primary="Master Distributor" />
            </ListItemButton>
          </List>
        </Collapse> */}
      <ListItemButton
        onClick={() => {
          navigate("/Approval");
        }}
      >
        <ListItemIcon>
          <ConnectWithoutContact color="inherit" />
        </ListItemIcon>
        <ListItemText primary="Aspack Approval" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <BarChartIcon color="inherit" />
        </ListItemIcon>
        <ListItemText primary="Consolidate Library" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <LayersIcon color="inherit" />
        </ListItemIcon>
        <ListItemText primary="Master User & Workflow" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <LayersIcon color="inherit" />
        </ListItemIcon>
        <ListItemText primary="History Upload  AFFCO" />
      </ListItemButton>
    </List>
  );
};

export default MenuItems;
