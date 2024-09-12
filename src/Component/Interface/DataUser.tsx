import IDataAffco from "./DataAffco";

export default interface IDataUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  ldapLogin: boolean;
  affcoId: string;
  vLdap: string;
  vPicAffco: string;

}

export interface IAddUserProps {
    open: boolean;
  selectedValue: string;
  onClose: () => void;
  data: IDataAffco[]
}

export interface IUserProps {
  open: boolean;
  onClose: () => void;
  data: IDataUser;
  affco: IDataAffco[];
}

export interface IAlertProps {
  open: boolean;
  onClose: () => void;
  data: string;
  success: boolean;
}
