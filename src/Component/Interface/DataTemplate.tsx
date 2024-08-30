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
    vCrea: string    
}