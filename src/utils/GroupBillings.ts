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
    return Object.values(groupedResults)
}


export const groupDetailedBillings = (billings: any[]) => {
    const groupedResults = billings.reduce((acc, curr) => {
        const holderId = curr.holder_id

        if (!acc[holderId]) {
            acc[holderId] = {
                holder_id: curr.holder_id,
                user_id: curr.holder.user.user_id,
                agreement_id: curr.agreement_id,
                agreement_card: curr.agreement_card,
                created_at: curr.created_at,
                name: curr.holder.user.name,
                agreements: [],
                totalPrice: {
                    all: 0,
                    odontoCompany: 0,
                    unimed: 0,
                    uniodonto: 0
                },
            }
        }

        const data = {
            name: null,
            monthly_fee_id: curr.billing.monthly_fee_id,
            agreement_name: curr.agreement.agreement_name,
            amount: parseFloat(curr.billing.amount),
            reference_month: curr.billing.reference_month,
            reference_year: curr.billing.reference_year,
            created_at: curr.billing.created_at
        }

        if (!curr.dependent.user.user_id) {
            acc[holderId].agreements.push({ ...data, name: curr.holder.user.name })
        } else {
            acc[holderId].agreements.push({ ...data, name: curr.dependent.user.name })
        }

        if (curr.agreement.agreement_name === 'ODONTO COMPANY') {
            acc[holderId].totalPrice.odontoCompany += parseFloat(curr.billing.amount)
        }

        if (curr.agreement.agreement_name === 'UNIMED') {
            acc[holderId].totalPrice.unimed += parseFloat(curr.billing.amount)
        }

        acc[holderId].totalPrice.all += parseFloat(curr.billing.amount)

        return acc
    }, {})

    // Converter o objeto agrupado em uma matriz de valores
    return Object.values(groupedResults)
}


export default groupBillings