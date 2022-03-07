import {

    ITokenType,

  } from '@energyweb/ocn-bridge';

export const mockSessionDbData = [
    {
        "_id": 1,
        "country_code": "DE",
        "party_id": "CPO",
        "id": "e6cf5f5b-910b-4dfc-857d-432765762281",
        "sessionId": "6d6313b9-4134-40ef-b338-45b7116084c3",
        "currency": "EUR",
        "start_date_time": new Date("2022-03-07T19:00:58.485Z"),
        "end_date_time": null,
        "kwh": 0.01,
        "cdr_token": {
            "uid": "6d6313b9-4134-40ef-b338-45b7116084c3",
            "type": "AD_HOC_USER" as ITokenType,
            "contract_id": "DE-REB-6d6313b9-4134-40ef-b338-45b7116084c3"
        },
        "auth_method": "COMMAND",
        "authorization_method": null,
        "location_id": "Loc14",
        "evse_uid": "CH-CPO-S14E100001",
        "connector_id": "S14E1Con1",
        "meter_id": null,
        "charging_periods": null,
        "total_cost": null,
        "status": "ACTIVE",
        "last_updated": new Date("2022-03-07T19:00:59.489Z")
    },
    {
        "_id": 2,
        "country_code": "DE",
        "party_id": "CPO",
        "id": "e6cf5f5b-910b-4dfc-857d-432765762281",
        "sessionId": "6d6313b9-4134-40ef-b338-45b7116084c3",
        "currency": "EUR",
        "start_date_time": new Date("2022-03-07T19:00:58.485Z"),
        "end_date_time": null,
        "kwh": 0.09,
        "cdr_token": {
            "uid": "6d6313b9-4134-40ef-b338-45b7116084c3",
            "type": "AD_HOC_USER" as ITokenType,
            "contract_id": "DE-REB-6d6313b9-4134-40ef-b338-45b7116084c3"
        },
        "auth_method": "COMMAND",
        "authorization_method": null,
        "location_id": "Loc14",
        "evse_uid": "CH-CPO-S14E100001",
        "connector_id": "S14E1Con1",
        "meter_id": null,
        "charging_periods": null,
        "total_cost": null,
        "status": "ACTIVE",
        "last_updated": new Date("2022-03-07T19:01:13.451Z")
    },
    {
        "_id": 3,
        "country_code": "DE",
        "party_id": "CPO",
        "id": "e6cf5f5b-910b-4dfc-857d-432765762281",
        "sessionId": "6d6313b9-4134-40ef-b338-45b7116084c3",
        "currency": "EUR",
        "start_date_time": new Date("2022-03-07T19:00:58.485Z"),
        "end_date_time": null,
        "kwh": 0.18,
        "cdr_token": {
            "uid": "6d6313b9-4134-40ef-b338-45b7116084c3",
            "type": "AD_HOC_USER" as ITokenType,
            "contract_id": "DE-REB-6d6313b9-4134-40ef-b338-45b7116084c3"
        },
        "auth_method": "COMMAND",
        "authorization_method": null,
        "location_id": "Loc14",
        "evse_uid": "CH-CPO-S14E100001",
        "connector_id": "S14E1Con1",
        "meter_id": null,
        "charging_periods": null,
        "total_cost": null,
        "status": "ACTIVE",
        "last_updated": new Date("2022-03-07T19:01:28.453Z")
    },
    {
        "_id": 4,
        "country_code": "DE",
        "party_id": "CPO",
        "id": "e6cf5f5b-910b-4dfc-857d-432765762281",
        "sessionId": "6d6313b9-4134-40ef-b338-45b7116084c3",
        "currency": "EUR",
        "start_date_time": new Date("2022-03-07T19:00:58.485Z"),
        "end_date_time": null,
        "kwh": 0.27,
        "cdr_token": {
            "uid": "6d6313b9-4134-40ef-b338-45b7116084c3",
            "type": "AD_HOC_USER" as ITokenType,
            "contract_id": "DE-REB-6d6313b9-4134-40ef-b338-45b7116084c3"
        },
        "auth_method": "COMMAND",
        "authorization_method": null,
        "location_id": "Loc14",
        "evse_uid": "CH-CPO-S14E100001",
        "connector_id": "S14E1Con1",
        "meter_id": null,
        "charging_periods": null,
        "total_cost": null,
        "status": "ACTIVE",
        "last_updated": new Date("2022-03-07T19:01:43.419Z")
    },
    {
        "_id": 5,
        "country_code": "DE",
        "party_id": "CPO",
        "id": "e6cf5f5b-910b-4dfc-857d-432765762281",
        "sessionId": "6d6313b9-4134-40ef-b338-45b7116084c3",
        "currency": "EUR",
        "start_date_time": new Date("2022-03-07T19:00:58.485Z"),
        "end_date_time": null,
        "kwh": 0.36,
        "cdr_token": {
            "uid": "6d6313b9-4134-40ef-b338-45b7116084c3",
            "type": "AD_HOC_USER" as ITokenType,
            "contract_id": "DE-REB-6d6313b9-4134-40ef-b338-45b7116084c3"
        },
        "auth_method": "COMMAND",
        "authorization_method": null,
        "location_id": "Loc14",
        "evse_uid": "CH-CPO-S14E100001",
        "connector_id": "S14E1Con1",
        "meter_id": null,
        "charging_periods": null,
        "total_cost": null,
        "status": "ACTIVE",
        "last_updated": new Date("2022-03-07T19:01:58.422Z")
    },
    
]

export const mockCsvData = `_id,country_code,party_id,id,sessionId,currency,start_date_time,end_date_time,kwh,cdr_token,auth_method,authorization_method,location_id,evse_uid,connector_id,meter_id,charging_periods,total_cost,status,last_updated
1,DE,CPO,e6cf5f5b-910b-4dfc-857d-432765762281,6d6313b9-4134-40ef-b338-45b7116084c3,EUR,2022-03-07T19:00:58.485Z,,0.01,[object Object],COMMAND,,Loc14,CH-CPO-S14E100001,S14E1Con1,,,,ACTIVE,2022-03-07T19:00:59.489Z
2,DE,CPO,e6cf5f5b-910b-4dfc-857d-432765762281,6d6313b9-4134-40ef-b338-45b7116084c3,EUR,2022-03-07T19:00:58.485Z,,0.09,[object Object],COMMAND,,Loc14,CH-CPO-S14E100001,S14E1Con1,,,,ACTIVE,2022-03-07T19:01:13.451Z
3,DE,CPO,e6cf5f5b-910b-4dfc-857d-432765762281,6d6313b9-4134-40ef-b338-45b7116084c3,EUR,2022-03-07T19:00:58.485Z,,0.18,[object Object],COMMAND,,Loc14,CH-CPO-S14E100001,S14E1Con1,,,,ACTIVE,2022-03-07T19:01:28.453Z
4,DE,CPO,e6cf5f5b-910b-4dfc-857d-432765762281,6d6313b9-4134-40ef-b338-45b7116084c3,EUR,2022-03-07T19:00:58.485Z,,0.27,[object Object],COMMAND,,Loc14,CH-CPO-S14E100001,S14E1Con1,,,,ACTIVE,2022-03-07T19:01:43.419Z
5,DE,CPO,e6cf5f5b-910b-4dfc-857d-432765762281,6d6313b9-4134-40ef-b338-45b7116084c3,EUR,2022-03-07T19:00:58.485Z,,0.36,[object Object],COMMAND,,Loc14,CH-CPO-S14E100001,S14E1Con1,,,,ACTIVE,2022-03-07T19:01:58.422Z
`

