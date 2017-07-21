import {createServer, CORS, queryParser, bodyParser} from "restify";
import {Students} from "../actions/users-actions";

const DEFAULT_PORT = 4000;

export class Server {

    public server;

    run() {
        this.server = createServer();

        this.server.use(CORS({
            credentials: true
        }));

        this.server.opts(/\.*/, (req, res, next) => {
            res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            res.header('Access-Control-Allow-Origin', 'http://localhost:4200');

            res.send(200);
            next();
        });


        this.server.use(queryParser());
        this.server.use(bodyParser({
            keepExtensions: true
        }));

        this.server.get('/', (req, res) => {
            res.send('hello My Server');
        });

        let students: Students = new Students();
        this.server.get('/users', students.getUsers.bind(students));

        this.server.listen(DEFAULT_PORT);
        console.log('Server started on port ' + DEFAULT_PORT);
    }
}