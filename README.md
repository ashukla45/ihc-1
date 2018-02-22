# IHC EMR Overview

Shortcuts:

* [Command line](#command-line)
* [How to](#how-to)
* [Overview](#overview-use-cases)
* [API](#local-server-api)
* [Local storage plan](#local-storage)
* [Mobile](#mobile-plantodo)
* [Laptop](#laptop-plantodo)
* [Database](#database-design)

### Directory organization

IHC/
  - mobile
    - Ihc
      - screens
        - Individual pages of the app
      - components
        - Put any reusable components here
      - services
        - FakeDataService.js: Simulate calls to Express server
        - DataService.js: Hold all calls to fetch()
  - web
    - React code to view admin panel
    - Current directory is very messy, filter out unnecessary stuff
    - Low priority
  - server
    - ExpressJS local server

Moqup:
https://app.moqups.com/mattchinn/ix0mjskH6z/view

==========================================

### Command line

##### Run react native:
1. Start emulator (10 inch tablet)
 
  (Setup instructions here: https://facebook.github.io/react-native/docs/getting-started.html
    "Building Projects With Native Code" -> Target OS: Android)

  i.e. In my ~/.bashrc I made this function, so I could just call run_emulator 
  ```
  function run_emulator {
      /Users/Matt/Library/Android/sdk/tools/emulator -avd Nexus_10_API_23_Tablet
      # Wherever your emulator is stored
  }
  export -f run_emulator
  ```

2. Run ```react-native run-android``` inside IHC/mobile/Ihc directory

##### Run Express server:

*Inside IHC/server directory

1. After making changes, must build the code (transpile from ES6 to JS). Run
   ```npm run make```
2. Run server by calling ```npm run server```
3. To both make and run server, call ```npm start```

4. Start database server with ```npm run db```
5. // TODO: Create a command that spawns a new shell that runs the db (if it
   hasn't been started yet), and then runs npm start

==========================================

### How to...

##### 0. setup the environment

  * This is not meant to be a comprehensive list, but hopefully provides a solid
    list of all the steps required
      1. Go to the github page (github.com/matthew-chinn/ihc) and click "Fork" to
         get your own copy on github
      2. From terminal, use ```git clone <your github repo url>``` to get a
         local copy of the repository
      3. Download mongodb (for backend)
      4. Download an Android emulator (i.e. Nexus 10 inch tablet), probably
         through Android Studio (for frontend)
      5. run ```npm install``` in ihc/mobile, ihc/server, and ihc/server/src to
         download dependencies

##### 1. go through coding process
    1. Make code changes
    2. Push code changes to your own Github repository
    3. Click on "New pull request"
    4. I will review pull requests and either merge the changes or reply with
       feedback

##### 2. make a new screen

  *  First of all, distinguish component vs screen:
      - Component is a reusable piece of small UI, aka a common table
      - Screen is akin to single webpage, and the moqup pages almost all represent a
        new screen. In terms of React, a Screen is a component, but the smaller
        reusable components will go in IHC/mobile/Ihc/components instead.
        
  i. Create the screen component in IHC/mobile/Ihc/screens
  
  ii. Register the component in screens/index.js
  
  iii. Can navigate to a screen by doing
  ```javascript
    this.props.navigator.push({
      screen: 'Ihc.<Component name>'
    });
  ```
  
  * For now, wherever you need data from the Express server, make a helper
    function in the services/FakeDataService.js file and create your own sample
    data. Eventually we will use real calls to the server and put that in
    DataService.js

Other options are available: https://wix.github.io/react-native-navigation/#/screen-api

##### 3. make a new Express API route

  1. Go to server/src/routes.js and add the route

  2. Add any database interactions to src/Mongo.js
      - Generally functions should follow format of
      ```javascript
        export function patientExists(param, callback, next)
          db.collection('patients').find({patientInfo: patientInfo})
            .next( (err,doc) => {
              callback(doc);
            });
        }
      ```
      callback(o) is where the caller handles the return object.
      next() is the Express argument that we are using as part of error handling

      Example route:
      ```javascript
        app.post("/signin/newpatient", (req,res,next) => {
          db.patientExists(req.body.patientInfo, (exists) => {
            if(!exists) {
              db.createPatient(req.body.patientInfo, () => res.send(true));
            } else {
              res.send(false);
            }
          }, next); 
        });
      ```
  3. Update the README API Section for that route with the body and return
     object information (if necessary)
        
##### 4. test the API
  * Make sure the database server is running (```mongod```)

  1. Run a CURL command like this:
    ```
    curl -d '{"patientInfo": {"firstName": "Brandony"}}' \
    -X POST -H "Content-Type: application/json" \
    http://localhost:8000/signin/newpatient
    ```

  2. Or use Postman (an app that allows you to test server routes in a easier
     way)

  3. Inspect the mongo database (to ensure changes go through properly) 
     with a command sequence such as:
     ```mongo``` to start a database shell, which will allow you to look around
     the db

     ```use ihc``` to switch to the 'ihc' database

     ```db.patients.find()``` to view all of the patients in the database

     ```db.patients.find(<filter>)``` to view patients that meet the specified
     filter. Look up MongoDB documentation for details

##### 5. start the router setup for tablets
  
  1. Connect computer to router with ethernet cable

  2. Start the server with ```npm start``` or ```npm run server```
     and the database with ```npm run db```

  3. Make the computer's IP address a hardcoded value i.e. 192.168.1.100

  4. Update config file for variable SERVER_URL to equal <ip address>:<port>
     i.e. '192.168.1.100:8000' // TODO make config file

==========================================

### Overview Use Cases:
Patient gets a new SOAP and Triage form every visit

Medication and growth chart forms reused

Other considerations:
Misc file upload per patient
  - folder to hold scans of anything
Ensure pharmacy can change medications after doctor wrote it in
  - editable table
Timestamp instead of checkbox for patient select for when they finished
  - does this need to persist?
Field for who was triager
Potential password? lock screen after given amount of time?
If router went out, potentailly pass tablets around
  - But wouldnt know patients are signed-in in the first place
  - Maybe have offline patient search

##### High level plan:

Mobile:

- Patients sign in on tablets
- Stations add data for that patient as they go through clinic
- Tablets call API endpoints for local server
  - Store all data received locally in case of router problems
    - Figure out how to update new data efficiently!!!
    - Have a sync button that syncs up all tablets
- Must include Spanish

Laptop:

- Primary need: 
        - Run local server over a local network through router
        - Store all data in local mongo database
- Other use cases:
  (Low priority)
  - View table of all patients and go through data
- Portal for inputting records, probably into Excel and import csv
  
==========================================

### Local server API:

All of the routes should include a PatientIdentification object in the
body, just in case we change up the id mechanism later. 
i.e. should look like this

```
body: { patientInfo: PatientIdentification }
```

Any :date field should be represented as yyyymmdd


POST /signin/newpatient :white_check_mark:
  - Create record for that patient if didn't already exist
  ```
  body: { patientInfo: PatientIdentification}
  ```
  
POST /signin/ :white_check_mark:
  - Pass patient's signin info in body
  - Ensure name and DOB exists, patient's records exist
  - Add patient to queue (including checkin time)
  - Return true if all goes well
  ```
  body: { patientInfo: PatientIdentification }
  ```
  
PATCH /status/ :white_check_mark:
  - Pass patient's new status, such as if they completed a station
  ```
  body: { status: StatusObject,
          patientInfo: Patient object }
  ```

GET /patients?checkedin=true/false&forms=true/false :white_check_mark:
  - Return all patients, or just patients checked in 
  ```
  returns:
    If forms = false: [ {info: PatientInfo object, status: Status object} ]
    If forms = true: [{
      info: PatientInfo object,
      status: Status object,
      forms: { medications: ...,
               soaps: ...,
               triages: ...,
               growthchart: ... }
    }]
  ```

PATCH /patients/soap/ :white_check_mark:
  - Update patient's soap form
  ```
  body: {
    patientInfo: PatientInfo object,
    soap: Soap object
  }

  returns: true if successful
  ```
  
PATCH /patients/triage/ :white_check_mark:
  - Update patient's triage form
  ```
  body: {
    patientInfo: PatientInfo object,
    triage: Triage object
  }

  returns: true if successful
  ```
  
POST /patients/growthchartupdate :white_check_mark:
  - Add update to patient's overall records
  ```
  body: {
    patientInfo: PatientInfo object,
    update: GrowthChartRow object
  }

  returns: true if successful
  ```
PATCH /patients/growthchart
  - Add info for GrowthChart object that is not a GrowthChartRow
  - For now, includes father and mother's heights

POST /patients/medicationsupdate
  - Add update to patient's overall records
  - ```
    Update: {
      type: 'N'/'R'/'C'/'D',
      drugname: "tylenol",
      date: _,
      dose: "30mg",
      frequency: "1/day",
      duration: "1 month"
    }
    ```
GET /patients/forms
  - Return all forms for that patient

GET /patients/medications

GET /patients/growthchart

GET /patients/triage/:date

GET /patients/soap/:date

GET /patients/history
  - Return list of triages and soaps dates, not the actual forms

POST /signout :white_check_mark:
  - Signout everyone that is currently marked as "active"

==========================================

### Local Storage:

Handling LOCAL STORAGE as backup:
If router goes out...

- Biggest need is viewing old data, they could use paper forms temporarily.
- Needs to be in sync with history and current changes from a previous station

##### Lifecycle:

Beginning:
- Start with all history of previous patients

Signin:
- If new patient, then add to local storage and send to server for others to
grab
- All stuff on patient select page don't store locally
  - including patients that are checked in, which stations they are done with,
    special notes/requests (notes section will not be persistent)

Triage/SOAP:
(Only let one person modify at a time)
- Call server, if it doesn't have a form yet then open blank form
  - If form does exist, render
- On clicking "View Growth Chart", Add weight and height to local storage and
  read local storage to get rest of growth chart data
- If "Save", add to local storage and then send to server

Medication List:
- Display past from local storage
- On "Save", add to local storage and send to server

At end of session:
- Tablets click "Sync and end session" or something
  - Grab all patients with updates later than timestamp
  - (Should base last_updated_timestamps on local device, not the server)
  - Replace patients with new data
 
==========================================

### Mobile Plan/TODO:
React Native

- "Sync" button
  - Locally store updates with AsyncStorage
  - Disable "Sync" if updates exist

PLAN OUT LOCAL STORAGE PLAN

-- Begin N/A --

"Upload Updates" PATCH /groups/:group/all -> Express API:
Send list of local updates
Locally save list of timestamps when "Upload Updates" was clicked
Body:
  {
    timestamp: When "Upload Updates" button is clicked,
    userUpdates: list of user updates
        [{ <Match user object in database design section> }]
  }

"Sync" GET /groups/:group/all/:timestamp?exclude=[timestamps] -> Express API:
Pass in 
  :timestamp of when last synced
  [timestamps] 
    - Timestamps when "Upload Updates" was clicked to exclude from results to
      avoid duplicates

Retrieve list of all updates since given timestamp (last synced)
  - Go through list and locally save updates
  - Clear local list of "Upload Updates" timestamps

-- End N/A --


==========================================

### Laptop Plan/TODO:
React and Express local server

TODO
- Form to manually add new information (?)

-- Begin N/A --

Routes:
  ESSENTIAL:
  
  GET   /groups/:group/all/:timestamp   => Return information for updates after
                                           last_synced_timestamp
    1. Grab list of send_update_timestamps from groups/:groupid
    2. For each send_update_timestamp that is later than the last_synced_timestamp
      ("Last synced" is property of the tablet)
      - Ignore timestamps passed in to exclude param 
      - Get list of updates from groups/:timestamp and consolidate into one list

  PATCH /groups/:group/all   => Update information for all people
    - Body contains 
    {
      timestamp: send_update_timestamps,
      user_updates: list of user updates
    }

  NONESSENTIAL:
  GET   /groups/:group/:id   => Return information for that person
  POST  /groups/:group      => Add information for new person
  PATCH /groups/:group/:id   => Update information for person

-- End N/A --

==========================================

### Database design:

/
        
* patients/
    * [Patient object]

# Classes:

Patient

    * info/
      * PatientInfo object
    * status/
        * Status object
    * forms/
        * medications/
          * :drugName/
            * [DrugUpdate object, DrugUpdate object, ...]
        * soaps/
          * :date/
            * Soap object
        * triages/
          * :date/
            * Triage object
        * growthchart/
            * GrowthChart object 
    * lastUpdated/
      * timestamp (ms since epoch)
        
PatientIdentification (Everything needed for signin/identification)
```
{
  firstName: string,
  fatherName: string,
  motherName: string,
  birthday: date,
  sex: int?,
}
```

PatientInfo (Full patient information)
```
{
  firstName: string,
  fatherName: string,
  motherName: string,
  birthday: date,
  sex: int?,
  phone: string
}
```

DrugUpdate
```
{
    name: string,
    date: date,
    dose: string,
    frequency: string,
    duration: string,
    notes: string
}
```

Soap
```
{
    date: date,
    subjective: string,
    objective: string,
    assessment: string,
    plan: string,
    wishlist: string,
    provider: string (Provider's name)
}
```

Triage
```
{
    date: date,
    hasInsurance: boolean,
    location: string (Girasoles/TJP),
    arrivalTime: date/string,
    timeIn: date/string,
    timeOut: date/string,
    triager: string (Triager's name),
    status: int? (EMT/Student/Nurse/Other),
    statusClarification: string (If Other),
    weight: double,
    height: double,
    temp: double,
    rr: double,
    o2: double,
    bp: string,
    hr: double,
    ---IF FEMALE---
    LMP: string,
    Regular: boolean,
    pregnancies: string,
    liveBirths: string,
    abortions: string,
    miscarriages: string,
    ---END IF---
    history: string (past medical history),
    ---IF LABS DONE---
    bgl: string,
    a1c: string,
    fasting: boolean,
    pregnancyTest: boolean,
    --END IF---
    allergies: string,
    meications: string,
    surgeries: string,
    immunizations: string,
    chiefComplaint: string,
    ---IF URINE TEST---
    leukocytes: string,
    blood: string,
    nitrites: string,
    specificGravity: string,
    urobilirubin: string,
    ketone: string,
    protein: string,
    bilirubin: string,
    ph: string,
    glucose: string,
    pharmacySection: string (For pharmacy use only section)
}
```

GrowthChart
```
{
    motherHeight: double,
    fatherHeight: double,
    rows: [GrowthChartRow object, ...]
}
```

GrowthChartRow
```
{
    date: date,
    age: int,
    weight: double,
    height: double,
    bmi: double (Or don't store if we can calculate)
}
```

Status
```
{
    active: boolean (if they came to clinic today),
    checkinTime: datetime,
    triageCompleted: boolean, timestamp?
    doctorCompleted: boolean, timestamp?
    pharmacyCompleted: boolean, timestamp?
    notes: string
}
```
