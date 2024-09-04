export interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: number;
    value: number;
  }
  
  export interface FileData {
    fileName: string;
    createDate: string;
    status: string;
    vAttchId: string;
    file: File;
  }

  export interface ITabContent {
    label: string;
    vStepId: string;
    vFileType: string;
    files: FileData[];
    setFiles: (newFiles: FileData[]) => void;
  }

  //Material Table Upload Template
  export interface FileDataUpload {
    fileName: string;
    createDate: string;
    status: string;
    vAttchId: string;
  }
  
  export interface AppTableProps {
    files: FileDataUpload[];
  }