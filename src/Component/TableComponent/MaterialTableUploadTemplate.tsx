import React from "react";
import { type MRT_ColumnDef, MaterialReactTable } from "material-react-table";
import useHandleUnauthorized from "../handleUnauthorized";
import { Button, Box, Alert } from "@mui/material";
import { format, parse } from "date-fns";
import { apiUrl, getToken } from "../TemplateUrl";
import { FileDataUpload, AppTableProps } from "../Interface/MasterTemplates";

const AppTable: React.FC<
  AppTableProps & { uploadStatus: string | null; errorMessage: string | null }
> = ({ files, uploadStatus, errorMessage }) => {
  const navigate = useHandleUnauthorized();
  const [showAlert, setShowAlert] = React.useState(false);

  const getLatestVersion = (vAttchId: string) => {
    const filesForAttchId = files
      .filter((file) => file.vAttchId === vAttchId && file.status === "Active");
    return filesForAttchId.length; // Mengembalikan jumlah file yang "Active" sebagai versi terbaru
  };
  
  const getVersion = (iVersion: any) => {
    const filesForAttchIds = files.filter((file) => file.iVersion === iVersion && file.status === "Inactive");
    return filesForAttchIds.length;
  }


  const downloadFile = async (
    fileName: string,
    vAttchId: string,
    status: string,
    iVersion: any
  ) => {
    const encodedFileName = btoa(fileName); // Encode filename

    // Jika statusnya "Active", gunakan versi terakhir, jika tidak gunakan versi dari row
    const versionToUse =
      status === "Active" ? getLatestVersion(vAttchId).toString() : getVersion(iVersion).toString();

    const url =
      apiUrl +
      `api/Template/DownloadTemplate?vName=${encodedFileName}&vAttachId=${vAttchId}&iVersion=${versionToUse}`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ` + getToken,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        navigate();
      } else {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 5000);
        console.error("Error fetching templates:", error);
      }
    }
  };  

  const columns: MRT_ColumnDef<FileDataUpload>[] = [
    {
      accessorKey: "fileName",
      header: "File Name",
      Cell: ({ cell }) => (
        <span
          style={{
            display: "block",
            width: "300px",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {cell.getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: "createDate",
      header: "Create Date",
      Cell: ({ cell }) => {
        const dateStr = cell.getValue<string>(); // Ambil string tanggal dari data
        let formattedDate = " "; // Default jika tanggal tidak valid

        try {
          const date = parse(dateStr, "dd-MM-yyyy", new Date()); // Parsing tanggal dari format "dd-MM-yyyy"
          if (!isNaN(date.getTime())) {
            // Periksa apakah tanggal valid
            formattedDate = format(date, "dd/MM/yyyy"); // Format tanggal ke "dd/MM/yyyy"
          }
        } catch (error) {
          console.error("Error parsing or formatting date:", error);
        }

        return (
          <span
            style={{
              display: "block",
              width: "120px",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {formattedDate}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      Cell: ({ cell }) => <span>{cell.getValue<string>()}</span>,
    },
    {
      header: "Download",
      Cell: ({ row }) => {
        const fileName = row.original.fileName;
        const vAttchId = row.original.vAttchId;
        const fileStatus = row.original.status;
        const iVersion = row.original.iVersion;
        return (
          <Button
            onClick={() =>
              downloadFile(fileName, vAttchId, fileStatus, iVersion)
            }
            variant="outlined"
            color="info"
            size="small"
            disabled={
              fileStatus === "Draft" || uploadStatus === "Upload successful"
            }
          >
            Download
          </Button>
        );
      },
    },
  ];

  return (
    <Box>
      <MaterialReactTable columns={columns} data={files} />
      {showAlert && (
        <Alert variant="outlined" severity="error" sx={{ mb: 2 }}>
          Gagal download template. Hubungi IT Support.
        </Alert>
      )}
      {errorMessage && (
        <Alert variant="outlined" severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}
    </Box>
  );
};

export default AppTable;
