export interface IProps {
    id: string
    label: string
    isActive: boolean
}


export const maintenanceTypes: IProps[] = [
    {
        id: 'preventive',
        label: 'Preventiva',
        isActive: false,
    },
    {
        id: 'corrective',
        label: 'Corretiva',
        isActive: false,
    }
]

export default maintenanceTypes;
