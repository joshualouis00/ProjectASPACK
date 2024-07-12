import { createTheme } from "@mui/material";
import MuiTabs from "@mui/material/Tabs";
declare module "@mui/material/styles" {
  interface Palette {
    accent: Palette["text"];
  }

  interface PaletteOptions {
    accent?: PaletteOptions["text"];
  }
  interface TabsPropsIndicatorColorOverrides {
    accent: true;
  }
 
}
const CustomTheme = createTheme({
  palette: {
    primary: {
      main: "#092635",
    },
    secondary: {
      main: "#1B4242",
    },
    accent: {
      primary: "#5C8374",
    },
  }
});

export default CustomTheme;
