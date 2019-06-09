
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
        const cb = res => res.on('data', chunk => (data += chunk)).on('end', () => resolve(data));
        https.get(options, cb).on('error', e => reject(e, data));
    });
}

function check(imei){
    const prepare = result => ({...result, data: {...result.data, imei}});
    return request(imei).then( data => {
        return new Promise(function(resolve, reject){
            try {
                resolve(prepare(JSON.parse(data)))
            }
            catch(e) {
                console.log('dump:', data);
                reject(e, data)
            }
        })
    });
}


module.exports = check;
