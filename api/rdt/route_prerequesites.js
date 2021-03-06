const replyHelper = require('../helpers')


const countRdtCode = server =>{
    return {
        method: (request, reply) => {
            server.methods.services.rdt.getCountRdtCode(
                (err, count) => {
                    if (err) {
                        return reply(replyHelper.constructErrorResponse(err)).takeover()
                    }
                    return reply(count)
                })
        },
        assign: 'count_rdt'
    }
}


const getRdtbyId = server => {
    return {
        method: (request, reply) => {
             let id = request.params.id
             server.methods.services.rdt.getById(id, (err, item) => {
                 if (err) return reply(replyHelper.constructErrorResponse(err)).code(422)
                 return reply(item)
             })
        },
        assign: 'rdt'
    }
}


module.exports ={
    countRdtCode,
    getRdtbyId
}
