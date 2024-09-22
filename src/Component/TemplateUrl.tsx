import { Alert, Snackbar } from "@mui/material";
import { ISnackProps } from "./Interface/DataTemplate";

export const apiUrl = "http://110.139.33.246:9020/";
export const getToken = localStorage.getItem('token');
export const getRole = localStorage.getItem('Role');
export const getUserId = localStorage.getItem('UserID');
export const getUserName = localStorage.getItem('UserName');
export const getEmail = localStorage.getItem('Email');
export const CoCode = localStorage.getItem('CoCode');

export const generateYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());
  };

export const generateMonths = [
  { id: 1, name: "January" },
  { id: 2, name: "February" },
  { id: 3, name: "March" },
  { id: 4, name: "April" },
  { id: 5, name: "May" },
  { id: 6, name: "June" },
  { id: 7, name: "July" },
  { id: 8, name: "August" },
  { id: 9, name: "September" },
  { id: 10, name: "October" },
  { id: 11, name: "November" },
  { id: 12, name: "December" }
];

export const generateCategory = [  
  { id: "KAT1", name: "Kategori 1"},
  { id: "KAT2", name: "Kategori 2"}
]

export function CustomSnackBar(props: ISnackProps){
  const { open, message, error, onClose } = props

  return (
    <Snackbar
                open={open}
                onClose={onClose}                
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
  )
}