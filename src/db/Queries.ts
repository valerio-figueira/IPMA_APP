import MonthlyFeeModel from "../models/MonthlyFeeModel";
import AgreementModel from "../models/AgreementModel";
import HolderModel from "../models/HolderModel";
import ContactModel from "../models/user/ContactModel";
import DocumentModel from "../models/user/DocumentModel";
import LocationModel from "../models/user/LocationModel";
import UserModel from "../models/user/UserModel";
import AccessHierarchyModel from "../models/AccessHierarchyModel";
import AuthenticationModel from "../models/AuthenticationModel";
import MemberModel from "../models/MemberModel";
import DependentModel from "../models/DependentModel";
import AppointmentModel from "../models/AppointmentModel";


export default class Queries {

    static MonthlyFeeRawQuery = `
    SELECT
      m.holder_id,
      u.name,
      a.agreement_name AS AGREEMENT,
      SUM(billing.amount) AS total_billing,
      billing.reference_month,
      billing.reference_year
    FROM
      MONTHLY_FEE billing
      INNER JOIN MEMBER m ON billing.member_id = m.member_id
      INNER JOIN AGREEMENT a ON m.agreement_id = a.agreement_id
      INNER JOIN HOLDER h ON m.holder_id = h.holder_id
      INNER JOIN USER u ON h.user_id = u.user_id
    WHERE
      m.holder_id = :holderId AND
      billing.reference_month = :reference_month AND
      billing.reference_year = :reference_year
    GROUP BY
      m.holder_id,
      u.name,
      billing.reference_month,
      billing.reference_year,
      a.agreement_id
  `;


    /*
           {
              where: whereClause,
              attributes: [
                  'holder.holder_id',
                  [this.db.sequelize.fn('SUM', this.db.sequelize.col('billing.amount')), 'total_billing'],
                  'holder.user.name',
                  'agreement.agreement_id',
                  'billing.reference_month',
                  'billing.reference_year'
              ],
              include: Queries.MemberIncludeAll,
              group: [
                  'holder.holder_id',
                  'holder.user.name',
                  'billing.reference_month',
                  'billing.reference_year',
                  'agreement.agreement_id'],
              raw: true, nest: true
            }
    */







    static MonthlyFeeSummary = [{
        model: MonthlyFeeModel,
        as: 'billing',
        attributes: ['monthly_fee_id', 'amount', 'reference_month', 'reference_year', 'created_at'],
    }, {
        model: AgreementModel,
        as: 'agreement',
        attributes: ['agreement_name']
    }, {
        model: HolderModel,
        as: 'holder',
        attributes: [],
        include: [{
            model: UserModel,
            as: 'user',
            attributes: ['name']
        }]
    }, {
        model: DependentModel,
        as: 'dependent',
        attributes: ['relationship_degree'],
        include: [{
            model: UserModel,
            as: 'user',
            attributes: ['name']
        }]
    }]







    static MemberIncludeAll = [{
        model: MonthlyFeeModel,
        as: 'billing',
        attributes: [],
    }, {
        model: AgreementModel,
        as: 'agreement',
        attributes: ['agreement_name']
    }, {
        model: HolderModel,
        as: 'holder',
        attributes: [],
        include: [{
            model: UserModel,
            as: 'user',
            attributes: []
        }]
    }]





    static MemberIncludeAllBillings = [{
        model: MonthlyFeeModel,
        as: 'billing',
        attributes: [],
    }, {
        model: AppointmentModel,
        as: 'appointment',
        attributes: [],
    }, {
        model: AgreementModel,
        as: 'agreement',
        attributes: []
    }, {
        model: HolderModel,
        as: 'holder',
        attributes: [],
        include: [{
            model: UserModel,
            as: 'user',
            attributes: []
        }]
    }]





    static AppointmentQueryBulkCreate = [{
        model: HolderModel,
        as: 'holder',
        attributes: ['holder_id'],
        include: [{
            model: UserModel,
            as: 'user',
            attributes: ['user_id', 'name'],
            include: [{
                model: DocumentModel,
                as: 'document',
                attributes: ['document_id', 'cpf'],
            }]
        }]
    }]





    static AppointmentQueryFindDependent = [{
        model: DependentModel,
        as: 'dependent',
        attributes: ['holder_id', 'dependent_id'],
        include: [{
            model: UserModel,
            as: 'user',
            attributes: ['user_id', 'name'],
            include: [{
                model: DocumentModel,
                as: 'document',
                attributes: ['document_id', 'cpf'],
            }]
        }]
    }]





    static MonthlyFeeQuery = [{
        model: AgreementModel,
        as: 'agreement'
    }, {
        model: HolderModel,
        as: 'holder',
        include: [{
            model: UserModel,
            as: 'user'
        }]
    }]






    static IncludeSummaryUser(where: Record<string, any>) {
        return [{
            model: UserModel,
            as: 'user',
            where,
            attributes: { exclude: ['user_id'] },
            include: [
                {
                    model: AuthenticationModel,
                    as: 'authentication',
                    attributes: { exclude: ['user_id', 'password'] },
                    include: [{
                        model: AccessHierarchyModel,
                        as: 'hierarchy'
                    }]
                }
            ]
        }]
    }







    static IncludeUserData = [{
        model: UserModel,
        as: 'user',
        attributes: { exclude: ['user_id'] },
        include: [
            {
                model: AuthenticationModel,
                as: 'authentication',
                attributes: { exclude: ['user_id', 'password'] },
                include: [{
                    model: AccessHierarchyModel,
                    as: 'hierarchy'
                }]
            },
            {
                model: ContactModel,
                as: 'contact',
                attributes: { exclude: ['user_id', 'contact_id'] }
            },
            {
                model: DocumentModel,
                as: 'document',
                attributes: { exclude: ['user_id', 'document_id'] },
            },
            {
                model: LocationModel,
                as: 'location',
                attributes: { exclude: ['user_id', 'location_id'] }
            }
        ]
    }]







    static IncludeUserDataSummary = [{
        model: UserModel,
        as: 'user',
        attributes: { exclude: ['user_id'] },
        include: [
            {
                model: AuthenticationModel,
                as: 'authentication',
                attributes: { exclude: ['user_id', 'password'] },
                include: [{
                    model: AccessHierarchyModel,
                    as: 'hierarchy'
                }]
            }
        ]
    }]






    static IncludeDependentUserData = [{
        model: UserModel,
        as: 'user',
        attributes: { exclude: ['user_id'] },
        include: [
            {
                model: ContactModel,
                as: 'contact',
                attributes: { exclude: ['user_id', 'contact_id'] }
            },
            {
                model: DocumentModel,
                as: 'document',
                attributes: { exclude: ['user_id', 'document_id'] },
            },
            {
                model: LocationModel,
                as: 'location',
                attributes: { exclude: ['user_id', 'location_id'] }
            }
        ]
    }, {
        model: MemberModel,
        as: 'subscription',
        include: [{
            model: AgreementModel,
            as: 'agreement'
        }]
    }]






    static IncludeDependentSummary = [{
        model: UserModel,
        as: 'user',
        attributes: { exclude: ['user_id'] }
    }]






    static IncludeHierarchyAndUser = [{
        model: AccessHierarchyModel,
        as: 'hierarchy'
    },
    {
        model: UserModel,
        as: 'user'
    }]

}