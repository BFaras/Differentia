import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import { UsernameValidateService } from './username-validate.service';
chai.use(chaiAsPromised);

describe('username valid service', () => {
    let usernameValidateService: UsernameValidateService;
    const usernameTooLong = '123456789';
    const usernameStartsWithSpace = ' valid';
    const validUsername = 'username';

    beforeEach(async () => {
        usernameValidateService = new UsernameValidateService();
    });

    afterEach(async () => {
        sinon.restore();
    });

    it('isUsernameTooLong() should return true with a username that is too long', () => {
        expect(usernameValidateService['isUsernameTooLong'](usernameTooLong)).to.equals(true);
    });

    it('isUsernameTooLong() should return false with a username that is not too long', () => {
        expect(usernameValidateService['isUsernameTooLong'](validUsername)).to.equals(false);
    });

    it('doesUsernameStartWithASpace() should return true with a username that starts with a space', () => {
        expect(usernameValidateService['doesUsernameStartWithASpace'](usernameStartsWithSpace)).to.equals(true);
    });

    it('doesUsernameStartWithASpace() should return false with a username that does not start with a space', () => {
        expect(usernameValidateService['doesUsernameStartWithASpace'](validUsername)).to.equals(false);
    });

    it('isUsernameValid() should return true with a valid username and call the two other methods', () => {
        const isUsernameTooLongSpy = sinon.spy(usernameValidateService, <any>'isUsernameTooLong');
        const doesUsernameStartWithASpaceSpy = sinon.spy(usernameValidateService, <any>'doesUsernameStartWithASpace');
        expect(usernameValidateService.isUsernameValid(validUsername)).to.equals(true);
        expect(isUsernameTooLongSpy.calledOnce);
        expect(doesUsernameStartWithASpaceSpy.calledOnce);
    });

    it('isUsernameValid() should return false with an unvalid username and call the two other methods', () => {
        const isUsernameTooLongSpy = sinon.spy(usernameValidateService, <any>'isUsernameTooLong');
        const doesUsernameStartWithASpaceSpy = sinon.spy(usernameValidateService, <any>'doesUsernameStartWithASpace');
        expect(usernameValidateService.isUsernameValid(usernameTooLong)).to.equals(false);
        expect(usernameValidateService.isUsernameValid(usernameStartsWithSpace)).to.equals(false);
        expect(isUsernameTooLongSpy.called);
        expect(doesUsernameStartWithASpaceSpy.called);
    });
});
