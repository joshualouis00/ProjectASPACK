import IDataAffco from "./DataAffco";

export default interface IDataUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export interface IAddUserProps {
    open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
  data: IDataAffco[]
}
