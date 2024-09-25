export default interface IDataTemplate {
    id: string,
    name: string,
    category: string,
    filetype: string,
    status: boolean
}

export interface IConsNewsProps {
    uUid: string,
    vTitle: string,
    vDescription: string,
    vSubTitle: string,
    vAttachment: string,
    vConsolidateCategory: string,
    dCrea: string,
    vCrea: string,
    bActive: boolean    
}

export interface IConsProps{
    open: boolean,
    onClose: () => void,
    data: IConsNewsProps
}

export interface ISnackProps {
    open: boolean,
    message: string,
    error: boolean,
    onClose: () => void
}

export interface IProfileProps {
    open: boolean,
    onClose: () => void
}

export interface ICategoryProps {
    open: boolean,
    onClose: () => void
}

export interface ICatEditProps {
    open: boolean,
    onClose: () => void,
    data: ICategory
}
export interface ICategory {
    vCode: string,
    vType: string,
    vValue1: string,
    vValue2: string,
    bActive: boolean
}