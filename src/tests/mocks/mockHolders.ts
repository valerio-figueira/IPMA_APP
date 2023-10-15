export const mockHolders = [
    {
        "holder_id": 1,
        "user_id": 1,
        "subscription_number": null,
        "status": "",
        "created_at": "2023-10-05T23:17:25.000Z",
        "user": {
            "name": "NIKOS KATSAROS",
            "gender": "MASCULINO",
            "marital_status": "DIVORCIADO",
            "birth_date": "1985-09-20",
            "father_name": "PANAGIOTIS KATSAROS",
            "mother_name": "MARIA ALEXANDROPOULOU",
            "created_at": "2023-10-05T23:17:23.000Z",
            "authentication": {
                "authentication_id": null,
                "hierarchy_id": null,
                "username": null,
                "user_photo": null,
                "created_at": null,
                "hierarchy": {
                    "hierarchy_id": null,
                    "level_name": null,
                    "parent_level_id": null,
                    "created_at": null
                }
            },
            "contact": {
                "contact_id": 1,
                "phone_number": "30213456789",
                "residential_phone": "3021666611",
                "email": "nikos.katsaros@email.gr",
                "created_at": "2023-10-05T23:17:24.000Z"
            },
            "document": {
                "document_id": 1,
                "cpf": "78912345678",
                "identity": "AG987654",
                "issue_date": "2005-12-15",
                "health_card": "654321098765432",
                "created_at": "2023-10-05T23:17:24.000Z"
            },
            "location": {
                "location_id": 1,
                "address": "EGEO STREET",
                "number": 32,
                "neighborhood": "SANTORINI",
                "city": "ATHENS",
                "zipcode": null,
                "state": "GR",
                "created_at": "2023-10-05T23:17:24.000Z"
            }
        }
    }
]

export const mockHolderError = {
    "subscription_number": null,
    "status": "",
    "name": "NIKOS KATSAROS",
    "gender": "MASCULINO",
    "marital_status": "DIVORCIADO",
    "birth_date": "1985-09-20",
    "father_name": "PANAGIOTIS KATSAROS",
    "mother_name": "MARIA ALEXANDROPOULOU",
    "phone_number": "30213456789",
    "residential_phone": "3021666611",
    "email": "nikos.katsaros@email.gr",
    "cpf": "78912345678",
    "identity": "AG987654",
    "issue_date": "2005-12-15",
    "health_card": "654321098765432",
    "address": "EGEO STREET",
    "number": 32,
    "neighborhood": "SANTORINI",
    "city": "ATHENS",
    "zipcode": null,
    "state": "GR",
}

export const mockHolderSuccess = {
    "name": "Maria Konstantopoulos",
    "gender": "FEMININO",
    "marital_status": "Casada",
    "birth_date": "1980-12-05",
    "father_name": "Nikos Konstantopoulos",
    "mother_name": "Sophia Rhodes",
    "phone_number": "+30 21 8765-4321",
    "residential_phone": "+30 21 6666-7777",
    "email": "maria@email.gr",
    "address": "Aegean Avenue",
    "number": 72,
    "neighborhood": "Mykonos",
    "city": "Athens",
    "state": "GR",
    "cpf": "987.654.321-09",
    "identity": "AG-543210",
    "issue_date": "2003-10-18",
    "health_card": "123456789012345",
    "status": "ATIVO(A)",
    "subscription_number": 16
}


export const mockHolderRes = {
    "holder_id": 5,
    "user_id": 7,
    "subscription_number": 16,
    "status": "ATIVO(A)",
    "created_at": "2023-10-06T01:04:59.000Z",
    "user": {
        "name": "MARIA KONSTANTOPOULOS",
        "gender": "FEMININO",
        "marital_status": "CASADA",
        "birth_date": "1980-12-05",
        "father_name": "NIKOS KONSTANTOPOULOS",
        "mother_name": "SOPHIA RHODES",
        "created_at": "2023-10-06T01:04:56.000Z",
        "authentication": {
            "authentication_id": null,
            "hierarchy_id": null,
            "username": null,
            "user_photo": null,
            "created_at": null,
            "hierarchy": {
                "hierarchy_id": null,
                "level_name": null,
                "parent_level_id": null,
                "created_at": null
            }
        },
        "contact": {
            "contact_id": 5,
            "phone_number": "30218765432",
            "residential_phone": "3021666677",
            "email": "maria@email.gr",
            "created_at": "2023-10-06T01:04:58.000Z"
        },
        "document": {
            "document_id": 7,
            "cpf": "98765432109",
            "identity": "AG543210",
            "issue_date": "2003-10-18",
            "health_card": "123456789012345",
            "created_at": "2023-10-06T01:04:57.000Z"
        },
        "location": {
            "location_id": 5,
            "address": "AEGEAN AVENUE",
            "number": 72,
            "neighborhood": "MYKONOS",
            "city": "ATHENS",
            "zipcode": null,
            "state": "GR",
            "created_at": "2023-10-06T01:04:59.000Z"
        }
    }
}