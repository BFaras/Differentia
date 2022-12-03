import { MAX_USERNAME_LENGTH, SPACE } from '@app/server-consts';
import { Service } from 'typedi';

@Service()
export class UsernameValidateService {
    constructor() {}

    isUsernameValid(username: string): boolean {
        return !(this.isUsernameTooLong(username) || this.doesUsernameStartWithASpace(username));
    }

    private isUsernameTooLong(username: string): boolean {
        return username.length > MAX_USERNAME_LENGTH;
    }

    private doesUsernameStartWithASpace(username: string): boolean {
        return username.charAt(0) === SPACE;
    }
}
