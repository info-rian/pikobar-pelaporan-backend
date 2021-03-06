module.exports = (server) =>{
    const handlers = require('./handlers')(server)
    const inputValidations = require('./validations/input')
    const outputValidations = require('./validations/output') 

    return [
        {
            method: 'GET',
            path: '/areas/district-city',
            config: {
                auth: 'jwt',
                description: 'show city in west java areas',
                tags: ['api', 'areas'],
                // validate: inputValidations,
                // response: outputValidations
            },
            handler: handlers.DistrictCity
        },
        {
            method: 'GET',
            path: '/areas/sub-district/{city_code}',
            config: {
                auth: 'jwt',
                description: 'show districs in west java areas',
                tags: ['api', 'areas'],
                // validate: inputValidations,
                // response: outputValidations
            },
            handler: handlers.SubDistrict
        },
        {
            method: 'GET',
            path: '/areas/sub-district-detail/{sub_district_code}',
            config: {
                auth: 'jwt',
                description: 'show sub districs detail',
                tags: ['api', 'areas'],
                // validate: inputValidations,
                // response: outputValidations
            },
            handler: handlers.SubDistrictDetail
        },
        {
            method: 'GET',
            path: '/areas/village/{district_code}',
            config: {
                auth: 'jwt',
                description: 'show villege in west java areas',
                tags: ['api', 'areas'],
                // validate: inputValidations,
                // response: outputValidations
            },
            handler: handlers.Village
        },
        {
            method: 'GET',
            path: '/areas/village-detail/{village_code}',
            config: {
                auth: 'jwt',
                description: 'show villege detail',
                tags: ['api', 'areas'],
                // validate: inputValidations,
                // response: outputValidations
            },
            handler: handlers.VillageDetail
        },
        {
            method: 'GET',
            path: '/areas/hospital',
            config: {
                auth: 'jwt',
                description: 'get hospitals in west java',
                tags: ['api', 'areas'],
                // validate: inputValidations,
                // response: outputValidations
            },
            handler: handlers.Hospital
        }
    ]

}