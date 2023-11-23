const groupBillings = (billings: any[]) => {
    const groupedResults = billings.reduce((acc, curr) => {
        const holderId = curr.holder_id;

        if (!acc[holderId]) {
            acc[holderId] = {
                holder_id: curr.holder_id,
                total_billing: parseFloat(curr.total_billing),
                name: curr['name'],
                agreements: []
            };
        }

        acc[holderId].agreements.push({
            agreement_name: curr['agreement']['agreement_name'],
            reference_month: curr['reference_month'],
            reference_year: curr['reference_year'],
            total_billing: parseFloat(curr['total_billing'])
        });

        return acc;
    }, {});

    // Converter o objeto agrupado em uma matriz de valores
    return Object.values(groupedResults)
}


export default groupBillings