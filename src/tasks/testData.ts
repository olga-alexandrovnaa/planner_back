import { TaskExt } from "./entities/task-ext.entity";

const task = {
  "id": 0,
  "date": "2023-10-31T21:00:00.000Z",
  "ingredients": [],
  "isDeleted": false,
  "isFood": false,
  "isTracker": false,
  "name": "1",
  "repeatDays": [],
  "repeatIfYearIntervalDays": [],
  "taskRepeatDayCheck": [
    {
      "id": 0,
      "checked": false,
      "date": "2023-10-31T21:00:00.000Z",
      "deadline": null,
      "isDeleted": false,
      "moneyIncomeFact": null,
      "moneyOutcomeFact": null,
      "newDate": null,
      "note": "",
      "trackerId": 0,
    },
  ],
};

//каждый день - деф
const trackerDay1 = {
  "id": 0,
  "date": "2023-10-31T21:00:00.000Z",
  "ingredients": [],
  "isDeleted": false,
  "isFood": false,
  "isTracker": true,
  "name": "каждый день",
  "intervalPart": "Day",
  "intervalLength": 1,
  "repeatDays": [],
  "repeatIfYearIntervalDays": [],
  "taskRepeatDayCheck": [
    {
      "id": 0,
      "checked": false,
      "date": "2023-10-31T21:00:00.000Z",
      "deadline": null,
      "isDeleted": false,
      "moneyIncomeFact": null,
      "moneyOutcomeFact": null,
      "newDate": null,
      "note": "",
      "trackerId": 0,
    },
  ],
};

//каждые 2 дня, 5 раз
const trackerDay2 = {
  "id": 0,
  "date": "2023-10-31T21:00:00.000Z",
  "ingredients": [],
  "isDeleted": false,
  "isFood": false,
  "isTracker": true,
  "name": "каждые 2 дня, 5 раз",
  "intervalPart": "Day",
  "intervalLength": 2,
  "repeatCount": 5,
  "repeatDays": [],
  "repeatIfYearIntervalDays": [],
  "taskRepeatDayCheck": [
    {
      "id": 0,
      "checked": false,
      "date": "2023-10-31T21:00:00.000Z",
      "deadline": null,
      "isDeleted": false,
      "moneyIncomeFact": null,
      "moneyOutcomeFact": null,
      "newDate": null,
      "note": "",
      "trackerId": 0,
    },
  ],
};

//каждые 3 дня
const trackerDay3 = {
  "id": 0,
  "date": "2023-10-31T21:00:00.000Z",
  "ingredients": [],
  "isDeleted": false,
  "isFood": false,
  "isTracker": true,
  "name": "каждые 3 дня",
  "intervalPart": "Day",
  "intervalLength": 3,
  "repeatDays": [],
  "repeatIfYearIntervalDays": [],
  "taskRepeatDayCheck": [
    {
      "id": 0,
      "checked": false,
      "date": "2023-10-31T21:00:00.000Z",
      "deadline": null,
      "isDeleted": false,
      "moneyIncomeFact": null,
      "moneyOutcomeFact": null,
      "newDate": null,
      "note": "",
      "trackerId": 0,
    },
  ],
};

//каждую неделю по средам
const trackerWeek1 = {
  "id": 0,
  "date": "2023-10-31T21:00:00.000Z",
  "ingredients": [],
  "isDeleted": false,
  "isFood": false,
  "isTracker": true,
  "name": "каждую неделю по средам",
  "intervalPart": "Week",
  "intervalLength": 1,
  "repeatDays": [
    {
      "id": 0,
      "trackerId": 0,
      "intervalPartIndex": 1,
      "dayFromBeginningInterval": 2, //среда - текущий день недели
      "weekDayNumber": null,
      "weekNumber": null,
      "moveTypeIfDayNotExists": null,
    },
  ],
  "repeatIfYearIntervalDays": [],
  "taskRepeatDayCheck": [
    {
      "id": 0,
      "checked": false,
      "date": "2023-10-31T21:00:00.000Z",
      "deadline": null,
      "isDeleted": false,
      "moneyIncomeFact": null,
      "moneyOutcomeFact": null,
      "newDate": null,
      "note": "",
      "trackerId": 0,
    },
  ],
};
//каждые 2 недели по ср и пн (в чет нед по пт), 3 раза
const trackerWeek2 = {
  "id": 0,
  "date": "2023-10-31T21:00:00.000Z",
  "ingredients": [],
  "isDeleted": false,
  "isFood": false,
  "isTracker": true,
  "name": "каждые 2 недели по ср и пн (в чет нед по пт), 3 раза",
  "intervalPart": "Week",
  "intervalLength": 2,
  "repeatCount": 3,
  "repeatDays": [
    {
      "id": 0,
      "trackerId": 0,
      "intervalPartIndex": 1,
      "dayFromBeginningInterval": 2, //среда - текущий день недели
      "weekDayNumber": null,
      "weekNumber": null,
      "moveTypeIfDayNotExists": null,
    },
    {
      "id": 0,
      "trackerId": 0,
      "intervalPartIndex": 1,
      "dayFromBeginningInterval": 0,
      "weekDayNumber": null,
      "weekNumber": null,
      "moveTypeIfDayNotExists": null,
    },
    {
      "id": 0,
      "trackerId": 0,
      "intervalPartIndex": 2,
      "dayFromBeginningInterval": 4,
      "weekDayNumber": null,
      "weekNumber": null,
      "moveTypeIfDayNotExists": null,
    },
  ],
  "repeatIfYearIntervalDays": [],
  "taskRepeatDayCheck": [
    {
      "id": 0,
      "checked": false,
      "date": "2023-10-31T21:00:00.000Z",
      "deadline": null,
      "isDeleted": false,
      "moneyIncomeFact": null,
      "moneyOutcomeFact": null,
      "newDate": null,
      "note": "",
      "trackerId": 0,
    },
  ],
};

//каждый месяц по 1 числам
const trackerMonth1 = {
  "id": 0,
  "date": "2023-10-31T21:00:00.000Z",
  "ingredients": [],
  "isDeleted": false,
  "isFood": false,
  "isTracker": true,
  "name": "каждый месяц по 1 числам",
  "intervalPart": "Month",
  "intervalLength": 1,
  "repeatDays": [
    {
      "id": 0,
      "trackerId": 0,
      "intervalPartIndex": 1,
      "dayFromBeginningInterval": 1, //среда - текущий день недели
      "weekDayNumber": null,
      "weekNumber": null,
      "moveTypeIfDayNotExists": null,
    },
  ],
  "repeatIfYearIntervalDays": [],
  "taskRepeatDayCheck": [
    {
      "id": 0,
      "checked": false,
      "date": "2023-10-31T21:00:00.000Z",
      "deadline": null,
      "isDeleted": false,
      "moneyIncomeFact": null,
      "moneyOutcomeFact": null,
      "newDate": null,
      "note": "",
      "trackerId": 0,
    },
  ],
};

//каждые 3 месяца по 1 и 31 числам (переносить на конец мес)
const trackerMonth2 = {
  "id": 0,
  "date": "2023-10-31T21:00:00.000Z",
  "ingredients": [],
  "isDeleted": false,
  "isFood": false,
  "isTracker": true,
  "name": "каждые 3 месяца по 1 и 31 числам (переносить на конец мес)",
  "intervalPart": "Month",
  "intervalLength": 3,
  "repeatDays": [
    {
      "id": 0,
      "trackerId": 0,
      "intervalPartIndex": 1,
      "dayFromBeginningInterval": 1, //среда - текущий день недели
      "weekDayNumber": null,
      "weekNumber": null,
      "moveTypeIfDayNotExists": null,
    },
    {
      "id": 0,
      "trackerId": 0,
      "intervalPartIndex": 1,
      "dayFromBeginningInterval": 31, //среда - текущий день недели
      "weekDayNumber": null,
      "weekNumber": null,
      "moveTypeIfDayNotExists": "currentIntervalLastDay",
    },
  ],
  "repeatIfYearIntervalDays": [],
  "taskRepeatDayCheck": [
    {
      "id": 0,
      "checked": false,
      "date": "2023-10-31T21:00:00.000Z",
      "deadline": null,
      "isDeleted": false,
      "moneyIncomeFact": null,
      "moneyOutcomeFact": null,
      "newDate": null,
      "note": "",
      "trackerId": 0,
    },
  ],
};

//каждый месяц по первым понедельникам, 2 раза
const trackerMonth3 = {
  "id": 0,
  "date": "2023-10-31T21:00:00.000Z",
  "ingredients": [],
  "isDeleted": false,
  "isFood": false,
  "isTracker": true,
  "name": "каждый месяц по первым понедельникам, 2 раза",
  "intervalPart": "Month",
  "intervalLength": 1,
  "repeatCount": 2,
  "repeatDays": [
    {
      "id": 0,
      "trackerId": 0,
      "intervalPartIndex": 1,
      "dayFromBeginningInterval": null,
      "weekDayNumber": 0,
      "weekNumber": "first",
      "moveTypeIfDayNotExists": null,
    },
  ],
  "repeatIfYearIntervalDays": [],
  "taskRepeatDayCheck": [
    {
      "id": 0,
      "checked": false,
      "date": "2023-10-31T21:00:00.000Z",
      "deadline": null,
      "isDeleted": false,
      "moneyIncomeFact": null,
      "moneyOutcomeFact": null,
      "newDate": null,
      "note": "",
      "trackerId": 0,
    },
  ],
};

//каждый месяц по вторым вт и последним пт
const trackerMonth4 = {
  "id": 0,
  "date": "2023-10-31T21:00:00.000Z",
  "ingredients": [],
  "isDeleted": false,
  "isFood": false,
  "isTracker": true,
  "name": "каждый месяц по вторым вт и последним пт",
  "intervalPart": "Month",
  "intervalLength": 1,
  "repeatDays": [
    {
      "id": 0,
      "trackerId": 0,
      "intervalPartIndex": 1,
      "dayFromBeginningInterval": null,
      "weekDayNumber": 1,
      "weekNumber": "second",
      "moveTypeIfDayNotExists": null,
    },
    {
      "id": 0,
      "trackerId": 0,
      "intervalPartIndex": 1,
      "dayFromBeginningInterval": null,
      "weekDayNumber": 4,
      "weekNumber": "last",
      "moveTypeIfDayNotExists": null,
    },
  ],
  "repeatIfYearIntervalDays": [],
  "taskRepeatDayCheck": [
    {
      "id": 0,
      "checked": false,
      "date": "2023-10-31T21:00:00.000Z",
      "deadline": null,
      "isDeleted": false,
      "moneyIncomeFact": null,
      "moneyOutcomeFact": null,
      "newDate": null,
      "note": "",
      "trackerId": 0,
    },
  ],
};

//каждый год 1.11, 29.02 (01.03)
const trackerYear1 = {
  "id": 0,
  "date": "2023-10-31T21:00:00.000Z",
  "ingredients": [],
  "isDeleted": false,
  "isFood": false,
  "isTracker": true,
  "name": "каждый год 1.11, 29.02 (01.03)",
  "intervalPart": "Year",
  "intervalLength": 1,
  "repeatDays": [],
  "repeatIfYearIntervalDays": [
    {
      "id": 0,
      "trackerId": 0,
      "intervalPartIndex": 1,
      "yearDateMonth": 10,
      "yearDateDay": 1,
      "moveTypeIfDayNotExists": null,
    },
    {
      "id": 0,
      "trackerId": 0,
      "intervalPartIndex": 1,
      "yearDateMonth": 1,
      "yearDateDay": 29,
      "moveTypeIfDayNotExists": "nextIntervalFirstDay",
    },
  ],
  "taskRepeatDayCheck": [
    {
      "id": 0,
      "checked": false,
      "date": "2023-10-31T21:00:00.000Z",
      "deadline": null,
      "isDeleted": false,
      "moneyIncomeFact": null,
      "moneyOutcomeFact": null,
      "newDate": null,
      "note": "",
      "trackerId": 0,
    },
  ],
};
