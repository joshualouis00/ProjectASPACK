

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
    vApprover: string
}

export interface ITempFile {
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