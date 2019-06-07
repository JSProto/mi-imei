
const https = require('https');
const HOSTNAME = 'i.mi.com';
const PATH = '/support/anonymous/status';

function request(id) {
    const options = {
        hostname: HOSTNAME,
        path: `${PATH}?id=${id}`,
        method: 'GET',
        headers: {
            'user-agent': 'Mozilla/5.0'
        }
    };

    return new Promise(function(resolve, reject){
        let data = '';
        const cb = res => res.on('data', chunk => (data += chunk)).on('end', () => resolve(JSON.parse(data)));
        https.get(options, cb).on('error', e => reject(e, data));
    });
}

function get(imei){
    const prepare = result => ({...result, data: {...result.data, imei}});
    return request(imei).then(prepare).catch(function(e, data){
        console.error('error response: ', imei)
        console.log(data)
    });
}

function check(imei){
    if (!Array.isArray(imei)) {
        imei = [imei]
    }

    return imei.reduce((p, i) => {
        return p.then((total) => get(i).then(result => [ ...total, result ]));
    }, Promise.resolve([]));
}

module.exports = check;
