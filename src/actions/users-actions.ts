import {DbWrapper} from '../utils/mysql-db-wrapper';

export class Students {

    private dbWrapper: DbWrapper;

    constructor() {
        this.dbWrapper = new DbWrapper();
    }

    getUsers(req, res): void {
        let query = 'SELECT u.id, u.name, g.name AS groupname, IFNULL(followers, 0) AS followers, (select count(*) from mydb.followings where id_user = 1 and id_followed = u.id) ' +
                    'as followed '+
                    'FROM mydb.users u ' +
                    'JOIN mydb.groups g ' +
                    'ON u.group_id = g.id ' +
                    'LEFT JOIN ' +
                    '(SELECT id_followed as id, ' +
                    'count(*) as followers ' +
                    'FROM mydb.followings ' +
                    'GROUP BY id_followed) f ' +
                    'ON u.id = f.id';
        this.dbWrapper.query(query).then(resp => {
            res.send(200, resp);
        }).catch(err => {
            res.send(500, err);
        })
    }

    follow(req, res): void {
        let query = 'insert into mydb.folllowings(id_user, id_followed) values( ' + req.body.id_user + ', ' + req.body.id_followed + ')';
        this.dbWrapper.query(query).then(resp => {
            res.send(200, resp);
        }).catch(err => {
            res.send(500, err);
        })
    }

}
