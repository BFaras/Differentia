import { TestBed } from '@angular/core/testing';
import { Time } from '@common/time';
import { TimeService } from './time.service';
import * as sinon from 'sinon';

const LESS_THAN_10 = 5;
const MORE_THAN_9 = 10;

describe('TimeService', () => {
  let service: TimeService = new TimeService();
  service.time = {
    minutes: 0,
    seconds: 0
  };
  let timeTest: Time = {
    minutes: 10,
    seconds: 10
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set the time to 0 minutes and 0 seconds and showableMinutes/showableSeconds to 00 on classic mode', () => {
    service.classicMode();
    expect(service.time.seconds).toEqual(0);
    expect(service.time.minutes).toEqual(0);
    expect(service.showableMinutes).toEqual("00");
    expect(service.showableSeconds).toEqual("00");
  });

  it('should change time', () => {
    const oldTime = service.time;
    service.changeTime(timeTest);
    expect(service.time).not.toEqual(oldTime);
  });

  it('should add a 0 to the seconds when they are lower than 10', () => {
    service.classicMode();
    service.time.seconds = LESS_THAN_10;
    service.showSeconds();
    expect(service.showableSeconds).toEqual(`0${LESS_THAN_10}`);
  });

  it('should add a 0 to the minutes when they are lower than 10', () => {
    service.classicMode();
    service.time.minutes = LESS_THAN_10;
    service.showMinutes();
    expect(service.showableMinutes).toEqual(`0${LESS_THAN_10}`);
  });

  it('should not add a 0 to the seconds when they are higher than 9', () => {
    service.classicMode();
    service.time.seconds = MORE_THAN_9;
    service.showSeconds();
    expect(service.showableSeconds).toEqual(MORE_THAN_9.toString());
  });

  it('should not add a 0 to the minutes when they are higher than 9', () => {
    service.classicMode();
    service.time.minutes = MORE_THAN_9;
    service.showMinutes();
    expect(service.showableMinutes).toEqual(MORE_THAN_9.toString());
  });

  it('should update the showable minutes and seconds when showTime is called', () => {
    service.classicMode();
    const minutesSpy = sinon.spy(service, 'showMinutes');
    const secondsSpy = sinon.spy(service, 'showSeconds');
    service.showTime();
    expect(minutesSpy.calledOnce);
    expect(secondsSpy.calledOnce);
  });

});