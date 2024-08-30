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