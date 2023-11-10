import * as fs from 'fs'

export default class Certificate {
    static config(dirname: string) {
        return {
            key: fs.readFileSync(dirname + '/certificates/ipma-key.pem'),
            cert: fs.readFileSync(dirname + '/certificates/ipma-cert.pem')
        }
    }
}