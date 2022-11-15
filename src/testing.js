

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




process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', function(inputStdin) {
    inputString += inputStdin;
});

process.stdin.on('end', function() {
    inputString = inputString.split('\n');

    main();
});

function readLine() {
    return inputString[currentLine++];
}

/*
 * Complete the 'miniMaxSum' function below.
 *
 * The function accepts INTEGER_ARRAY arr as parameter.
 */

let arr = [1,2,3,4,5]

function miniMaxSum(arr) {
    // Write your code here
    const sorted = arr.sort()
    const min = sorted.slice(0,4).reduce((a,b) => a + b)
    const max = sorted.slice(1,5).reduce((a,b) => a + b)
    console.log(min, max)





}
miniMaxSum(arr)

function main() {

    const arr = readLine().replace(/\s+$/g, '').split(' ').map(arrTemp => parseInt(arrTemp, 10));

    miniMaxSum(arr);
}


/*
 * Complete the 'timeConversion' function below.
 *
 * The function is expected to return a STRING.
 * The function accepts STRING s as parameter.
 */

function timeConversion(s) {
    // Write your code here
    const time = s.split(':')
    const hour = time[0]
    const minute = time[1]
    const second = time[2].slice(0,2)
    const ampm = time[2].slice(2,4)
    if (ampm === 'PM') {
        if (hour === '12') {
            return `${hour}:${minute}:${second}`
        }
        return `${parseInt(hour) + 12}:${minute}:${second}`
    }
    if (hour === '12') {
        return `00:${minute}:${second}`
    }
    return `${hour}:${minute}:${second}`


}

/*
 * Complete the 'matchingStrings' function below.
 *
 * The function is expected to return an INTEGER_ARRAY.
 * The function accepts following parameters:
 *  1. STRING_ARRAY strings
 *  2. STRING_ARRAY queries
 */

function matchingStrings(strings, queries) {
    // Write your code here
    const result = []
    for (let i = 0; i < queries.length; i++) {
        let count = 0
        for (let j = 0; j < strings.length; j++) {
            if (queries[i] === strings[j]) {
                count++
            }
        }
        result.push(count)
    }
    return result

}

/*
 * Complete the 'lonelyinteger' function below.
 *
 * The function is expected to return an INTEGER.
 * The function accepts INTEGER_ARRAY a as parameter.
 */
let a = [1,2,3,4,3,2,1]


function lonelyinteger(a) {
    // Write your code here
    const sorted = a.sort()
    for (let i = 0; i < sorted.length; i++) {
        console.log(sorted[i] , sorted[i+1])
        if (sorted[i] !== sorted[i+1] && sorted[i] !== sorted[i-1]) {
            return sorted[i]
        }
    }



}
lonelyinteger(a)





