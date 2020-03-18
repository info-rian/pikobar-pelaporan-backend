const mongoose = require('mongoose');

require('../models/Case');
const Case = mongoose.model('Case');

require('../models/History')
const History = mongoose.model('History')

require('../models/DistrictCity')
const DistrictCity = mongoose.model('Districtcity')

function ListCase (query,callback) {

  const myCustomLabels = {
    totalDocs: 'itemCount',
    docs: 'itemsList',
    limit: 'perPage',
    page: 'currentPage',
    meta: '_meta'
  };

  const options = {
    page: query.page,
    limit: query.limit,
    address_district_code: query.address_district_code,
    sort: { createdAt: query.sort },
    leanWithId: true,
    customLabels: myCustomLabels
  };

  let query_search = new RegExp(query.search, "i")

  if(query.address_district_code){
    var result_search = Case.find({ address_district_code: query.address_district_code })
  }else{
    var result_search = Case.find({ name: query_search })
  }

  Case.paginate(result_search, options).then(function(results){
      let res = {
        cases: results.itemsList.map(cases => cases.toJSONFor()),
        _meta: results._meta
      }
      return callback(null, res)
  }).catch(err => callback(err, null))
}

function getCaseById (id, callback) {
  Case.findOne({_id: id})
    .populate('author')
    .populate('last_history')
    .exec()
    .then(cases => callback (null, cases))
    .catch(err => callback(err, null));
}


function getCaseSummary (callback) {
  let agg = [
    {$group: {
      _id: "$last_status",
      total: {$sum: 1}
    }}
  ];

  let result =  {'ODP':0, 'PDP':0, 'POSITIF':0}

  Case.aggregate(agg).exec().then(item => {
      item.forEach(function(item){
        if (item['_id'] == 'ODP') {
          result.ODP = item['total']
        }
        if (item['_id'] == 'PDP') {
          result.PDP = item['total']
        }
        if (item['_id'] == 'POSITIF') {
          result.POSITIF = item['total']
        }
      });

      return callback(null, result)
    })
    .catch(err => callback(err, null))
}

function createCase (raw_payload, author, pre, callback) {

  let date = new Date().getFullYear().toString()
  let counter = (pre.count_pasien + 1)
  let id_case = "Covid-"
      id_case += pre.dinkes_code
      id_case += date.substr(2, 2)
      id_case += "0".repeat(4 - counter.toString().length)
      id_case += counter

  let inset_id_case = Object.assign(raw_payload, {id_case})
  let item = new Case(Object.assign(inset_id_case, {author}))

  item.save().then(x => { // step 1 : create dan save case baru
    let c = {case: x._id}
    let history = new History(Object.assign(raw_payload, c))
    history.save().then(last => { // step 2: create dan save historuy baru jangan lupa di ambil object id case
      let last_history = { last_history: last._id }
      x = Object.assign(x, last_history)
      x.save().then(final =>{ // step 3: udpate last_history di case ambil object ID nya hitory
        return callback(null, final)
      })
    })
   }).catch(err => callback(err, null))
}

function updateCase (id_case, payload, callback) {
  Case.findOneAndUpdate({ id_case: id_case}, { $set: clean_input(payload) }, { new: true })
  .then(result => {
    return callback(null, result);
  }).catch(err => {
    return callback(null, err);
  })
}

function getCountByDistrict(code, callback) {
  DistrictCity.findOne({ kemendagri_kabupaten_kode: code})
              .exec()
              .then(dinkes =>{

                Case.find({ address_district_code: code})
                    .exec()
                    .then(res =>{
                        let count = res.length
                        let result = {
                          prov_city_code: code,
                          dinkes_code: dinkes.dinkes_kota_kode,
                          count_pasien: count
                        }
                      return callback(null, result)
                    }).catch(err => callback(err, null))
              })

}



module.exports = [
  {
    name: 'services.cases.list',
    method: ListCase
  },
  {
    name: 'services.cases.getById',
    method: getCaseById
  },
  {
    name: 'services.cases.getSummary',
    method: getCaseSummary
  },
  {
    name: 'services.cases.create',
    method: createCase
  },
  {
    name: 'services.cases.update',
    method: updateCase
  },
  {
    name: 'services.cases.getCountByDistrict',
    method: getCountByDistrict
  }
];
