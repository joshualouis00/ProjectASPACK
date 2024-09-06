

export interface IStepProps {    
    filename: string ,
    createDate: string,
    createBy: string | null,
    docVersion: string,
    status: string ,
    stepid: string ,
    dApprover: string,
    dDueDate: string,
    apprRemarks: string ,
    userRemarks: string ,
    vTempCode: string ,
    vApprover: string ,
    vAttachId: string
}

export interface ITempFile {
    vAttchName: string,
    vRemarks: string,
    vAttchId: string,
    vTempCode: string,
    dtlFIle: File
}

export interface IHeaderProps {
    iMonth: string,
    iYear: string,
    iStatus: string,
    vAffcoId: string,
    vPackageId: string
}

export interface IRespFile {
    vStepId: string,
    vAttchName: string,
    vAttType: string,
    vRemark: string,
    vAttchId: string,
    fAttchContent: string | File 
}

export interface IDialogProps {
    open: boolean,
    onClose: () => void, 
    data: number  
}