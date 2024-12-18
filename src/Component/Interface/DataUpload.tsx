

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
    vAttachId: string,
    stepName?: string,
    dLastTemplateUpdate? : string
}

export interface ILastUpdateTemp {
    stepid: string,
    dLastTemplateUpdate: string
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
    fAttchContent: string | File ,
    version?: string
}

export interface IDialogProps {
    open: boolean,
    onClose: () => void, 
    data: number  
}

export interface IRemarkProps {
    open: boolean,
    onClose: () => void,
    remark: string,
    dueDate: string,
    version: string,
    attachId: string,
    stepId: string,
    respAffco: string,
    status: string
}

export interface IResponseProps {
    open: boolean,
    onClose: () => void,
    stepId: string,
    version: string,
    attachId: string
}

export interface ITempResponse {
    vRespAffco: string,
    vStepId: string,
    vFile: string | File,
    vAttachName: string
}