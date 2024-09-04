import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Step,
  StepButton,  
  Stepper,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";
import { styled } from "@mui/material/styles";
import { MaterialReactTable } from "material-react-table";
import { useDropzone } from "react-dropzone";
import { apiUrl, getToken } from "../Component/TemplateUrl";
import { columnHistoryUpload } from "../Component/TableComponent/ColumnDef/IColumnUpload";
import {
  IStepProps,
  ITempFile,
  IHeaderProps,
  IRespFile,
} from "../Component/Interface/DataUpload";
import { getUserId } from "../Component/TemplateUrl";

export default function AffcoUpload() {
  const dataMonth = new Date().getMonth();
  const dataYear = new Date().getFullYear();
  const [dataFile, setDataFile] = React.useState<IStepProps[]>([]);
  const [tempData, setTempData] = React.useState<IStepProps>();
  const [stepData, setStepData] = React.useState("");
  const [dataStep, setDataStep] = React.useState([
    {
      id: 100,
      label: "loading",
      desc: "loading",
    },
  ]);
  const [tempFile, setTempFile] = React.useState<ITempFile[]>([]);
  const [respFile, setRespFile] = React.useState<IRespFile[]>([]);
  const [vRespName, setVRespName] = React.useState("");
  const [dataHeader, setDataHeader] = React.useState<IHeaderProps>({
    iMonth: "",
    iYear: "",
    iStatus: "",
    vAffcoId: "",
    vPackageId: "",
  });
  const [filter, setFilter] = React.useState(false);

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      var randomstring = require("randomstring");

      const tempCode = randomstring.generate({
        length: 7,
        charset: "alphabetic",
      });
      const files: IStepProps[] = acceptedFiles.map((val) => ({
        filename: val.name,
        createDate: Date().toString(),
        createBy: getUserId,
        docVersion: "draft",
        status: "Draft",
        stepid: stepData,
        dApprover: "",
        dDueDate: "",
        apprRemarks: "",
        userRemarks: "",
        vTempCode: tempCode,
        vApprover: "",
        vAttachId: "",
      }));

      const temFiles: ITempFile[] = acceptedFiles.map((val) => ({
        vTempCode: tempCode,
        dtlFIle: val,
      }));

      setDataFile((prev) => [...prev, ...files]);
      setTempFile((prevFile) => [...prevFile, ...temFiles]);

      
    },
    [stepData]
  );

  const [month, setMonth] = React.useState((dataMonth + 1).toString());
  const [year, setYear] = React.useState(dataYear.toString());
  const [hasErrorMonth, setHasErrorMonth] = React.useState(false);
  const [hasErrorYear, setHasErrorYear] = React.useState(false);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  const [activeStep, setActiveStep] = React.useState(-1);
  const [completed, setCompleted] = React.useState<{ [k: number]: boolean }>(
    {}
  );

  const steps = dataStep;

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step: number, stepName: string) => () => {
    setActiveStep(step);
    setStepData(stepName);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  const handleChangeMonth = (event: SelectChangeEvent) => {
    setMonth(event.target.value as string);
    setHasErrorMonth(false);
  };

  const handleChangeYear = (event: SelectChangeEvent) => {
    setYear(event.target.value as string);
    setHasErrorYear(false);
  };

  const handleSubmitFilter = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetch(apiUrl + "api/WorkflowStep/getStep", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken}`,
      },
    }).then((resp) => {
      resp.json().then((valData) => {
        setDataStep(
          valData.data
            .filter((x) => x.bActive === true)
            .map((val, index) => {
              return {
                id: index,
                label: val.vStepId,
                desc: val.vStepDesc,
              };
            })
        );
      });
    });
    fetch(
      apiUrl +
        "api/Package/getPackage?nYear=" +
        year +
        "&nMonth=" +
        month +
        "&vAffcoId=",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getToken}`,
        },
      }
    ).then((resp) => {
      resp.json().then((valData) => {
        
        if(valData.header.vPackageId !== ""){
          

          
          setDataFile(
            valData.detail.map((dtl) => {
              return {
                filename:
                  dtl.fPackageFile.length > 0
                    ? dtl.fPackageFile[0].vAttchName
                    : "",
                createDate:
                  dtl.fPackageFile.length > 0
                    ? dtl.fPackageFile[0].dCrea
                    : "",
                createBy:
                  dtl.fPackageFile.length > 0
                    ? dtl.fPackageFile[0].vCrea
                    : "",
                docVersion:
                  dtl.fPackageFile.length > 0
                    ? "V" + dtl.fPackageFile.length
                    : "",
                status:
                  dtl.vStatus === "S"
                    ? "Submitted"
                    : dtl.vStatus === "A"
                    ? "Approved"
                    : dtl.vStatus === "R"
                    ? "Revised"
                    : "",
                stepid: dtl.vStepId,
                dApprover: dtl.dApprover,
                dDueDate: dtl.dDueDate,
                apprRemarks: dtl.vApprRemarks,
                userRemarks: dtl.vUsrRemarks,
                vTempCode: dtl.vTemporalCode,
                vAttachId: dtl.vAttchId,
              };
            })
            
            )
            
        } else {
          setDataFile([]);
        }

        setDataHeader({
          vPackageId: valData.header.vPackageId,
          iMonth: valData.header.iMonth,
          iYear: valData.header.iYear,
          iStatus: valData.header.iStatus,
          vAffcoId: valData.header.vAffcoId,
        });
      });
    });

    const testData = dataFile.filter((x) => x.stepid === stepData);
    
    console.log(testData);

    setFilter(true);
  };

  const handleSubmitFiles = () => {
    const dataForm = new FormData();
    

    const packId = dataHeader?.vPackageId !== "" ? dataHeader?.vPackageId : "";
    dataForm.append("Header.vPackageId", packId);
    dataForm.append("Header.iYear", year);
    dataForm.append("Header.iMonth", month);
    dataForm.append("Header.iStatus", "");
    dataForm.append("Header.vAffcoId", "");

    dataFile.filter((x) => x.status !== "Revised").map((val, index) => {
        console.log(val.vAttachId)
        return (
          dataForm.append(
            `Detail[${index}].vAttchId`, val.vAttachId            
          ),
          dataForm.append(`Detail[${index}].vStepId`, val.stepid),
          dataForm.append(`Detail[${index}].vApprover`, val.vApprover),
          dataForm.append(`Detail[${index}].dApprover`, val.dApprover),
          dataForm.append(`Detail[${index}].dDueDate`, val.dDueDate),
          dataForm.append(`Detail[${index}].vStatus`, val.status === "Approved" ? "A" : "S" ),
          dataForm.append(`Detail[${index}].vApprRemarks`, val.apprRemarks),
          dataForm.append(`Detail[${index}].vUsrRemarks`, val.userRemarks),
          dataForm.append(`Detail[${index}].vTemporalCode`, val.vTempCode),
          dataForm.append(`DtlAttach[${index}].vAttchName`, val.filename),
          dataForm.append(`DtlAttach[${index}].vRemarks`, ""),
          dataForm.append(
            `DtlAttach[${index}].vAttchId`,
            dataHeader?.vPackageId !== "" ? val.vAttachId : ""
          )
        );
      });

    tempFile?.map((val, index) => {
      return (
        dataForm.append(`DtlAttach[${index}].vTemporalCode`, val.vTempCode),
        dataForm.append(`DtlAttach[${index}].fAttchContent`, val.dtlFIle)
      );
    });

    // fetch(apiUrl + "api/Package/SubmitPackage", {
    //   method: "POST",
    //   headers: {
    //     Authorization: `bearer ${getToken}`,
    //     Accept: "*/*",
    //   },
    //   body: dataForm,
    // }).then((resp) => {
    //   if (resp.ok) {
    //     alert("berhasil");
    //     window.location.reload();
    //   } else {
    //     alert("something wrong : " + resp.status);
    //   }
    // });
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "left",
    color: theme.palette.text.secondary,
  }));

  const handleDownloadTemplate = (stepid: string) => () => {
    fetch(apiUrl + "api/Package/DownloadTemplate?vStepId=" + stepid, {
      method: "GET",
      headers: {
        Authorization: `bearer ${getToken}`,
      },
    }).then((resp) => {
      if (resp.status === 404) {
        return alert("Template tidak tersedia");
      } else {
        if (resp.status === 200) {
          resp.blob().then((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "Template " + stepid;
            a.click();
          });
        } else {
          return alert("Server Error : " + resp.status);
        }
      }
    });
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "left",
      }}
    >
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Filter Periode
        </AccordionSummary>
        <Divider />
        <AccordionDetails>
          <Box component="form" onSubmit={handleSubmitFilter}>
            <Stack direction={"row"}>
              <Item elevation={0}>
                <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
                  <InputLabel id="month">Select Periode Month</InputLabel>
                  <Select
                    labelId="month"
                    name="vMonth"
                    value={month}
                    label="Select Periode Month"
                    onChange={handleChangeMonth}
                    error={hasErrorMonth}
                  >
                    <MenuItem value="1">Januari</MenuItem>
                    <MenuItem value="2">Februari</MenuItem>
                    <MenuItem value="3">Maret</MenuItem>
                    <MenuItem value="4">April</MenuItem>
                    <MenuItem value="5">Mei</MenuItem>
                    <MenuItem value="6">Juni</MenuItem>
                    <MenuItem value="7">Juli</MenuItem>
                    <MenuItem value="8">Agustus</MenuItem>
                    <MenuItem value="9">September</MenuItem>
                    <MenuItem value="10">Oktober</MenuItem>
                    <MenuItem value="11">November</MenuItem>
                    <MenuItem value="12">Desember</MenuItem>
                  </Select>
                  {hasErrorMonth && (
                    <FormHelperText sx={{ color: "red" }}>
                      This is required!
                    </FormHelperText>
                  )}
                </FormControl>
              </Item>
              <Item elevation={0}>
                <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
                  <InputLabel id="year">Select Periode Year</InputLabel>
                  <Select
                    labelId="year"
                    name="vYear"
                    value={year}
                    label="year"
                    onChange={handleChangeYear}
                    error={hasErrorYear}
                  >
                    <MenuItem value="2024">2024</MenuItem>
                    <MenuItem value="2023">2023</MenuItem>
                  </Select>
                  {hasErrorYear && (
                    <FormHelperText sx={{ color: "red" }}>
                      This is required!
                    </FormHelperText>
                  )}
                </FormControl>
              </Item>
              <Item elevation={0}>
                <Button type="submit" variant="contained" sx={{ m: 1 }}>
                  Filter
                </Button>
              </Item>
            </Stack>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          Upload Aspack
        </AccordionSummary>
        <Divider />
        <AccordionDetails>
          {filter ? (
            <Stack direction={"column"}>
              <Item elevation={0}>
                <Stepper nonLinear activeStep={activeStep} alternativeLabel>
                  {dataHeader.vPackageId !== ""
                    ? dataFile.filter((x) => x.status !== "Draft").map((val, index) => {
                        const iconProps: {
                          active?: boolean;
                          completed?: boolean;
                        } = {};
                        const labelProps: {
                          optional?: React.ReactNode;
                        } = {};
                        if (val.status === "Submitted") {
                          iconProps.active = true;
                          labelProps.optional = (
                            <Typography variant="caption" color="blue">
                              Waiting for Approval
                            </Typography>
                          );
                        } else {
                          if (val.status === "Revised") {
                            iconProps.completed = true;
                            labelProps.optional = (
                              <Typography variant="caption" color="red">
                                Revised
                              </Typography>
                            );
                          } else if (val.status === "Approved") {
                            iconProps.completed = true;
                            labelProps.optional = (
                              <Typography variant="caption" color="green">
                                Approved
                              </Typography>
                            );
                          } else {
                            iconProps.active = true;
                            labelProps.optional = (
                              <Typography variant="caption" color="blue">
                                Waiting for Approval
                              </Typography>
                            );
                          }
                        }
                        return (
                          <Step key={val.stepid} {...iconProps} sx={val.status === "Approved" ? { "& .Mui-completed": { color: "green" } } : { "& .Mui-completed": { color: "red" } }}>
                            <StepButton
                              color="inherit"
                              onClick={handleStep(index, val.stepid)}
                              {...labelProps}
                            >
                              {val.stepid}
                            </StepButton>
                            
                          </Step>
                        );
                      })
                    : steps.map((label, index) => (
                        <Step key={label.id} completed={completed[index] }>
                          <StepButton
                            color="inherit"
                            onClick={handleStep(index, label.label)}
                          >
                            {label.desc}
                          </StepButton>
                        </Step>
                      ))}
                </Stepper>
              </Item>
              {stepData !== "" ? (
                <Box
                  {...getRootProps()}
                  sx={{
                    border: "0.5px dashed #ccc",
                    borderRadius: "4px",
                    padding: "20px",
                    height: "200px",
                    textAlign: "center",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <input {...getInputProps()} />
                  <Typography color="textSecondary" sx={{ fontSize: "10px" }}>
                    Drag 'n' drop some files here, or click to select files
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    border: "0.5px dashed #ccc",
                    borderRadius: "4px",
                    padding: "20px",
                    height: "200px",
                    textAlign: "center",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <input {...getInputProps()} />
                  <Typography color="textSecondary" sx={{ fontSize: "10px" }}>
                    Select Step for upload
                  </Typography>
                </Box>
              )}
              <Item elevation={0}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ float: "right" }}
                  onClick={handleDownloadTemplate(stepData)}
                  disabled={stepData === "" ? true : false}
                >
                  Download Template
                </Button>
              </Item>

              <Item elevation={0}>
                {allStepsCompleted() ? (
                  <Box></Box>
                ) : (
                  <Box>
                    <Stack direction={"column"}>
                      <Item elevation={0}>
                        <Typography sx={{ marginBottom: 1 }}>
                          {stepData !== "" ? "History " + stepData : null}
                        </Typography>
                        <MaterialReactTable
                          columns={columnHistoryUpload}
                          data={dataFile.filter((v) => v.stepid === stepData)}
                          renderBottomToolbarCustomActions={() => {
                            const countStep = dataStep?.length;
                            const countRevise = dataFile.filter((v) => v.status === "Revised").length
                            const countApproved = dataFile.filter((v) => v.status === "Approved").length
                            const countDraft = dataFile.filter((v) => v.status === "Draft").length

                            return (
                              <Button
                                variant="contained"
                                disabled={
                                  dataHeader?.vPackageId === "" &&
                                  dataFile?.length === countStep
                                    ? false
                                    : dataHeader?.vPackageId !== "" && dataFile?.length === countApproved ? false : dataHeader?.vPackageId !== "" && countRevise === countDraft ? false :true
                                }
                                onClick={handleSubmitFiles}
                              >
                                Submit Files
                              </Button>
                            );
                          }}
                        />
                      </Item>
                    </Stack>
                  </Box>
                )}
              </Item>
            </Stack>
          ) : (
            <Box>
              <Typography>clik filter to show data</Typography>
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
