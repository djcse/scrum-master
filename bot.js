// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler } = require('botbuilder');

class MyBot extends ActivityHandler {
    constructor() {
        super();
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {
            await context.sendActivity(`You said '${ context.activity.text }'`);

            var datetime = new Date();
            var hr = new Date().getHours();
            var min = new Date().getMinutes();
            var date = new Date().getDate();
            var day = new Date().getDay();


            // console.log(datetime);
            await context.sendActivity(`${ datetime}`);
            await context.sendActivity(`${ hr}`);
            await context.sendActivity(`${ min}`);
            await context.sendActivity(`${ date}`);
            await context.sendActivity(`${ day}`);

            const fs = require('fs');

            try {  
                var data = fs.readFileSync('employee.json');
                // console.log(data.toString());  
                let employee = JSON.parse(data);
                // console.log(employee.people);
                let people = employee.people;
                let curr_person = ""
                var flag = 0;
                // console.log(employee.people[0].name);
                for (var x in employee.people){
                    // console.log(employee.people[x].name);
                    // console.log(people[x].PresenceStatus);                        
                    // console.log(people[x].Status);

                    if(employee.people[x].Status=="0" && employee.people[x].PresenceStatus=="1"){
                        curr_person = employee.people[x].name;
                        flag = 1;
                        // console.log(employee.people[x].name);
                        employee.people[x].Status = 1;
                        break;
                    }
                }
                if(flag==0){
                    for (var x in employee.people){
                        employee.people[x].Status = "0";
                    }

                    for (var x in employee.people){
                        if(employee.people[x].Status=="0" && employee.people[x].PresenceStatus=="1"){
                            curr_person = employee.people[x].name;
                            employee.people[x].Status = 1;
                            break;
                        }
                    }
                }
            // fs.writeFileSync(employee.json, JSON.stringify(employee));

            var jsonContent = JSON.stringify(employee);
            // console.log(jsonContent);
            
            fs.writeFile("employee.json", jsonContent, 'utf8', function (err) {
                if (err) {
                    console.log("An error occured while writing JSON Object to File.");
                    return console.log(err);
                }
            
                // console.log("JSON file has been saved.");
            });

            // console.log("Its ", curr_person, "'s turn");
            var res = "Today is " + curr_person + "'s turn";

            } catch(e) {
                console.log('Error in reading data.txt file:', e.stack);
            }
            await context.sendActivity(`${ res }`);

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity('Hello and welcome!');
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }
}

module.exports.MyBot = MyBot;
