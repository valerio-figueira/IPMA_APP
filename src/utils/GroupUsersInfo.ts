import HolderModel from "../models/HolderModel"
import MemberModel from "../models/MemberModel"

interface IHolderAndDependents {
    user_id: number,
    holder_id: number,
    dependent_id: number,
    holder: string,
    birth_date: Date,
    gender: string,
    marital_status: string,
    father_name: string,
    mother_name: string,
    cpf: string,
    identity: string,
    issue_date: Date,
    health_card: string,
    address: string,
    number: number,
    neighborhood: string,
    city: string,
    zipcode: string,
    state: string,
    phone_number: string,
    residential_phone: string,
    email: string,
    created_at: Date,
    dependents: [{
        user_id: number,
        holder_id: number,
        dependent_id: number,
        dependent: string,
        birth_date: Date,
        gender: string,
        marital_status: string,
        father_name: string,
        mother_name: string,
        cpf: string,
        identity: string,
        issue_date: Date,
        health_card: string,
        address: string,
        number: number,
        neighborhood: string,
        city: string,
        zipcode: string,
        state: string,
        phone_number: string,
        residential_phone: string,
        email: string,
        created_at: Date,
    }],
}







const groupDependents = (holders: HolderModel[]): IHolderAndDependents[] => {
    const groupedResults = holders.reduce((acc: any, curr) => {
        const holderId = curr.holder_id

        if (!acc[holderId]) {
            acc[holderId] = {
                user_id: curr.user_id,
                holder_id: curr.holder_id,
                dependent_id: curr.dependent?.dependent_id,
                holder: curr.user?.name,
                birth_date: curr.user?.birth_date,
                gender: curr.user?.gender,
                marital_status: curr.user?.marital_status,
                father_name: curr.user?.father_name,
                mother_name: curr.user?.mother_name,
                cpf: curr.user?.document.cpf,
                identity: curr.user?.document.identity,
                issue_date: curr.user?.document.issue_date,
                health_card: curr.user?.document.health_card,
                address: curr.user?.location.address,
                number: curr.user?.location.number,
                neighborhood: curr.user?.location.neighborhood,
                city: curr.user?.location.city,
                zipcode: curr.user?.location.zipcode,
                state: curr.user?.location.state,
                phone_number: curr.user?.contact.phone_number,
                residential_phone: curr.user?.contact.residential_phone,
                email: curr.user?.contact.email,
                created_at: curr.created_at,
                dependents: [],
            }
        }

        if (curr.dependent && curr.dependent.dependent_id) {
            acc[holderId].dependents.push({
                user_id: curr.dependent.user?.user_id,
                holder_id: curr.holder_id,
                dependent_id: curr.dependent?.dependent_id,
                holder: curr.user?.name,
                dependent: curr.dependent.user?.name,
                birth_date: curr.dependent.user?.birth_date,
                gender: curr.dependent.user?.gender,
                marital_status: curr.dependent.user?.marital_status,
                father_name: curr.dependent.user?.father_name,
                mother_name: curr.dependent.user?.mother_name,
                cpf: curr.dependent.user?.document?.cpf,
                identity: curr.dependent.user?.document?.identity,
                issue_date: curr.dependent.user?.document?.issue_date,
                health_card: curr.dependent.user?.document?.health_card,
                address: curr.dependent.user?.location?.address,
                number: curr.dependent.user?.location?.number,
                neighborhood: curr.dependent.user?.location?.neighborhood,
                city: curr.dependent.user?.location?.city,
                zipcode: curr.dependent.user?.location?.zipcode,
                state: curr.dependent.user?.location?.state,
                phone_number: curr.dependent.user?.contact?.phone_number,
                residential_phone: curr.dependent.user?.contact?.residential_phone,
                email: curr.dependent.user?.contact?.email,
                created_at: curr.dependent.created_at
            })
        }

        return acc
    }, {})

    // Converter o objeto agrupado em uma matriz de valores
    return Object.values(groupedResults) as IHolderAndDependents[]
}





interface IMembers {
    user_id: number;
    holder_id: number;
    dependent_id: number;
    agreement_id: number;
    member_id: number;
    holder: string;
    cpf: string;
    agreement_name: string;
    created_at: Date;
    dependents: [{
        user_id: number;
        holder_id: number;
        dependent_id: number;
        agreement_id: number;
        member_id: number;
        dependent: string;
        holder: string;
        agreement_name: string;
        cpf: string;
        created_at: Date;
    }]
}





export const groupMembersSummary = (members: MemberModel[]): IMembers[] => {
    const groupedResults = members.reduce((acc: any, curr) => {
        const holderId = curr.holder_id

        if (!acc[holderId]) {
            acc[holderId] = {
                user_id: curr.holder?.user?.user_id,
                holder_id: curr.holder?.holder_id,
                dependent_id: curr.dependent?.dependent_id,
                agreement_id: curr.agreement_id,
                member_id: curr.member_id,
                holder: curr.holder?.user?.name,
                cpf: curr.holder?.user?.document.cpf,
                agreement_name: curr.agreement?.agreement_name,
                created_at: curr.created_at,
                dependents: [],
            }
        }

        if (curr.dependent && curr.dependent.dependent_id) {
            acc[holderId].dependents.push({
                user_id: curr.dependent.user?.user_id,
                holder_id: curr.holder?.holder_id,
                dependent_id: curr.dependent?.dependent_id,
                agreement_id: curr.agreement_id,
                member_id: curr.member_id,
                holder: curr.holder?.user?.name,
                dependent: curr.dependent.user?.name,
                cpf: curr.dependent.user?.document?.cpf,
                agreement_name: curr.agreement?.agreement_name,
                created_at: curr.dependent.created_at
            })
        }

        return acc
    }, {})

    // Converter o objeto agrupado em uma matriz de valores
    return Object.values(groupedResults)
}





export default groupDependents