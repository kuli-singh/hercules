export type BodyPart =
  | 'chest'
  | 'lats'
  | 'upper_back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'core'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'full_body';

export interface ExerciseCatalogItem {
  id: string;
  label: string;
  aliases: string[];
  bodyPart: BodyPart;
  defaultTempo: {
    eccentric: number;
    pause: number;
    concentric: number;
  };
  defaultRestSeconds: number;
  cue: string;
}

const exercise = (
  id: string,
  label: string,
  bodyPart: BodyPart,
  defaultRestSeconds: number,
  cue: string,
  aliases: string[],
  defaultTempo: ExerciseCatalogItem['defaultTempo'] = { eccentric: 3, pause: 1, concentric: 1 }
): ExerciseCatalogItem => ({
  id,
  label,
  aliases,
  bodyPart,
  defaultTempo,
  defaultRestSeconds,
  cue,
});

export const exerciseCatalog: ExerciseCatalogItem[] = [
  exercise('lat-pulldown', 'Lat Pulldown', 'lats', 75, 'Keep the chest tall and drive the elbows down instead of yanking with the hands.', ['lat pulldown', 'lat pull down', 'lat pull town', 'wide grip pulldown', 'pulldown', 'pull down']),
  exercise('close-grip-lat-pulldown', 'Close-Grip Lat Pulldown', 'lats', 75, 'Stay tall and finish by pulling the elbows into the ribs.', ['close grip pulldown', 'close grip lat pulldown', 'neutral grip pulldown', 'mag grip pulldown']),
  exercise('straight-arm-pulldown', 'Straight-Arm Pulldown', 'lats', 60, 'Lock the elbow angle in and sweep the arms down from the shoulder.', ['straight arm pulldown', 'straight arm pull down', 'cable pullover', 'rope pulldown']),
  exercise('pull-up', 'Pull-Up', 'lats', 105, 'Start from a dead hang and avoid craning the neck over the bar.', ['pull up', 'pullup', 'chin up', 'chinup', 'bodyweight pull up']),
  exercise('assisted-pull-up', 'Assisted Pull-Up', 'lats', 90, 'Finish with the elbows tucked and control the lowering phase.', ['assisted pull up', 'assisted chin up', 'machine pull up', 'banded pull up']),
  exercise('seated-cable-row', 'Seated Cable Row', 'upper_back', 75, 'Squeeze at the ribcage and own the return instead of dropping the handle.', ['seated cable row', 'cable row', 'low row', 'seated row', 'machine row']),
  exercise('chest-supported-row', 'Chest-Supported Row', 'upper_back', 75, 'Keep the chest glued to the pad and pull through the elbows.', ['chest supported row', 'supported row', 'seal row', 'machine supported row']),
  exercise('single-arm-dumbbell-row', 'Single-Arm Dumbbell Row', 'upper_back', 75, 'Brace hard and row toward the hip instead of shrugging up.', ['single arm row', 'one arm row', 'single arm dumbbell row', 'dumbbell row']),
  exercise('barbell-row', 'Barbell Row', 'upper_back', 90, 'Keep the torso fixed and pull the bar into the lower ribs.', ['barbell row', 'bent over row', 'bent over barbell row']),
  exercise('t-bar-row', 'T-Bar Row', 'upper_back', 90, 'Pull through the elbows and keep the chest from lifting off the support.', ['t bar row', 'tbar row', 'landmine row']),
  exercise('machine-high-row', 'Machine High Row', 'upper_back', 75, 'Drive the elbows down and back while keeping the shoulders packed.', ['high row', 'machine high row', 'iso row', 'hammer strength row']),
  exercise('face-pull', 'Face Pull', 'shoulders', 60, 'Pull to forehead height and rotate cleanly through the end range.', ['face pull', 'rope face pull'], { eccentric: 2, pause: 1, concentric: 1 }),
  exercise('bench-press', 'Bench Press', 'chest', 120, 'Lower to the same touchpoint and keep leg drive on the press.', ['bench press', 'flat bench', 'barbell bench press', 'bench']),
  exercise('incline-bench-press', 'Incline Bench Press', 'chest', 105, 'Keep the upper back tight and press slightly back over the shoulders.', ['incline bench press', 'incline bench', 'incline barbell press']),
  exercise('decline-bench-press', 'Decline Bench Press', 'chest', 90, 'Stay locked into the bench and press back toward the rack line.', ['decline bench press', 'decline bench']),
  exercise('dumbbell-press', 'Dumbbell Press', 'chest', 90, 'Keep the wrists stacked and finish each rep with both bells level.', ['dumbbell press', 'flat dumbbell press', 'dumbbell bench press', 'flat dumbbell bench']),
  exercise('incline-dumbbell-press', 'Incline Dumbbell Press', 'chest', 90, 'Lower evenly and avoid letting one elbow outrun the other.', ['incline dumbbell press', 'incline dumbbell bench', 'incline db press', 'incline press']),
  exercise('machine-chest-press', 'Machine Chest Press', 'chest', 75, 'Drive through the mid palm and keep the shoulders pinned back.', ['machine chest press', 'chest press machine', 'plate loaded chest press', 'machine press', 'chest press']),
  exercise('smith-machine-bench-press', 'Smith Machine Bench Press', 'chest', 90, 'Stay pinned to the bench and lower the bar to the same groove each rep.', ['smith machine bench press', 'smith bench', 'smith press']),
  exercise('pec-deck', 'Pec Deck', 'chest', 60, 'Bring the elbows together under control and resist the stretch on the return.', ['pec deck', 'pec fly', 'machine fly', 'butterfly machine']),
  exercise('cable-fly', 'Cable Fly', 'chest', 60, 'Sweep through the arc without letting the shoulders roll forward.', ['cable fly', 'cable crossover', 'crossover']),
  exercise('push-up', 'Push-Up', 'chest', 60, 'Keep the body rigid and touch the same depth every rep.', ['push up', 'pushup', 'press up', 'bodyweight push up']),
  exercise('dip', 'Dip', 'chest', 90, 'Stay tall through the shoulders and avoid crashing the bottom stretch.', ['dip', 'dips', 'parallel bar dip', 'bodyweight dip']),
  exercise('overhead-press', 'Overhead Press', 'shoulders', 105, 'Stack the wrist over the elbow and finish with the ribs down.', ['overhead press', 'ohp', 'shoulder press', 'military press'], { eccentric: 2, pause: 1, concentric: 1 }),
  exercise('seated-dumbbell-shoulder-press', 'Seated Dumbbell Shoulder Press', 'shoulders', 90, 'Lower evenly and keep the forearms vertical through the bottom.', ['seated dumbbell shoulder press', 'dumbbell shoulder press', 'seated db press', 'dumbbell press shoulder'], { eccentric: 2, pause: 1, concentric: 1 }),
  exercise('machine-shoulder-press', 'Machine Shoulder Press', 'shoulders', 75, 'Drive up without shrugging and control the lowering path.', ['machine shoulder press', 'shoulder press machine', 'plate loaded shoulder press'], { eccentric: 2, pause: 1, concentric: 1 }),
  exercise('arnold-press', 'Arnold Press', 'shoulders', 90, 'Rotate smoothly and keep the shrug out of the top half of the lift.', ['arnold press'], { eccentric: 2, pause: 1, concentric: 1 }),
  exercise('lateral-raise', 'Lateral Raise', 'shoulders', 60, 'Float to shoulder height and keep tension all the way down.', ['lateral raise', 'side raise', 'dumbbell lateral raise']),
  exercise('cable-lateral-raise', 'Cable Lateral Raise', 'shoulders', 60, 'Lead with the elbow and keep cable tension through the bottom.', ['cable lateral raise', 'single arm cable lateral raise', 'cable side raise']),
  exercise('rear-delt-fly', 'Rear Delt Fly', 'shoulders', 60, 'Lead wide through the elbows and keep the neck relaxed.', ['rear delt fly', 'reverse fly', 'reverse pec deck', 'rear delt raise']),
  exercise('upright-row', 'Upright Row', 'shoulders', 60, 'Lift with the elbows and stop before the shoulders lose space.', ['upright row', 'barbell upright row', 'cable upright row']),
  exercise('barbell-curl', 'Barbell Curl', 'biceps', 60, 'Keep the elbows quiet and stop the torso from helping the first rep.', ['barbell curl', 'curl barbell', 'straight bar curl']),
  exercise('ez-bar-curl', 'EZ-Bar Curl', 'biceps', 60, 'Let the biceps own the lowering instead of racing into the next rep.', ['ez bar curl', 'ez curl', 'easy bar curl']),
  exercise('dumbbell-curl', 'Dumbbell Curl', 'biceps', 60, 'Stay tall and keep the bells traveling together without swinging.', ['dumbbell curl', 'db curl', 'alternating curl']),
  exercise('hammer-curl', 'Hammer Curl', 'biceps', 60, 'Keep the thumbs driving up and avoid folding the shoulders forward.', ['hammer curl', 'hammer dumbbell curl']),
  exercise('incline-dumbbell-curl', 'Incline Dumbbell Curl', 'biceps', 60, 'Stay stretched at the bottom and keep the shoulder pinned back.', ['incline dumbbell curl', 'incline curl']),
  exercise('cable-curl', 'Cable Curl', 'biceps', 60, 'Use the cable tension and keep the elbow angle honest at the bottom.', ['cable curl', 'standing cable curl']),
  exercise('preacher-curl', 'Preacher Curl', 'biceps', 60, 'Control the stretch and avoid popping off the bottom pad position.', ['preacher curl', 'machine preacher curl']),
  exercise('concentration-curl', 'Concentration Curl', 'biceps', 45, 'Keep the upper arm planted and squeeze hard through the top.', ['concentration curl']),
  exercise('rope-pushdown', 'Rope Pushdown', 'triceps', 60, 'Pin the elbows and finish by spreading the rope without leaning on the stack.', ['rope pushdown', 'rope pressdown', 'tricep rope pushdown', 'triceps rope pushdown'], { eccentric: 2, pause: 1, concentric: 1 }),
  exercise('tricep-pushdown', 'Tricep Pushdown', 'triceps', 60, 'Pin the elbows and finish by fully straightening without rocking forward.', ['tricep pushdown', 'tricep pressdown', 'triceps pushdown', 'triceps pressdown', 'pushdown', 'pressdown'], { eccentric: 2, pause: 1, concentric: 1 }),
  exercise('overhead-tricep-extension', 'Overhead Tricep Extension', 'triceps', 60, 'Let the elbows point forward and stretch long without flaring wide.', ['overhead tricep extension', 'overhead extension', 'db overhead extension', 'tricep extension']),
  exercise('skull-crusher', 'Skull Crusher', 'triceps', 60, 'Lower behind the forehead path and keep the upper arm fixed.', ['skull crusher', 'lying tricep extension', 'lying extension']),
  exercise('close-grip-bench-press', 'Close-Grip Bench Press', 'triceps', 105, 'Keep the elbows stacked and press without losing upper-back tension.', ['close grip bench', 'close grip bench press', 'cg bench']),
  exercise('tricep-dip', 'Tricep Dip', 'triceps', 75, 'Keep the torso upright and lock out without shrugging the shoulders.', ['tricep dip', 'bench dip', 'bodyweight tricep dip']),
  exercise('barbell-squat', 'Barbell Squat', 'quads', 120, 'Own the descent, stay braced at the bottom, then drive up with intent.', ['squat', 'back squat', 'barbell squat']),
  exercise('front-squat', 'Front Squat', 'quads', 120, 'Keep the chest proud and elbows high through the hardest part of the ascent.', ['front squat']),
  exercise('goblet-squat', 'Goblet Squat', 'quads', 75, 'Use the bell as a counterweight and keep the torso stacked over the hips.', ['goblet squat', 'dumbbell squat']),
  exercise('hack-squat', 'Hack Squat', 'quads', 105, 'Use full depth you can own and avoid bouncing through the machine stops.', ['hack squat', 'machine hack squat']),
  exercise('leg-press', 'Leg Press', 'quads', 120, 'Use full depth you can own and avoid bouncing out of the bottom.', ['leg press', '45 degree leg press', 'sled press', 'egg press']),
  exercise('pendulum-squat', 'Pendulum Squat', 'quads', 105, 'Stay braced and let the knees travel forward without lifting the heels.', ['pendulum squat']),
  exercise('leg-extension', 'Leg Extension', 'quads', 60, 'Squeeze the top cleanly and resist the drop back to the bottom.', ['leg extension', 'quad extension']),
  exercise('split-squat', 'Split Squat', 'quads', 75, 'Stay balanced front to back and let the front leg do the work.', ['split squat']),
  exercise('bulgarian-split-squat', 'Bulgarian Split Squat', 'quads', 75, 'Sink straight down with a stable front foot and finish through the whole foot.', ['bulgarian split squat', 'rear foot elevated split squat', 'rfess']),
  exercise('walking-lunge', 'Walking Lunge', 'quads', 75, 'Stay tall through the torso and make each step deliberate instead of rushing forward.', ['walking lunge', 'walking lunges', 'lunge']),
  exercise('reverse-lunge', 'Reverse Lunge', 'quads', 75, 'Step back softly and keep the front foot rooted for the whole rep.', ['reverse lunge', 'backward lunge']),
  exercise('step-up', 'Step-Up', 'quads', 60, 'Drive through the whole lead foot and avoid pushing off the trailing leg.', ['step up', 'box step up']),
  exercise('romanian-deadlift', 'Romanian Deadlift', 'hamstrings', 105, 'Push the hips back and feel the hamstrings load before standing tall again.', ['romanian deadlift', 'romanian dead lift', 'rdl']),
  exercise('deadlift', 'Deadlift', 'full_body', 150, 'Reset the brace each rep and keep the bar close instead of rushing the floor.', ['deadlift', 'dead lift', 'conventional deadlift'], { eccentric: 2, pause: 1, concentric: 1 }),
  exercise('sumo-deadlift', 'Sumo Deadlift', 'full_body', 150, 'Wedge into the floor first, then push the ground apart to break the bar loose.', ['sumo deadlift', 'sumo dead lift'], { eccentric: 2, pause: 1, concentric: 1 }),
  exercise('stiff-leg-deadlift', 'Stiff-Leg Deadlift', 'hamstrings', 105, 'Own the stretch and keep the knees soft without turning it into an RDL shrug.', ['stiff leg deadlift', 'stiff leg dead lift']),
  exercise('good-morning', 'Good Morning', 'hamstrings', 90, 'Hinge from the hips with a fixed brace and stop before the spine gives up position.', ['good morning', 'barbell good morning']),
  exercise('hamstring-curl', 'Hamstring Curl', 'hamstrings', 60, 'Curl smoothly and resist the stack all the way back to the stretch.', ['hamstring curl', 'leg curl', 'lying leg curl', 'seated leg curl']),
  exercise('nordic-curl', 'Nordic Curl', 'hamstrings', 75, 'Stay braced and slow the fall as long as you can before catching yourself.', ['nordic curl', 'nordic ham curl']),
  exercise('hip-thrust', 'Hip Thrust', 'glutes', 90, 'Lock out by squeezing the glutes, not by overextending the lower back.', ['hip thrust', 'barbell hip thrust'], { eccentric: 2, pause: 2, concentric: 1 }),
  exercise('glute-bridge', 'Glute Bridge', 'glutes', 75, 'Keep the ribs down and finish with a hard glute squeeze at the top.', ['glute bridge', 'barbell glute bridge'], { eccentric: 2, pause: 2, concentric: 1 }),
  exercise('cable-kickback', 'Cable Kickback', 'glutes', 45, 'Drive through the glute and keep the pelvis from twisting open.', ['cable kickback', 'glute kickback']),
  exercise('abductor-machine', 'Abductor Machine', 'glutes', 45, 'Stay tall on the pad and push out hard without rocking the torso.', ['abductor machine', 'hip abductor', 'outer thigh machine']),
  exercise('standing-calf-raise', 'Standing Calf Raise', 'calves', 45, 'Pause hard at the stretched bottom and finish tall through the big toe.', ['standing calf raise', 'calf raise', 'machine calf raise'], { eccentric: 2, pause: 2, concentric: 1 }),
  exercise('seated-calf-raise', 'Seated Calf Raise', 'calves', 45, 'Let the soleus work by controlling the stretch and holding the top.', ['seated calf raise'], { eccentric: 2, pause: 2, concentric: 1 }),
  exercise('leg-press-calf-raise', 'Leg Press Calf Raise', 'calves', 45, 'Use the ankle only and stay in the stretched bottom for a beat.', ['leg press calf raise', 'sled calf raise'], { eccentric: 2, pause: 2, concentric: 1 }),
  exercise('cable-crunch', 'Cable Crunch', 'core', 45, 'Curl the ribcage down instead of hinging the hips backward.', ['cable crunch'], { eccentric: 2, pause: 1, concentric: 1 }),
  exercise('hanging-leg-raise', 'Hanging Leg Raise', 'core', 45, 'Tuck the pelvis under and control the swing before starting the next rep.', ['hanging leg raise', 'leg raise', 'toes to bar'], { eccentric: 2, pause: 1, concentric: 1 }),
  exercise('ab-wheel', 'Ab Wheel', 'core', 60, 'Brace before rolling out and pull the ribs back down to finish.', ['ab wheel', 'ab rollout', 'rollout']),
  exercise('sit-up', 'Sit-Up', 'core', 45, 'Move through a full curl and avoid throwing the arms for momentum.', ['sit up', 'situp']),
  exercise('plank', 'Plank', 'core', 45, 'Brace hard and keep the ribs tucked instead of sagging through the low back.', ['plank', 'front plank'], { eccentric: 1, pause: 30, concentric: 1 }),
  exercise('side-plank', 'Side Plank', 'core', 45, 'Stay long from shoulder to heel and keep the top hip from rolling forward.', ['side plank'], { eccentric: 1, pause: 30, concentric: 1 }),
  exercise('farmer-carry', 'Farmer Carry', 'full_body', 60, 'Walk tall with quiet steps and keep the handles pinned by your sides.', ['farmer carry', 'farmers carry', 'farmer walk'], { eccentric: 1, pause: 0, concentric: 1 }),
  exercise('sled-push', 'Sled Push', 'full_body', 90, 'Stay low, drive through the floor, and keep short powerful steps.', ['sled push', 'prowler push'], { eccentric: 1, pause: 0, concentric: 1 }),
  exercise('battle-rope', 'Battle Rope', 'full_body', 45, 'Stay braced and create rhythm from the shoulders without overextending the back.', ['battle rope', 'ropes']),
];
