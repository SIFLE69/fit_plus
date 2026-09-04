export const initialExercises = [
    // CHEST & PUSH
    {
        name: 'Barbell Bench Press',
        category: 'strength',
        muscleGroup: 'chest',
        equipment: 'barbell',
        benefit: 'Maximizes pectoralis major hypertrophy and pressing power across upper torso.',
        warning: 'Do not bounce the bar off chest. Keep shoulders retracted to prevent rotator cuff strain.',
        youtubeId: 'rT7DgCr-3pg',
        animationType: 'pushup'
    },
    {
        name: 'Incline Dumbbell Press',
        category: 'strength',
        muscleGroup: 'chest',
        equipment: 'dumbbell',
        benefit: 'Targets clavicular head of chest for upper pec density.',
        warning: 'Maintain 30-degree incline. Avoid flaring elbows past 90 degrees to lower shoulder joint stress.',
        youtubeId: '8iPEnn-ltC8',
        animationType: 'pushup'
    },
    {
        name: 'Bodyweight Push-Up',
        category: 'strength',
        muscleGroup: 'chest',
        equipment: 'bodyweight',
        benefit: 'Builds core stability, chest strength, and scapular endurance.',
        warning: 'Keep hips aligned with spine; do not allow lower back to sag.',
        youtubeId: 'IODxDxX7oi4',
        animationType: 'pushup'
    },
    {
        name: 'Cable Chest Fly',
        category: 'strength',
        muscleGroup: 'chest',
        equipment: 'machine',
        benefit: 'Maintains continuous tension through deep chest stretch and peak adduction contraction.',
        warning: 'Maintain slight elbow bend; do not over-stretch shoulder at back of movement.',
        youtubeId: 'Iwe6AmxVf7o',
        animationType: 'generic'
    },

    // SHOULDERS
    {
        name: 'Overhead Shoulder Press',
        category: 'strength',
        muscleGroup: 'shoulders',
        equipment: 'barbell',
        benefit: 'Develops anterior and lateral deltoids while engaging core stability.',
        warning: 'Do not arch lower back excessively. Keep glutes squeezed tight throughout press.',
        youtubeId: '2yjwXTZQDDI',
        animationType: 'generic'
    },
    {
        name: 'Dumbbell Lateral Raise',
        category: 'strength',
        muscleGroup: 'shoulders',
        equipment: 'dumbbell',
        benefit: 'Isolates lateral deltoid head for shoulder width.',
        warning: 'Lead with elbows, not wrists. Avoid swinging momentum at heavier weights.',
        youtubeId: '3VcKaXpzqRo',
        animationType: 'generic'
    },

    // BACK & PULL
    {
        name: 'Conventional Deadlift',
        category: 'strength',
        muscleGroup: 'back',
        equipment: 'barbell',
        benefit: 'Full posterior chain builder for lat, hamstrings, and lower back strength.',
        warning: 'Keep neutral lumbar spine throughout. Stop immediately if lower back rounds.',
        youtubeId: 'op9kVnSso6Q',
        animationType: 'deadlift'
    },
    {
        name: 'Lat Pulldown',
        category: 'strength',
        muscleGroup: 'back',
        equipment: 'machine',
        benefit: 'Builds latissimus dorsi width and upper back thickness.',
        warning: 'Pull bar to top of chest, never behind neck to prevent cervical spine compression.',
        youtubeId: 'CAwf7n6Luuc',
        animationType: 'generic'
    },
    {
        name: 'Bent-Over Dumbbell Row',
        category: 'strength',
        muscleGroup: 'back',
        equipment: 'dumbbell',
        benefit: 'Enhances mid-back density, rhomboids, and rear delts.',
        warning: 'Brace core firm; do not twist torso at top of motion.',
        youtubeId: 'roCP6wCXPqo',
        animationType: 'generic'
    },

    // LEGS
    {
        name: 'Barbell Back Squat',
        category: 'strength',
        muscleGroup: 'legs',
        equipment: 'barbell',
        benefit: 'Premier compound exercise for quadriceps, glutes, and leg strength.',
        warning: 'Keep knees tracking over toes. Avoid knee valgus collapse under heavy loads.',
        youtubeId: 'ultWZbUMPL8',
        animationType: 'squat'
    },
    {
        name: 'Romanian Deadlift (RDL)',
        category: 'strength',
        muscleGroup: 'legs',
        equipment: 'dumbbell',
        benefit: 'Isolates hamstrings and glutes through eccentric stretch.',
        warning: 'Hinge strictly at hips; do not flex or curve lower back.',
        youtubeId: 'JCXUYuzwNrM',
        animationType: 'deadlift'
    },
    {
        name: 'Bulgarian Split Squat',
        category: 'strength',
        muscleGroup: 'legs',
        equipment: 'dumbbell',
        benefit: 'Corrects unilateral leg imbalances and strengthens hip stabilizers.',
        warning: 'High knee-strain potential — keep front foot flat and torso upright.',
        youtubeId: '2C-uNgKwPLE',
        animationType: 'squat'
    },
    {
        name: 'Leg Press Machine',
        category: 'strength',
        muscleGroup: 'legs',
        equipment: 'machine',
        benefit: 'Allows heavy quad loading without vertical spinal compression.',
        warning: 'Do not lock out knees at top of movement.',
        youtubeId: 'IZxyjW7MPJQ',
        animationType: 'squat'
    },

    // ARMS & CORE
    {
        name: 'Standing Barbell Bicep Curl',
        category: 'strength',
        muscleGroup: 'full_body',
        equipment: 'barbell',
        benefit: 'Isolates long and short heads of bicep brachii.',
        warning: 'Keep elbows tucked into sides; do not swing hips for momentum.',
        youtubeId: 'kwG2ipFRgfo',
        animationType: 'bicep_curl'
    },
    {
        name: 'Tricep Rope Pushdown',
        category: 'strength',
        muscleGroup: 'full_body',
        equipment: 'machine',
        benefit: 'Focuses lateral and medial tricep heads.',
        warning: 'Isolate movement to elbow joint; do not lean shoulders forward over rope.',
        youtubeId: 'vB5OHsJ3EME',
        animationType: 'generic'
    },
    {
        name: 'Hanging Leg Raise',
        category: 'strength',
        muscleGroup: 'core',
        equipment: 'bodyweight',
        benefit: 'Targets rectus abdominis and deep hip flexors.',
        warning: 'Avoid swinging torso; initiate pull purely from pelvic tilt.',
        youtubeId: 'hdng3Nm1x_E',
        animationType: 'generic'
    },
    {
        name: 'Abdominal Plank',
        category: 'strength',
        muscleGroup: 'core',
        equipment: 'bodyweight',
        benefit: 'Builds anti-extension core endurance and transverse abdominis strength.',
        warning: 'Keep hips level; do not pike upward or allow lower back to arch downwards.',
        youtubeId: 'pSHjTRCQxIw',
        animationType: 'generic'
    },

    // CARDIO
    {
        name: 'Treadmill Interval Sprint',
        category: 'cardio',
        muscleGroup: 'cardio',
        equipment: 'machine',
        benefit: 'Boosts VO2 max, caloric expenditure, and anaerobic capacity.',
        warning: 'Ensure treadmill safety clip is attached; do not jump onto moving belt.',
        youtubeId: '8030w8x5LwY',
        animationType: 'jumping_jacks'
    },
    {
        name: 'Rowing Machine Intervals',
        category: 'cardio',
        muscleGroup: 'cardio',
        equipment: 'machine',
        benefit: 'Full-body cardiovascular conditioning engaging 85% of muscles.',
        warning: 'Drive with legs first before pulling with upper body to protect spine.',
        youtubeId: 'H0r_ZXMzH-0',
        animationType: 'generic'
    },
    {
        name: 'Jumping Jacks',
        category: 'cardio',
        muscleGroup: 'cardio',
        equipment: 'bodyweight',
        benefit: 'Warm-up cardio exercise raising heart rate and hip mobility.',
        warning: 'Land softly on balls of feet to absorb ankle and knee impact.',
        youtubeId: 'c4DAnQ6DtF8',
        animationType: 'jumping_jacks'
    },
    {
        name: 'Stationary Cycling Zone 2',
        category: 'cardio',
        muscleGroup: 'cardio',
        equipment: 'machine',
        benefit: 'Builds aerobic baseline and mitochondrial density with zero joint impact.',
        warning: 'Adjust seat height so knee is at 15-degree flex at bottom pedal stroke.',
        youtubeId: 'r3s_r8tG9d0',
        animationType: 'generic'
    },
    {
        name: 'Battle Rope Slams',
        category: 'cardio',
        muscleGroup: 'cardio',
        equipment: 'none',
        benefit: 'High-intensity upper body cardiovascular and shoulder endurance work.',
        warning: 'Maintain athletic squat stance; do not round back during slams.',
        youtubeId: 'q5Z2L0n85-E',
        animationType: 'generic'
    }
];
