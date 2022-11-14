const notificationState =  [
    {
        "type": "task",
        "sender": {
            "id": "635823b21ee5f5b57699c26f"
        },
        "receiver": {
            "id": "635823b21ee5f5b57699c26f"
        },
        "activityId": "434",
        "liked": false,
        "message": "Complete Cardio: TREADMILL.",
        "is_read": false,
        "createdAt": "11/13/2022, 4:19:28 PM",
        "_id": "63715f60485eb9943f16c6a1",
        "__v": 0
    },
    {
        "type": "task",
        "sender": {
            "id": "635823b21ee5f5b57699c26f"
        },
        "receiver": {
            "id": "635823b21ee5f5b57699c26f"
        },
        "activityId": "333",
        "liked": false,
        "message": "Complete Cardio: TREADMILL.",
        "is_read": false,
        "createdAt": "11/13/2022, 4:19:28 PM",
        "_id": "63715f60485eb9943f16c6a1",
        "__v": 0
    },

]

const calendar = [
    {
        "_id": "63715660485eb9943f16c304",
        "type": "task",
        "clientId": "635823b21ee5f5b57699c26f",
        "title": "Workout: LEGS - CHRISTIE",
        "end": "2022-11-15T05:00:00.000Z",
        "activityId": "6345675c9dd0b9048289d948",
        "created": "11/13/2022, 3:41:04 PM",
        "__v": 0
    },
    {
        "_id": "63715f5c485eb9943f16c691",
        "type": "task",
        "clientId": "635823b21ee5f5b57699c26f",
        "title": "Cardio: TREADMILL",
        "end": "2022-11-10T05:00:00.000Z",
        "activityId": "6345e2af76894e52943a583f",
        "created": "11/13/2022, 4:19:24 PM",
        "__v": 0
    }
]
const today = new Date().getTime();

// filter notifications calendar that are past due. and make sure they dont exist in state
const filteredNotifications = calendar.filter((notification) => {
    const notificationDate = new Date(notification.end).getTime();
    return notificationDate < today && !notificationState.find((event) => event.activityId === notification.activityId);
});
filteredNotifications


const overdue = calendar.filter((item) => new Date(item.end).getTime() < today);

    




    
console.log(overdue);
   
overdue.length