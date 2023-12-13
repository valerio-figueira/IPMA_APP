export default interface IDetailedBilling {
    holder_id: number
    user_id: number
    agreement_card: number
    created_at: Date
    name: string
    agreements: [
        {
            name: string | null
            agreement_id: number
            monthly_fee_id: number
            member_id: number
            agreement_name: string
            amount: number | undefined
            reference_month: number
            reference_year: number
            created_at: Date
        }
    ] | [],
    totalPrice: {
        all: number
        odontoCompany: number
        unimed: number
        uniodonto: number
    }
}