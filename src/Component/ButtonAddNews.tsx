import styled from "@emotion/styled";
import { ArrowBack, Create } from "@mui/icons-material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import React from "react";

interface AddNewsProps {
  open: boolean;
  onClose: () => void;
}

function AddNewsDialog(props: AddNewsProps) {
  const { open, onClose } = props;
  const [category, setCategory] = React.useState("");

  const handleChangeCategory = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  return (
    <Dialog open={open} fullWidth={true} onClose={onClose}>
      <DialogTitle>Create Consolidate News</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        x
      </IconButton>
      <DialogContent dividers>
        <Box
          sx={{ display: "flex", flexDirection: "column", alignItems: "left" }}
        >
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <TextField size="small" label="Title News" name="vTitle" />
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <TextField size="small" label="Sub Title News" name="vSubTitle" />
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <TextField
              multiline
              maxRows={5}
              label="Description"
              name="vDesc"
              rows={3}
            ></TextField>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="categoryId">Category News</InputLabel>
            <Select
              labelId="categoryId"
              name="vCategory"
              label="Category News"
              value={category}
              onChange={handleChangeCategory}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="kategori 1">Kategori 1</MenuItem>
              <MenuItem value="kategori 2">Kategori 2</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
          <FormLabel id="vAttach" sx={{ marginBottom: 1}}>Attachment File</FormLabel>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload file
              <VisuallyHiddenInput type="file" />
            </Button>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="success" variant="contained" startIcon={<Create />}>
          Create
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

export default function ButtonAddNews() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  return (
    <Box>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        size="medium"
        sx={{ m: 1 }}
      >
        Add Consolidate News
      </Button>
      <AddNewsDialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      />
    </Box>
  );
}
