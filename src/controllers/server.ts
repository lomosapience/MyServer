import {createServer, CORS, queryParser, bodyParser} from "restify";
import {Students} from "../actions/users-actions";
import {GoogleSpeech} from "../google-speech/google-speech";
import {Authentication} from "./authentication";
import {AwsTextToSpeech} from "../aws-speech/aws-text-to-speech/aws-text-to-speech";

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
            res.header('Access-Control-Allow-Credentials', 'true');
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

        this.server.post('/authentication', Authentication.login);
        this.server.get('/test', Authentication.test);

        let students: Students = new Students();
        this.server.get('/users', students.getUsers.bind(students));

        let googleSpeech: GoogleSpeech = new GoogleSpeech();
        this.server.get('/talk', googleSpeech.recognizeSpeech.bind(googleSpeech));

        let awsTextToSpeech: AwsTextToSpeech = new AwsTextToSpeech();
        this.server.post('/polly', awsTextToSpeech.textToSpeech.bind(awsTextToSpeech));

        this.server.listen(DEFAULT_PORT);
        console.log('Server started on port ' + DEFAULT_PORT);
    }
}