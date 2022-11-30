import { TestBed } from '@angular/core/testing';
import { EMPTY_SHOWABLE_TIME, LESS_THAN_10, MORE_THAN_9 } from '@app/const/client-consts';
import { Time } from '@common/time';
import { TimeService } from './time.service';

describe('TimeService', () => {
    let service: TimeService = new TimeService();
    const timeTest: Time = {
        minutes: 10,
        seconds: 10,
    };

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TimeService);
        service.time = {
            minutes: 0,
            seconds: 0,
        };
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should change time', () => {
        const oldTime = service.time;
        const showTimeSpy = spyOn(service, 'showTime');
        service.changeTime(timeTest);
        expect(service.time).not.toEqual(oldTime);
        expect(service.time).toEqual(timeTest);
        expect(showTimeSpy).toHaveBeenCalled();
    });

    it('should add a 0 to the seconds when they are lower than 10', () => {
        service.time.seconds = LESS_THAN_10;
        service.showSeconds();
        expect(service.showableSeconds).toEqual(`0${LESS_THAN_10}`);
    });

    it('should add a 0 to the minutes when they are lower than 10', () => {
        service.time.minutes = LESS_THAN_10;
        service.showMinutes();
        expect(service.showableMinutes).toEqual(`0${LESS_THAN_10}`);
    });

    it('should not add a 0 to the seconds when they are higher than 9', () => {
        service.time.seconds = MORE_THAN_9;
        service.showSeconds();
        expect(service.showableSeconds).toEqual(MORE_THAN_9.toString());
    });

    it('should not add a 0 to the minutes when they are higher than 9', () => {
        service.time.minutes = MORE_THAN_9;
        service.showMinutes();
        expect(service.showableMinutes).toEqual(MORE_THAN_9.toString());
    });

    it('should update the showable minutes and seconds when showTime is called', () => {
        const showMinutesSpy = spyOn(service, 'showMinutes');
        const showSecondsSpy = spyOn(service, 'showSeconds');
        service.showTime();
        expect(showMinutesSpy).toHaveBeenCalled();
        expect(showSecondsSpy).toHaveBeenCalled();
    });

    it('should reset the showable minutes and seconds to 00', () => {
        service.time.minutes = MORE_THAN_9;
        service.time.seconds = MORE_THAN_9;
        service.resetTime();
        expect(service.showableMinutes).toEqual(EMPTY_SHOWABLE_TIME);
        expect(service.showableSeconds).toEqual(EMPTY_SHOWABLE_TIME);
    });
});
