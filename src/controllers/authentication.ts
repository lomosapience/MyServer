'use strict';
import * as nconf from 'nconf';
import {DbWrapper} from "../utils/mysql-db-wrapper";

nconf.argv().env().file('server-config', 'server-config.json');

export class Authentication {

    private static dbWrapper: DbWrapper = new DbWrapper();

    public static login(req, res): void {
        let username: string = req.body.username;
        let password: string = req.body.password;
        let query = `SELECT 'Success' as status,
                            user_id,
                            name,
                            token
                     FROM
                            mydb.auth auth,
                                mydb.users us
                     WHERE
                            auth.user_id = us.id
                            AND name = '${username}'
                            AND password = '${password}'`;
        Authentication.dbWrapper.query(query).then(resp => {
            if (resp.length == 0) {
                throw new Error('Invalid username or password');
            }
            res.send(200, resp);
        }).catch(err => {
            res.send(402, err);
        })
    }

    public static test(req, res): void {
        console.log(req.body);
        res.send(200, req.body);
    }
}
