import { AsyncSubject, ReplaySubject, BehaviorSubject, Subject } from 'rxjs'

// 'observable', 'observer', 'subjects', etc. are all just words for things that listen and things that speak
// when you 'subscribe' to and 'observable' youre simply listening for the things that it's saying
// when you 'emit' from an 'observer' you speak through it 
// a subject is able to be listened to and spoken through

// The key to a subject's power is it's ability to both be subscribed to and emit data (be listened to and spoken through)
// Unlike a regular Observable, who does not have a .next() function of its own (observables can only be listened to), a subject can 
// utilize operators and emit data at the same time (listen to and interpret/mutate information, and send information out)

console.log("SCENE 1: THE VOUYER AND THE PASSERBY")
// a subject is an observer / observer bundled in one
// its an observer that can also emit functions
// regular subjects do not repeat themselves to new observers, whatever messages the subject sent before an observer subscribes to it are lost to the newly subscribed observer
let lady = new Subject()

let vouyer = lady.subscribe(
    (nextData: any) => {
        console.log(`vouyer heard: ${nextData}`)
    },
    (error: any) => {
        console.log(`vouyer heard ERROR: ${error.message}`)
    },
    () => {
        console.log('The lady stopped talking and the vouyer went on')
    }
)

lady.next(`here's some data you nasty vouyer`)

let passerby = lady.subscribe(
    (nextData: any) => {
        console.log(`passerby heard: ${nextData}`)
    },
    (error: any) => {
        console.log(`passerby heard ERROR: ${error.message}`)
    },
    () => {
        console.log('passerby heard the lady stop talking')
    }
)

lady.next('oh jeez another one came along, now both of you can see me!')
lady.next(`Take a picture! It'll last longer!`)

passerby.unsubscribe(); // passerby walks off, no longer apart of the conversation

lady.next('yea you better run you creep!')
lady.complete() // complete means absolutely no more messages will be coming from this subject

console.log("\nSCENE 2: THE TOWN CRIER AND VILLAGER HANK")

// A BehaviourSubject repeats the last message it sent to any new subscribers

// the subject can be passed an initial message, similar to react state initial value ( ... = useState(<initialValue>) )
let townCrier = new BehaviorSubject('Hear ye! Hear ye! come one come all! I have news!')

townCrier.next('Come on people! Listen to me!') // this message wont be seen by any of our below villagers (observers) because the subsequent next() will be counted as the last message prior to subscribing
townCrier.next('Hey you! come over here!')

let villagerHank = townCrier.subscribe(
    (nextData: any) => {
        console.log(`Hank heard: ${nextData}`)
    }
)

// notice we dont complete here, the town crier is just taking a break! he cold always start talking again later
// if we want to shut him up for good we need to use .complete()

console.log("\nSCENE 3: DORRIS, HER HARD-OF-HEARING HUSBAND JOHNNY")
// ReplaySubject allows us to set a buffer of data that will be sent to any new observer

let dorris = new ReplaySubject(2); // you need to specify the buffer, dorris will only repeat the last 2 things she said to any new observer

dorris.next('hey Johnny did you take out the trash?') // johnny isn't going to hear these because he'll only receive the last 2 things dorris said
dorris.next('how about the dishes, are they clean?')  // * 
dorris.next('are you even listening to me?')
dorris.next('what did I say?')

let johnny = dorris.subscribe( 
    (nextData: any) => {
        console.log(`Johnny heard: ${nextData}`)
    }
)

dorris.complete() // dorris stopped talking, johnny doesn't have a handler for that but it doesn't matter; he's barely paying attention anyway!

console.log('\nSCENE 4: MAKING A PIZZA')
// AsyncSubject only emits the very last value and only emits upon complete() being called
let papaJohn = new AsyncSubject()

let hungryCustomer = papaJohn.subscribe(
    (nextData: any) => {
        console.log(`Hungry Customer heard: ${nextData}`)
    },
    (error: any) => {
        console.log(`Hungry Customer got an error: ${error.message}`)
    },
    () => { // onComplete
        console.log("The papa gave hungry customer the food!")
    }
)

papaJohn.next("First you make the pizza")
papaJohn.next("Then you bless the papa")
papaJohn.next("Now you eat!")
papaJohn.complete()



console.log("\nSCENE 5: BILLYS ALARM CLOCK")
// ReplaySubjects can also be given buffer times in milliseconds as the second argument.
// The below represents 'replay the last 5 messages received in the last 200 milliseconds'

let alarmClock = new ReplaySubject(5, 200)

let billy = null as any; // billy is asleep

let billysDog = alarmClock.subscribe(
    (nextData: any) => {
        console.log(`Billy's Dog heard: ${nextData}`)
    }
) // Billy's dog will hear all of the alarm rings while billy will only hear the last 5 

setTimeout(() => {
    billy = alarmClock.subscribe( 
        (nextData: any) => {
            console.log(`Billy heard: ${nextData}`)
        }
    )
}, 500) // it takes billy 500 milliseconds to realize he's hearing his alarm and wake up
// 500 - 200 = 300 / 50 = billy will wake up on the 10th alarm and realized he heard the last few in his dream


let amtAlarmRings = 0; 
const ringAlarm = setInterval(() => { // the alarm will beep every 50 milliseconds
    if(amtAlarmRings >= 15) { // after 15 rings the alarm clock will turn off
        alarmClock.complete()
        console.log("The alarm clock automatically turned off")
        clearInterval(ringAlarm);
    }
    amtAlarmRings++;
    alarmClock.next(`BEEP ${amtAlarmRings}`)
}, 50)
