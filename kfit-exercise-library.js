// Shared exercise library for KFit -- the single source of truth for every
// exercise name and body-part category, loaded by both km-fitness-tracker.html
// and kfit-coach-merged.html via <script src>. Previously each file had its
// own hand-copied version, and they had already drifted: Merge was missing
// the Cardio and Functional categories entirely. Edit exercises here, once,
// for both to update.

const EX_LIB = {
'Back':['Pull-Ups','Chin-Ups','Lat Pulldown Wide','Lat Pulldown Close','Lat Pulldown Neutral Grip','Seated Row Close','Seated Row Wide','Chest Supported Row Wide','Chest Supported Row Close','Bent Over Barbell Row','Bent Over Dumbbell Row','Single Arm Dumbbell Row','T-Bar Row','Cable Row','Deadlift','Lat Prayer (Cable Pullover)','Straight Arm Pulldown','Face Pulls','Shrugs','Reverse Fly (Cable)'],
'Chest':['Barbell Bench Press (Flat)','Barbell Bench Press (Incline)','Barbell Bench Press (Decline)','Dumbbell Press (Flat)','Dumbbell Press (Incline)','Dumbbell Press (Decline)','Dumbbell Fly (Flat)','Dumbbell Fly (Incline)','Dumbbell Fly (Decline)','Chest Press Machine','Machine Fly','Cable Fly (Low to High)','Cable Fly (High to Low)','Cable Fly (Mid)','Smith Machine Bench Press (Flat)','Smith Machine Bench Press (Incline)','Smith Machine Bench Press (Decline)','Push-Ups','Deficit Push Ups','Dips (Chest Focus)','Pec Deck Fly'],
'Shoulders':['Barbell Overhead Press','Dumbbell Shoulder Press','Shoulder Press Machine','Arnold Press','Lateral Raises (Dumbbell)','Lateral Raises (Cable)','Lateral Raises (Machine)','Front Raises (Dumbbell)','Front Raises (Barbell)','Front Raises (Cable)','Rear Delt Fly (Dumbbell)','Rear Delt Fly (Cable)','Rear Delt Fly (Machine)','Face Pulls','Landmine Press','Seated Dumbbell Press','Y Raise (Standing)','Y Raise (Incline)','Prone Y Raise (Incline Bench)','Incline Bench Rear Delt Fly','Lateral Raises (Standing, Super ROM)','Y Raise (Standing, Super ROM)','Incline Bench Cross Body Rear Delt Fly','Incline Bench Prone Reverse Fly'],
'Biceps':['Barbell Curl','EZ Bar Curl','Dumbbell Curl','Hammer Curl','Preacher Curl (Barbell)','Preacher Curl (Dumbbell)','Preacher Curl (EZ Bar)','Cable Curl','Incline Dumbbell Curl','Concentration Curl','Cross Body Curl','Reverse Curl','Zottman Curl','Bayesian Curl'],
'Triceps':['Tricep Pushdown (Bar)','Tricep Pushdown (Rope)','Overhead Tricep Extension (Dumbbell)','Overhead Tricep Extension (EZ Bar)','Overhead Tricep Extension (Cable)','Skull Crushers (Barbell)','Skull Crushers (EZ Bar)','Skull Crushers (Dumbbell)','Close Grip Bench Press','Dips (Tricep Focus)','Single Arm Pushdown (Cable)','Kickback (Dumbbell)','Kickback (Cable)'],
'Legs':['Barbell Squat','Front Squat','Goblet Squat','Sumo Squat','Bulgarian Split Squat','Hack Squat','Leg Press','Leg Extension','Lying Hamstring Curl','Seated Hamstring Curl','Romanian Deadlift','Single Leg RDL','Stiff Leg Deadlift','Hip Thrust (Barbell)','Hip Thrust (Dumbbell)','Glute Bridge','Walking Lunges','Reverse Lunges','Forward Lunges','Step-Ups','Good Mornings','Nordic Curl','Calf Raise (Leg Press Machine)','Standing Calf Raise','Seated Calf Raise'],
'Core':['Hanging Leg Raise','Cable Crunch','Crunches','Decline Crunches','Russian Twist','Ab Wheel Rollout','Dead Bug','Pallof Press','Reverse Crunch','Dragon Flag','Landmine Twist','Back Hyperextension','Dumbbell Side Bends'],
// Yoga appears twice on purpose: under Cardio for a full class (logged in
// minutes with an effort level), and under Functional for a short flow or
// held poses inside a workout (logged in seconds, like a plank).
'Cardio':['Running (Treadmill)','Running (Outdoor)','Cycling (Bike)','Cycling (Stationary)','Rowing Machine','Elliptical','Stair Climber','Jump Rope','Swimming','Walking','HIIT','Sprint Intervals','Battle Ropes','Assault Bike','Ski Erg','Yoga'],
'Functional':['Plank','Side Plank','Wall Sit','Dead Hang','Glute Bridge Hold','Hollow Body Hold','Superman Hold','Bird Dog Hold','Split Squat Hold','Push-Up Hold','Farmer\'s Carry','Squat Hold','Bear Crawl','Jumping Jacks','Mountain Climbers','High Knees','Burpees','Yoga']
};

// Shared body-measurement field list -- same idea as EX_LIB above. Previously
// each file (the tracker and Merge) kept its own hand-copied version and had
// already drifted once (Merge was missing Age). Each field defaults to a
// plain number input; type:'select' fields render a dropdown instead, using
// their own options list.
const MEAS_FIELDS=[
{key:'weight',label:'Weight (kg)'},
{key:'height',label:'Height (cm)'},
{key:'age',label:'Age (years)'},
{key:'gender',label:'Sex',type:'select',options:['Male','Female','Other']},
{key:'bodyFat',label:'Body Fat (%)'},
{key:'muscleMass',label:'Muscle Mass (kg)'},
{key:'chest',label:'Chest (cm)'},
{key:'waist',label:'Waist (cm)'},
{key:'hips',label:'Hips (cm)'},
{key:'arm',label:'Arm (cm)'},
{key:'thigh',label:'Thigh (cm)'},
{key:'calf',label:'Calf (cm)'},
{key:'shoulder',label:'Shoulder (cm)'},
{key:'neck',label:'Neck (cm)'}
];

// Shared coach-standard routine templates -- identical in both files before
// this extraction, single-sourced here now so a future edit only has to
// happen once.
const KFIT_STANDARD_ROUTINES=[
{name:'Chest & Core Day',bodyParts:['Chest','Core'],exercises:[
{ex:'Barbell Bench Press (Flat)',sets:3},
{ex:'Dumbbell Press (Incline)',sets:3},
{ex:'Chest Press Machine',sets:3},
{ex:'Dumbbell Shoulder Press',sets:3},
{ex:'Pec Deck Fly',sets:2},
{ex:'Dumbbell Fly (Incline)',sets:2},
{ex:'Dragon Flag',sets:3},
{ex:'Back Hyperextension',sets:3},
{ex:'Dumbbell Side Bends',sets:3}
]},
{name:'Back Day',bodyParts:['Back'],exercises:[
{ex:'Lat Pulldown Wide',sets:2},
{ex:'Lat Pulldown Close',sets:2},
{ex:'Seated Row Close',sets:2},
{ex:'Chest Supported Row Wide',sets:2},
{ex:'Lat Prayer (Cable Pullover)',sets:2},
{ex:'Face Pulls',sets:2},
{ex:'Shrugs',sets:2}
]},
{name:'Leg Day',bodyParts:['Legs'],exercises:[
{ex:'Goblet Squat',sets:3},
{ex:'Romanian Deadlift',sets:3},
{ex:'Lying Hamstring Curl',sets:3},
{ex:'Glute Bridge',sets:3},
{ex:'Leg Extension',sets:3},
{ex:'Standing Calf Raise',sets:3}
]},
{name:'Arms & Shoulder Day',bodyParts:['Shoulders','Triceps','Biceps'],exercises:[
{ex:'Lateral Raises (Standing, Super ROM)',sets:2},
{ex:'Y Raise (Standing, Super ROM)',sets:2},
{ex:'Y Raise (Incline)',sets:2},
{ex:'Incline Bench Cross Body Rear Delt Fly',sets:2},
{ex:'Prone Y Raise (Incline Bench)',sets:2},
{ex:'Incline Bench Prone Reverse Fly',sets:2},
{ex:'Overhead Tricep Extension (Dumbbell)',sets:3},
{ex:'Tricep Pushdown (Rope)',sets:3},
{ex:'Bayesian Curl',sets:3},
{ex:'Preacher Curl (Dumbbell)',sets:3}
]}
];

// Shared suggested-functional-routine presets. Kept in the tracker's native
// shape (circuits/label) since that's what its own browse UI already
// expects; Merge needs a different shape (supersets/num, exercises as {ex}
// objects) because it writes routines straight into a client's stored data
// -- rather than keep a second, separately-shaped copy that can drift the
// way this one already had, Merge converts this on the fly at the one place
// it actually needs that shape (see toMergeSupersets() in that file).
const SUGGESTED_ROUTINES_RAW=[
{name:'KFit 20-Min Functional Foundations',durationMin:20,bodyParts:['Functional'],circuits:[
{label:'Circuit',exercises:['Goblet Squat','Push-Ups','Glute Bridge','Bent Over Dumbbell Row','Mountain Climbers','Plank']}
]},
{name:'KFit 30-Min Full Body Circuit',durationMin:30,bodyParts:['Functional'],circuits:[
{label:'Circuit',exercises:['Bulgarian Split Squat','Push-Ups','Romanian Deadlift','Single Arm Dumbbell Row','Russian Twist',"Farmer's Carry",'Jumping Jacks','Wall Sit']}
]},
{name:'KFit 45-Min Strength + Conditioning',durationMin:45,bodyParts:['Functional'],circuits:[
{label:'Circuit A -- Strength',exercises:['Goblet Squat','Push-Ups','Romanian Deadlift','Bent Over Dumbbell Row','Walking Lunges','Dead Bug']},
{label:'Circuit B -- Conditioning',exercises:['Mountain Climbers','Bear Crawl','Jumping Jacks','Plank']}
]},
{name:'KFit 60-Min Complete Functional Athlete',durationMin:60,bodyParts:['Functional'],circuits:[
{label:'Circuit A -- Lower Body & Power',exercises:['Goblet Squat','Bulgarian Split Squat','Romanian Deadlift','Walking Lunges','Glute Bridge Hold']},
{label:'Circuit B -- Upper Body & Core',exercises:['Push-Ups','Single Arm Dumbbell Row','Dumbbell Shoulder Press','Side Plank','Russian Twist']},
{label:'Circuit C -- Conditioning Finisher',exercises:['Burpees','Mountain Climbers','High Knees',"Farmer's Carry"]}
]}
];

// Shared MET (metabolic equivalent) lookup tables used for calorie
// estimates -- raw physiological reference values, identical in both files
// before this extraction (unlike the surrounding calorie-calculation logic
// itself, which has real, intentional differences between the tracker and
// Merge and stays separate).
const CARDIO_MET={
'Running (Treadmill)':{Easy:7.0,Moderate:9.8,Hard:11.8,Max:14.5},
'Running (Outdoor)':{Easy:7.0,Moderate:9.8,Hard:11.8,Max:14.5},
'Cycling (Bike)':{Easy:4.0,Moderate:6.8,Hard:8.5,Max:11.0},
'Cycling (Stationary)':{Easy:4.0,Moderate:6.8,Hard:8.5,Max:11.0},
'Rowing Machine':{Easy:4.8,Moderate:7.0,Hard:8.5,Max:12.0},
'Elliptical':{Easy:4.5,Moderate:5.5,Hard:7.0,Max:9.0},
'Stair Climber':{Easy:4.0,Moderate:8.8,Hard:9.0,Max:12.0},
'Jump Rope':{Easy:8.8,Moderate:11.0,Hard:12.3,Max:13.5},
'Swimming':{Easy:5.5,Moderate:7.0,Hard:9.8,Max:11.0},
'Walking':{Easy:2.8,Moderate:3.5,Hard:4.5,Max:5.5},
'HIIT':{Easy:6.0,Moderate:8.0,Hard:10.0,Max:12.0},
'Sprint Intervals':{Easy:8.0,Moderate:10.0,Hard:12.0,Max:15.0},
'Battle Ropes':{Easy:6.0,Moderate:8.0,Hard:10.0,Max:12.0},
'Assault Bike':{Easy:6.0,Moderate:8.5,Hard:11.0,Max:14.0},
'Ski Erg':{Easy:5.0,Moderate:7.0,Hard:9.0,Max:11.0},
// Compendium of Physical Activities: gentle/hatha ~2.5, vinyasa/power ~4.
'Yoga':{Easy:2.5,Moderate:3.0,Hard:4.0,Max:5.0}
};
const CARDIO_MET_DEFAULT={Easy:4.0,Moderate:6.0,Hard:8.0,Max:10.0};
const FUNCTIONAL_MET={
'Plank':3.0,'Side Plank':3.0,'Wall Sit':3.5,'Dead Hang':2.5,'Glute Bridge Hold':2.5,
'Hollow Body Hold':3.5,'Superman Hold':2.5,'Bird Dog Hold':2.5,'Split Squat Hold':3.5,
'Push-Up Hold':3.0,'Squat Hold':3.5,'Farmer\'s Carry':4.5,
'Bear Crawl':6.0,'Jumping Jacks':7.0,'Mountain Climbers':8.0,'High Knees':8.0,'Burpees':10.0,
'Yoga':3.0
};
const FUNCTIONAL_MET_DEFAULT=4.0;

// Shared Supabase connection config -- identical across all three files
// (the tracker, the nutrition tracker, and Merge). If this project's URL or
// key is ever rotated, it now only needs updating here instead of three
// separate places.
const SB_URL='https://naabtmffdlgpjqmflscn.supabase.co';
const SB_KEY='sb_publishable_DcSjGaAuUJhGu_3lP82zNw_eKrGnpvz';

// The fallback coach a client gets attributed to when they open a tracker
// with no coach-specific link and no locally stored coach id -- this is the
// exact constant behind an earlier real bug (walk-ins silently attributed
// to the wrong coach). Fitness and nutrition both had it, identically.
const KFIT_DEFAULT_COACH_ID='48bd790c-8097-4bd8-be81-3d76daaa0890';

// The tables every client-facing tracker auto-injects coach_id into on
// insert/upsert. Fitness and nutrition legitimately need different lists
// here -- nutrition never touches attendance or custom_exercises at all, so
// forcing them identical would be wrong, not a fix. This shared base covers
// what both genuinely need; fitness (or any future tracker) extends it with
// whatever else is specific to it, rather than keeping two full, separately
// maintained lists that only sometimes need to agree.
const COACH_SCOPED_TABLES_BASE=['tracker_data','app_feedback','client_name_history'];

// Max upload size (20MB) for any file attachment (measurement scans,
// feedback attachments, meal photos) across all three files.
const MAX_BYTES=20*1024*1024;
