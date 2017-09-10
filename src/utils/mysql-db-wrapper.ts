'use strict';
import * as mysql from 'mysql';
import * as nconf from 'nconf';

nconf.argv().env().file('server-config', 'server-config.json');

export class DbWrapper {

    private static getDBPath() {
        return nconf.get((process.env.NODE_ENV || "dev") + ':mysql');
    }

    public query(query): Promise<any> {
        return new Promise((resolve, reject) => {

            const db = mysql.createConnection(DbWrapper.getDBPath());
            db.connect(connectionError => {

                if (connectionError) {
                    reject(new Error(`ERRCONNMYSQL${connectionError.message}`));
                    return;
                }
                db.query(query, (queryingError, result) => {
                    if (queryingError) {
                        reject(new Error(`ERRQUERYMYSQL${queryingError.message ? '(' + queryingError.message + ')' : ''}`));
                    }
                    else {
                        resolve(result);
                    }
                    db.end();
                });
            });
        });
    }
}
