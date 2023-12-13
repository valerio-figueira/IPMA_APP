import IDetailedBilling from "../interfaces/IDetailedBilling"
import MemberModel from "../models/MemberModel"

const sortByName = (a: any, b: any) => {
    const nameA = a.name.toUpperCase()
    const nameB = b.name.toUpperCase()

    if (nameA < nameB) return -1
    if (nameA > nameB) return 1

    return 0
}

const sortByDateAsc = (a: any, b: any) => {
    const dateA = a.created_at
    const dateB = b.created_at

    if (dateA < dateB) return -1
    if (dateA > dateB) return 1

    return 0
}

const sortByDateDesc = (a: any, b: any) => {
    const dateA = a.created_at
    const dateB = b.created_at

    if (dateA > dateB) return -1
    if (dateA < dateB) return 1

    return 0
}









const groupBillings = (billings: any[]) => {
    const groupedResults = billings.reduce((acc, curr) => {
        const holderId = curr.holder_id


        if (!acc[holderId]) {
            acc[holderId] = {
                holder_id: curr.holder_id,
                subscription_number: curr.subscription_number,
                total_billing: parseFloat(curr.total_billing),
                name: curr['name'],
                agreements: []
            }
        }

        acc[holderId].agreements.push({
            agreement_name: curr['agreement']['agreement_name'],
            reference_month: curr['reference_month'],
            reference_year: curr['reference_year'],
            total_billing: parseFloat(curr['total_billing'])
        })

        return acc
    }, {})

    // Converter o objeto agrupado em uma matriz de valores
    return Object.values(groupedResults).sort(sortByName)
}







const addTotalPrice = (acc: any, curr: any, holderId: any, data: Record<string, any>) => {
    if (curr.agreement.agreement_name === 'ODONTO COMPANY') {
        acc[holderId].totalPrice.odontoCompany += parseFloat(curr.billing.amount)
    }

    if (curr.agreement.agreement_name === 'UNIMED') {
        acc[holderId].totalPrice.unimed += parseFloat(curr.billing.amount)
    }

    if (curr.agreement.agreement_name === 'UNIODONTO') {
        acc[holderId].totalPrice.uniodonto += parseFloat(curr.billing.amount)
    }

    acc[holderId].totalPrice.all += parseFloat(curr.billing.amount)
}








export const groupDetailedBillings = (billings: MemberModel[]): IDetailedBilling[] => {
    const groupedResults = billings.reduce((acc: any, curr) => {
        const holderId = curr.holder_id

        if (!acc[holderId]) {
            acc[holderId] = {
                holder_id: curr.holder_id,
                user_id: curr.holder?.user?.user_id,
                agreement_card: curr.agreement_card,
                created_at: curr.created_at,
                name: curr.holder?.user?.name,
                agreements: [],
                totalPrice: {
                    all: 0,
                    odontoCompany: 0,
                    unimed: 0,
                    uniodonto: 0
                },
            } as IDetailedBilling
        }

        const data = {
            name: null,
            monthly_fee_id: curr.billing?.monthly_fee_id,
            agreement_id: curr.agreement_id,
            member_id: curr.member_id,
            agreement_name: curr.agreement?.agreement_name,
            amount: parseFloat(curr.billing!.amount as any),
            reference_month: curr.billing?.reference_month,
            reference_year: curr.billing?.reference_year,
            created_at: curr.billing?.created_at
        }

        if (!curr.dependent?.user?.user_id) {
            acc[holderId].agreements.push({ ...data, name: curr.holder?.user?.name })
        } else {
            acc[holderId].agreements.push({ ...data, name: curr.dependent.user.name })
        }

        addTotalPrice(acc, curr, holderId, data)

        acc[holderId].agreements.sort(sortByDateAsc)
        return acc
    }, {})

    // Converter o objeto agrupado em uma matriz de valores
    return Object.values(groupedResults).sort(sortByName) as IDetailedBilling[]
}


export default groupBillings