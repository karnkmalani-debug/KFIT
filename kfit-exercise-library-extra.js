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
