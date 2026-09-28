// Extra exercises for KFit (27 Sep 2026): gaps found by comparing our
// library with the RP Hypertrophy app's exercise lists. Loaded right after
// kfit-exercise-library.js by the tracker and Merge; it only ADDS names
// (never removes or renames), and skips any name that already exists.
(function(){
var ADD={
'Back':['Pull-Ups (Wide Grip)','Pull-Ups (Neutral Grip)','Lat Pulldown Underhand','Single Arm Lat Pulldown (Cable)','High Row (Machine)','Low Row (Machine)','Chest Supported Row (Machine)','Incline Bench Dumbbell Row','Seal Row','Smith Machine Row','Underhand EZ Bar Row','Inverted Row','Dumbbell Pullover','Machine Pullover','Shrugs (Dumbbell)','Shrugs (Machine)','Rack Pull'],
'Chest':['Dumbbell Press (Low Incline)','Dumbbell Press (High Incline)','Incline Chest Press Machine','Push-Ups (Close Grip)','Push-Ups (Weighted)','Incline Push-Ups','Svend Press'],
'Shoulders':['Smith Machine Shoulder Press','Upright Row (Barbell)','Upright Row (Cable)','Upright Row (Dumbbell)','Lateral Raises (Lying, Incline Bench)','Y Raise (Cable)','Rear Delt Row (Cable)','Rear Delt Row (Dumbbell)','Behind the Back Lateral Raise (Cable)'],
'Biceps':['Alternating Dumbbell Curl','Spider Curl','Drag Curl','Preacher Curl (Machine)','Preacher Curl (Cable)','Hammer Curl (Cable Rope)','Machine Bicep Curl','Wrist Curl','Reverse Wrist Curl'],
'Triceps':['JM Press','Tricep Extension (Machine)','Dips (Assisted Machine)','Overhead Tricep Extension (Single Arm Dumbbell)','Diamond Push-Ups','Bench Dips','Tate Press'],
'Legs':['Pendulum Squat','Belt Squat','Smith Machine Squat','Squat (Heels Elevated)','Sissy Squat','Leg Press (Single Leg)','Smith Machine Split Squat','Romanian Deadlift (Dumbbell)','Sumo Deadlift','Glute Ham Raise','Single Leg Curl (Machine)','Hip Thrust (Machine)','Hip Thrust (Smith Machine)','Hip Abduction (Machine)','Hip Adduction (Machine)','Glute Kickback (Cable)','Glute Kickback (Machine)','Cable Pull-Through','Deficit Reverse Lunges','Smith Machine Calf Raise','Single Leg Calf Raise'],
'Core':['Hanging Knee Raise','Lying Leg Raise','Crunch (Machine)','Decline Sit-Ups','V-Ups','Cable Woodchop','Captain\'s Chair Leg Raise']
};
Object.keys(ADD).forEach(function(bp){
  if(!EX_LIB[bp]) EX_LIB[bp]=[];
  var have={}; EX_LIB[bp].forEach(function(n){ have[n.toLowerCase()]=1; });
  ADD[bp].forEach(function(n){ if(!have[n.toLowerCase()]){ EX_LIB[bp].push(n); have[n.toLowerCase()]=1; } });
});
})();

// KFit Standard Routine in 4, 3 or 2 days a week (picked in the Log tab).
// 4 days = Karan's own split (same as KFIT_STANDARD_ROUTINES). 3 and 2 days
// use the same exercises, regrouped so each muscle still gets 10+ hard sets
// a week; the 2-day plan is full-body so each muscle is trained twice.
var KFIT_STANDARD_SPLITS={
'4':[
{name:'Chest & Core Day',bodyParts:['Chest','Core'],exercises:[
{ex:'Barbell Bench Press (Flat)',sets:3},{ex:'Dumbbell Press (Incline)',sets:3},{ex:'Chest Press Machine',sets:3},{ex:'Dumbbell Shoulder Press',sets:3},
{ex:'Pec Deck Fly',sets:2},{ex:'Dumbbell Fly (Incline)',sets:2},{ex:'Dragon Flag',sets:3},{ex:'Back Hyperextension',sets:3},{ex:'Dumbbell Side Bends',sets:3}]},
{name:'Back Day',bodyParts:['Back'],exercises:[
{ex:'Lat Pulldown Wide',sets:2},{ex:'Lat Pulldown Close',sets:2},{ex:'Seated Row Close',sets:2},{ex:'Chest Supported Row Wide',sets:2},
{ex:'Lat Prayer (Cable Pullover)',sets:2},{ex:'Face Pulls',sets:2},{ex:'Shrugs',sets:2}]},
{name:'Leg Day',bodyParts:['Legs'],exercises:[
{ex:'Goblet Squat',sets:3},{ex:'Romanian Deadlift',sets:3},{ex:'Lying Hamstring Curl',sets:3},{ex:'Glute Bridge',sets:3},{ex:'Leg Extension',sets:3},{ex:'Standing Calf Raise',sets:3}]},
{name:'Arms & Shoulder Day',bodyParts:['Shoulders','Triceps','Biceps'],exercises:[
{ex:'Lateral Raises (Standing, Super ROM)',sets:2},{ex:'Y Raise (Standing, Super ROM)',sets:2},{ex:'Y Raise (Incline)',sets:2},
{ex:'Incline Bench Cross Body Rear Delt Fly',sets:2},{ex:'Prone Y Raise (Incline Bench)',sets:2},{ex:'Incline Bench Prone Reverse Fly',sets:2},
{ex:'Overhead Tricep Extension (Dumbbell)',sets:3},{ex:'Tricep Pushdown (Rope)',sets:3},{ex:'Bayesian Curl',sets:3},{ex:'Preacher Curl (Dumbbell)',sets:3}]}
],
'3':[
{name:'Day 1 - Chest, Shoulders & Triceps',bodyParts:['Chest','Shoulders','Triceps'],exercises:[
{ex:'Barbell Bench Press (Flat)',sets:3},{ex:'Dumbbell Press (Incline)',sets:3},{ex:'Pec Deck Fly',sets:2},{ex:'Dumbbell Shoulder Press',sets:3},
{ex:'Lateral Raises (Standing, Super ROM)',sets:3},{ex:'Overhead Tricep Extension (Dumbbell)',sets:3},{ex:'Tricep Pushdown (Rope)',sets:2}]},
{name:'Day 2 - Back, Rear Delts & Biceps',bodyParts:['Back','Shoulders','Biceps'],exercises:[
{ex:'Lat Pulldown Wide',sets:3},{ex:'Seated Row Close',sets:3},{ex:'Chest Supported Row Wide',sets:2},{ex:'Lat Prayer (Cable Pullover)',sets:2},
{ex:'Face Pulls',sets:2},{ex:'Incline Bench Prone Reverse Fly',sets:2},{ex:'Bayesian Curl',sets:3},{ex:'Preacher Curl (Dumbbell)',sets:2}]},
{name:'Day 3 - Legs & Core',bodyParts:['Legs','Core'],exercises:[
{ex:'Goblet Squat',sets:3},{ex:'Romanian Deadlift',sets:3},{ex:'Lying Hamstring Curl',sets:3},{ex:'Leg Extension',sets:3},
{ex:'Glute Bridge',sets:2},{ex:'Standing Calf Raise',sets:3},{ex:'Dragon Flag',sets:2},{ex:'Back Hyperextension',sets:2}]}
],
'2':[
{name:'Day A - Full Body',bodyParts:['Chest','Back','Legs','Shoulders','Triceps','Core'],exercises:[
{ex:'Barbell Bench Press (Flat)',sets:3},{ex:'Lat Pulldown Wide',sets:3},{ex:'Goblet Squat',sets:3},{ex:'Lying Hamstring Curl',sets:2},
{ex:'Dumbbell Shoulder Press',sets:2},{ex:'Lateral Raises (Standing, Super ROM)',sets:2},{ex:'Tricep Pushdown (Rope)',sets:2},{ex:'Dragon Flag',sets:2}]},
{name:'Day B - Full Body',bodyParts:['Chest','Back','Legs','Shoulders','Biceps','Core'],exercises:[
{ex:'Dumbbell Press (Incline)',sets:3},{ex:'Seated Row Close',sets:3},{ex:'Romanian Deadlift',sets:3},{ex:'Leg Extension',sets:2},
{ex:'Face Pulls',sets:2},{ex:'Bayesian Curl',sets:2},{ex:'Standing Calf Raise',sets:2},{ex:'Back Hyperextension',sets:2}]}
]
};
