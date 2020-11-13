import {UserDocument} from "../../src/interfaces/models/userDocument";

declare global {
    namespace Express {
        export interface Request {
            currentUser: UserDocument;
        }
    }
}