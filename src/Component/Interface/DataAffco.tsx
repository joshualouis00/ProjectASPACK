export default interface IDataAffco{
  no: number;
  id: string;
  name: string;
  category: string;
  status: string;
}

export interface IAddAffcoProps {
  open: boolean;
  onClose: () => void;
}

export interface IAffcoProps {
  open: boolean;
  onClose: () => void;
  data: IDataAffco;
}