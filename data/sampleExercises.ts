// src/data/sampleExercises.ts

export interface Exercise {
  id: string;
  name: string;
  subcategory: string;
  positionCategory: string[];
  setup: string;
  description: string;
  uses_tracking: boolean;
  max_is_good?: boolean;
  successful_reps?: number; // for max_is_good === false
  sets: number;
  set_duration?: number;
  rest: number;
  perFoot?: boolean;
  videoUrls: {
    default?: string;
    left?: string;
    right?: string;
  };}

export const sampleExercises: Exercise[] = [
  {
    id: 'ballmanipulation-1',
    name: 'Inside, Scissor, Push Outside',
    subcategory: 'Ball Manipulation',
    positionCategory: ['All Positions'],
    setup: 'No setup required',
    description:
      'Take a touch inside, and as you take the touch perform a “scissor” stepover with the same foot before pushing the ball outside with your other foot. Repeat on the other side.',
    uses_tracking: false,
    sets: 4,
    set_duration: 15,
    rest: 30,
    videoUrls: {
    default: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Inside%2C%20Scissor%2C%20Push%20Outside.mp4?alt=media&token=58c0d5b0-62c5-4446-9814-0d7be2d53476'
    },
  },

  {
    id: 'ballmanipulation-2',
    name: 'Roll inside, Stop, Double Fake, Push',
    subcategory: 'Ball Manipulation',
    positionCategory: ['All Positions'],
    setup: 'No setup required',
    description:
      'Roll the ball inside with one foot, and stop the ball with the other foot. After stopping the ball, perform 2 body faints before driving forward with the same foot you originally rolled with. Repeat on the other side.',
    uses_tracking: false,
    sets: 4,
    set_duration: 15,
    rest: 30,
    videoUrls: {
    default: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Roll%20Inside%2C%20Stop%2C%20Double%20Fake%2C%20Push.mp4?alt=media&token=2e9e59e9-03aa-4967-88f8-1ac303654065'
    },
  },
  {
    id: 'ballmanipulation-3',
    name: 'Roll inside, Stop, Fake, Outside Foot',
    subcategory: 'Ball Manipulation',
    positionCategory: ['All Positions'],
    setup: 'No setup required',
    description:
      'Roll the ball inside with one foot, and stop the ball with the other foot. After stopping the ball, perform 1 body feint away from the ball before pushing the ball with the outside of the same foot you originally rolled with. Repeat on the other side.',
    uses_tracking: false,
    sets: 4,
    set_duration: 15,
    rest: 30,
    videoUrls: {
    default: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Roll%20Inside%2C%20Stop%2C%20Fake%2C%20Outside%20Foot.mp4?alt=media&token=028ab7a3-01d0-4c42-a7d4-2b40b51c58f3'
    },
  },
  {
    id: 'ballmanipulation-4',
    name: 'Inside, Scissor, Croqueta',
    subcategory: 'Ball Manipulation',
    positionCategory: ['All Positions'],
    setup: 'No setup required',
    description:
      'Take a touch inside, and as you take the touch perform a “scissor” stepover with the same foot. As the ball rolls to your other foot, touch back in the direction you started before pushing the ball forward with your initial foot to drive forward. Repeat on the other side.',
    uses_tracking: false,
    sets: 4,
    set_duration: 15,
    rest: 30,
    videoUrls: {
    default: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Inside%2C%20Scissor%2C%20Croqueta.mp4?alt=media&token=67d3f61b-45e4-454a-8faa-263a3ba617c6'
    },
  },
  {
    id: 'ballmanipulation-5',
    name: 'De Jong Turn',
    subcategory: 'Ball Manipulation',
    positionCategory: ['All Positions'],
    setup: 'No setup required',
    description:
      'Take a touch forward at an angle, before faking a pass and stepping past the ball. As you step past with both feet, use the outside of the same foot you faked the pass with to explode in a different direction. Repeat on the other side.',
    uses_tracking: false,
    sets: 4,
    set_duration: 15,
    rest: 30,
    videoUrls: {
    default: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/De%20Jong%20Turn.mp4?alt=media&token=eb7dbcf0-5e61-407e-bc21-7a6d31f20780'
    },
  },
  {
    id: 'ballmanipulation-6',
    name: 'Fake De Jong Turn',
    subcategory: 'Ball Manipulation',
    positionCategory: ['All Positions'],
    setup: 'No setup required',
    description:
      'Take a touch forward at an angle, before faking a pass and stepping past the ball. As you step past with both feet, step past the ball again with your original foot and perform a body feint before driving forward with the same foot by pushing the ball. Repeat on the other side.',
    uses_tracking: false,
    sets: 4,
    set_duration: 15,
    rest: 30,
    videoUrls: {
    default: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Fake%20De%20Jong%20Turn.mp4?alt=media&token=b23f93df-81ec-44d0-8a3f-b5e057a9f4cc'
    },
  },
  {
    id: 'ballmanipulation-7',
    name: 'Inside, Scissor, Roll Push Outside',
    subcategory: 'Ball Manipulation',
    positionCategory: ['All Positions'],
    setup: 'No setup required',
    description:
      'Take a touch inside, and as you take the touch perform a “scissor” stepover with the same foot. After doing so, roll the ball back in the original direction with the opposite foot before pushing outside with the original foot. Repeat on the other side.',
    uses_tracking: false,
    sets: 4,
    set_duration: 15,
    rest: 30,
    videoUrls: {
    default: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Inside%2C%20Scissor%2C%20Roll%2C%20Push%20Outside.mp4?alt=media&token=1cdf8e89-056e-4f46-979b-6f82e8fe1792'
    },
  },
  {
    id: 'ballmanipulation-8',
    name: 'Reverse Stepover',
    subcategory: 'Ball Manipulation',
    positionCategory: ['All Positions'],
    setup: 'No setup required',
    description:
      'Take a touch forward at an angle, and with the same foot step over the ball from the outside to the inside while stepping past the ball with the other foot. After performing stepover, push ball back in original direction with the outside of the original foot. Repeat on the other side.',
    uses_tracking: false,
    sets: 4,
    set_duration: 15,
    rest: 30,
    videoUrls: {
    default: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Reverse%20Stepover.mp4?alt=media&token=20f449c4-3e6b-445c-bf0a-c079cdfb2513'
    },
  },
  {
    id: 'ballmanipulation-9',
    name: 'Touch Outside, Hesitate, Push Forward',
    subcategory: 'Ball Manipulation',
    positionCategory: ['All Positions'],
    setup: 'No setup required',
    description:
      'Take a touch forward at an angle with the outside of your foot, before using the outside of the same foot to bring the ball back at an angle outside of your hips. As the ball travels back, open your hips and hesitate before driving forward with the inside of the same foot. Repeat on the other side.',
    uses_tracking: false,
    sets: 4,
    set_duration: 15,
    rest: 30,
    videoUrls: {
    default: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Touch%20Outside%2C%20Hesitate%2C%20Push%20Forward.mp4?alt=media&token=549416bb-b0e5-4c9c-9435-65e442f1a7a2'
    },
  },
  {
    id: 'ballmanipulation-10',
    name: 'Pull, Inside, Outside',
    subcategory: 'Ball Manipulation',
    positionCategory: ['All Positions'],
    setup: 'No setup required',
    description:
      'Pull the ball back towards the middle of your body with one foot, before using the inside of your opposite foot to take a touch inside. As quickly as able, use the same foot that you touched inside with to push the ball outside and accelerate. Repeat on the other side.',
    uses_tracking: false,
    sets: 4,
    set_duration: 15,
    rest: 30,
    videoUrls: {
    default: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Pull%2C%20Inside%2C%20Outside.mp4?alt=media&token=0911ac23-a38b-45af-af0d-b23dc9c703f4'
    },
  },
  {
    id: 'ballmanipulation-11',
    name: 'Pull, Stop, Inside, Outside',
    subcategory: 'Ball Manipulation',
    positionCategory: ['All Positions'],
    setup: 'No setup required',
    description:
      'Pull the ball back towards the middle of your body with one foot, and stop the ball with your other foot. Next, take a touch inside with the same foot that you stopped the ball with. As quickly as able, use the same foot that you touched inside with to push the ball outside and accelerate. Repeat on the other side.',
    uses_tracking: false,
    sets: 4,
    set_duration: 15,
    rest: 30,
    videoUrls: {
    default: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Copy%20of%20Pull%2C%20Stop%2C%20Inside%2C%20Outside.mp4?alt=media&token=22ce73c0-af78-4abb-83be-90c68b4aaeae'
    },
  },
  {
    id: 'ballmanipulation-12',
    name: 'Out, Recycle, In, Out',
    subcategory: 'Ball Manipulation',
    positionCategory: ['All Positions'],
    setup: 'No setup required',
    description:
      'Take a touch outside your hips forward at an angle. Roll the ball back towards the middle of your body with the same foot before using the opposite foot to quickly take a touch inside and then outside. Repeat on the other side.',
    uses_tracking: false,
    sets: 4,
    set_duration: 15,
    rest: 30,
    videoUrls: {
    default: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Out%2C%20Recycle%2C%20In%2C%20Out.mp4?alt=media&token=e00fde41-c133-47c5-be5a-fb47249a948c'
    },
  },
  {
    id: 'ballmanipulation-13',
    name: 'Roll, Inside, Outside',
    subcategory: 'Ball Manipulation',
    positionCategory: ['All Positions'],
    setup: 'No setup required',
    description:
      'Roll the ball from one foot to the other, and as the ball comes to the other foot quickly take a touch inside before pushing it outside with the same foot. Repeat on the other side.',
    uses_tracking: false,
    sets: 4,
    set_duration: 15,
    rest: 30,
    videoUrls: {
    default: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Roll%2C%20Inside%2C%20Outside.mp4?alt=media&token=4ebecdf0-e7ba-4edf-9adf-a07353374126'
    },
  },
  {
    id: 'ballmanipulation-14',
    name: 'Roll, Stop, Inside, Outside',
    subcategory: 'Ball Manipulation',
    positionCategory: ['All Positions'],
    setup: 'No setup required',
    description:
      'Roll the ball from one foot to the other, and as the ball comes to the other foot stop it. In the same motion, quickly take a touch inside before pushing it outside with the same foot. Repeat on the other side.',
    uses_tracking: false,
    sets: 4,
    set_duration: 15,
    rest: 30,
    videoUrls: {
    default: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Roll%2C%20Stop%2C%20Inside%2C%20Outside.mp4?alt=media&token=ced189eb-9168-4627-b51e-41a296852cdd'
    },
  },
  {
    id: 'ballmanipulation-15',
    name: 'Pull Push',
    subcategory: 'Ball Manipulation',
    positionCategory: ['All Positions'],
    setup: 'No setup required',
    description:
      'Pull the ball back towards you and push it forward with the same foot. Repeat twice before switching to the other foot.',
    uses_tracking: false,
    sets: 4,
    set_duration: 15,
    rest: 30,
    videoUrls: {
    default: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Push%20Pull.mp4?alt=media&token=ba82896f-c92f-45f2-9169-c8c2ef5f28f3'
    },
  },
  {
    id: 'ballmanipulation-16',
    name: 'Pull, Inside, Outside, Up',
    subcategory: 'Ball Manipulation',
    positionCategory: ['All Positions'],
    setup: 'No setup required',
    description:
      'Pull the ball back towards, and with the same foot take a touch inside. As the ball comes across your body, use the outside of the opposite foot to take a touch wide of your body before using the same foot to push the ball forward. Repeat on the other side.',
    uses_tracking: false,
    sets: 4,
    set_duration: 15,
    rest: 30,
    videoUrls: {
    default: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Pull%2C%20Inside%2C%20Outside.mp4?alt=media&token=0911ac23-a38b-45af-af0d-b23dc9c703f4'
    },
  },
  {
    id: 'ballmanipulation-17',
    name: 'Pull, Inside, Outside, Inside, Outside, Up',
    subcategory: 'Ball Manipulation',
    positionCategory: ['All Positions'],
    setup: 'No setup required',
    description:
      'Pull the ball back towards, and with the same foot take a touch inside. As the ball comes across your body, use the opposite foot to take a touch back towards the original foot before quickly taking another touch inside with the original foot. Use the outside of the opposite foot to take a touch wide of your body before using the same foot to push the ball forward. Repeat on the other side.',
    uses_tracking: false,
    sets: 4,
    set_duration: 15,
    rest: 30,
    videoUrls: {
    default: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Pull%2C%20Inside%2C%20Outside%2C%20Inside%2C%20Outside%2C%20Up.mp4?alt=media&token=7bd101af-e271-4cee-8725-7201a2572c67'
    },
  },
  {
    id: 'ballmanipulation-18',
    name: 'Inside, Outside, Inside',
    subcategory: 'Ball Manipulation',
    positionCategory: ['All Positions'],
    setup: 'No setup required',
    description:
      'Take a touch with the inside of your foot, before quickly using the outside of the same foot to take a touch outside. Bring the ball back inside with the same foot before repeating the sequence on the other side.',
    uses_tracking: false,
    sets: 4,
    set_duration: 15,
    rest: 30,
    videoUrls: {
    default: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Inside%2C%20Outside%2C%20Inside.mp4?alt=media&token=f476afd8-51aa-4cf1-9871-bdeb73e37275'
    },
  },
  {
  id: 'ballmanipulation-19',
  name: 'Juggling - Size 5 Ball',
  subcategory: 'Ball Manipulation',
  positionCategory: ['All Positions'],
  setup: 'No setup required',
  description:
    'Juggle the soccer ball (feet only) for 3 minutes continuously. Record most consecutive juggles without it touching the ground',
  uses_tracking: true,
  max_is_good: true,
  sets: 1,
  set_duration: 180,
  rest: 30,
  videoUrls: {
    default: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Juggling%20Size%205%20Ball.mp4?alt=media&token=817066fb-072a-403b-84af-b132c5f2a2e6'
    },
},
{
  id: 'ballmanipulation-20',
  name: 'Juggling - Size 1 Ball',
  subcategory: 'Ball Manipulation',
  positionCategory: ['All Positions'],
  setup: 'No setup required',
  description:
    'Juggle the soccer ball (feet only) for 3 minutes continuously. Record most consecutive juggles without it touching the ground',
  uses_tracking: true,
  max_is_good: true,
  sets: 1,
  set_duration: 180,
  rest: 30,
  videoUrls: {
    default: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Juggling%20Size%201%20Ball.mp4?alt=media&token=b7baf9d1-1e00-405e-b0cf-69a5e703a75f'
    },
},
{
  id: 'ballmanipulation-21',
  name: 'Juggling - Tennis Ball',
  subcategory: 'Ball Manipulation',
  positionCategory: ['All Positions'],
  setup: 'No setup required',
  description:
    'Juggle the soccer ball (feet only) for 3 minutes continuously. Record most consecutive juggles without it touching the ground',
  uses_tracking: true,
  max_is_good: true,
  sets: 1,
  set_duration: 180,
  rest: 30,
  videoUrls: {
    default: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Juggling%20Tennis%20Ball.mp4?alt=media&token=2caff064-af2e-42b0-893e-3c195628079f'
    },
},
{
  id: 'speedofplay-1',
  name: 'Passing/Receiving - 2 Boards',
  subcategory: 'Speed of Play',
  positionCategory: ['All Positions'],
  setup:
    'Setup one board or bench 5 yards away from you to either side. Setup another board on the other side of you 6 yards away at a 45 degree angle forward.',
  description:
    'Pass the ball off of one of the boards, and as the ball comes back to you look to receive and play to the other board. Continue to repeat for the allotted time. Track how many passes you can get in 30 seconds during each set.',
  uses_tracking: true,
  max_is_good: true,
  sets: 4,
  set_duration: 30,
  rest: 30,
  videoUrls: {
    default: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Passing_Receiving%20-%202%20Boards.mp4?alt=media&token=8e0bbdb3-a689-44f6-aed8-aa315ed291d5'
    },
},
{
  id: 'speedofplay-2',
  name: 'Open Up and Play Forward',
  subcategory: 'Speed of Play',
  positionCategory: ['All Positions'],
  setup:
    'Setup one board or bench 5 yards away from you to either side. Setup a goal or gate 10-15 yards away forward from you.',
  description:
    'Pass the ball off of the board, and as it comes back to you look to receive and play a forward pass into the goal. Repeat until 10 successful repetitions before moving the board to the other side of you. Track how many total reps it took to complete 10 successful.',
  uses_tracking: true,
  sets: 2,
  max_is_good: false,
  successful_reps: 10,

  rest: 30,
  perFoot: true,
  videoUrls: {
    left: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Left%20Foot%20Open%20Up%20and%20Play%20Forward.mp4?alt=media&token=e4ab44c8-be63-424a-a3e2-58318ebeddc3',
    right: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Right%20Foot%20Open%20Up%20and%20Play%20Forward.mp4?alt=media&token=8e67288d-1995-4b9b-857d-19f36ce9e42f'
    },
},
{
  id: 'speedofplay-3',
  name: 'Open Up and Play Diagonal',
  subcategory: 'Speed of Play',
  positionCategory: ['All Positions'],
  setup:
    'Setup one board or bench 5 yards away from you to either side. Setup a goal or gate 10-15 yards away diagonally in a 45 degree angle to the other side.',
  description:
    'Pass the ball off of the board, and as it comes back to you look to receive and play a pass into the goal. Repeat until 10 successful repetitions before moving the board and goal to the other side of you. Track how many total reps it took to complete 10 successful.',
  uses_tracking: true,
  max_is_good: false,
  sets: 2,
  rest: 30,
  successful_reps: 10,
  perFoot: true,
  videoUrls: {
    left: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Left%20Foot%20Open%20Up%20and%20Play%20Diagonal.mp4?alt=media&token=eb1b4d41-4a59-41b7-a6be-dcbc28ae4767',
    right: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Right%20Foot%20Open%20Up%20and%20Play%20Diagonal.mp4?alt=media&token=f64db5df-c947-4e66-927a-b3b9d93170e6'
    },
},
{
  id: 'speedofplay-4',
  name: 'Open Up and Play Reverse Pass',
  subcategory: 'Speed of Play',
  positionCategory: ['All Positions'],
  setup:
    'Setup one board or bench 5 yards away from you to either side. Setup a goal or gate 10-15 yards away diagonally in a 45 degree angle on the same side as the board.',
  description:
    'Pass the ball off of the board, and as it comes back to you take a touch forward at an angle in the opposite direction. On the 2nd touch, look to play a reverse pass into the goal. Repeat until 10 successful repetitions before moving the board and goal to the other side of you. Track how many total reps it took to complete 10 successful.',
  uses_tracking: true,
  sets: 2,
    max_is_good: false,
      successful_reps: 10,

  rest: 30,
  perFoot: true,
  videoUrls: {
    left: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Left%20Foot%20Open%20Up%20and%20Play%20Reverse%20Pass.mp4?alt=media&token=3d1d9d24-2f0a-4a10-b077-d611d355b525',
    right: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Right%20Foot%20Open%20Up%20and%20Play%20Reverse%20Pass.mp4?alt=media&token=44a5a5bd-763b-4c7f-bd54-d1fb192d80b2'
    },
},
{
  id: 'ballstriking-1',
  name: 'Textured Ball - On Ground',
  subcategory: 'Ball Striking',
  positionCategory: ['All Positions'],
  setup:
    'Start 15 yards away from goal centered. Setup one board or bench 5 yards away from you to either side. Setup 2 cones each 3 yards inside either post of a regulation size goal.',
  description:
    'Pass the ball off of the board, and as it comes back to you take your first touch outside your hips. On your second touch, look to curl the ball with the inside of your foot between the cone and the post. Repeat until 10 successful repetitions before moving the board to the other side and repeating on the other foot. Track how many total reps it took to complete 10 successful.',
  uses_tracking: true,
  sets: 2,
    max_is_good: false,
      successful_reps: 10,

  rest: 30,
  perFoot: true,
  videoUrls: {
    left: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Left%20Foot%20Textured%20Ball%20On%20Ground.mp4?alt=media&token=eeeb7660-97a3-40fd-bc8a-2bd796fa96c7',
    right: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Right%20Foot%20Textured%20Ball%20On%20Ground.mp4?alt=media&token=b386d52f-a27a-4ae2-83c5-5fa00f735037'
    },
},
{
  id: 'ballstriking-2',
  name: 'Driven Ball - On Ground',
  subcategory: 'Ball Striking',
  positionCategory: ['All Positions'],
  setup:
    'Start 15 yards away from goal centered. Setup one board or bench 5 yards away from you to either side. Setup 2 cones each 3 yards inside either post of a regulation size goal.',
  description:
    'Pass the ball off of the board, and as it comes back to you take your first touch forward at an angle. On your second touch, look to drive the ball with your laces on the ground down the center of the goal. Repeat until 10 successful repetitions before moving the board to the other side and repeating on the other foot. Track how many total reps it took to complete 10 successful.',
  uses_tracking: true,
  sets: 2,
    max_is_good: false,
      successful_reps: 10,

  rest: 30,
  perFoot: true,
  videoUrls: {
    left: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Left%20Foot%20Driven%20Ball%20On%20Ground.mp4?alt=media&token=8de1926e-5e3a-4a9e-8ca9-767d570b34f3',
    right: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Right%20Foot%20Driven%20Ball%20On%20Ground.mp4?alt=media&token=da7c5851-1a3a-4c5e-8e45-b2800d35185b'
    },
},
{
  id: 'ballstriking-3',
  name: 'Whipped Ball - In Air',
  subcategory: 'Ball Striking',
  positionCategory: ['All Positions'],
  setup:
    'Start 6 yards away from goal centered. Setup one board or bench 5 yards away from you to either side. Setup 2 cones each 3 yards inside either post of a regulation size goal.',
  description:
    'Pass the ball off of the board, and as it comes back to you take your first touch outside your hips. On your second touch, look to curl the ball with the inside of your foot between the cone and the post in the air. Repeat until 10 successful repetitions before moving the board to the other side and repeating on the other foot. Track how many total reps it took to complete 10 successful.',
  uses_tracking: true,
  sets: 2,
    max_is_good: false,
      successful_reps: 10,

  rest: 30,
  perFoot: true,
  videoUrls: {
    left: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Left%20Foot%20Whipped%20Ball%20In%20Air.mp4?alt=media&token=c5404c84-1d08-47f2-8031-628bdd62ee6e',
    right: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Right%20Foot%20Whipped%20Ball%20In%20Air.mp4?alt=media&token=9a41857e-adbc-4595-94e5-dd9731e168b3'
    },
},
{
  id: 'ballstriking-4',
  name: 'Driven Ball - In Air',
  subcategory: 'Ball Striking',
  positionCategory: ['All Positions'],
  setup:
    'Start 6 yards away from goal centered. Setup one board or bench 5 yards away from you to either side. Setup 2 cones each 3 yards inside either post of a regulation size goal.',
  description:
    'Pass the ball off of the board, and as it comes back to you take your first touch forward at an angle. On your second touch, look to drive the ball with your laces in the air down the center of the goal. Repeat until 10 successful repetitions before moving the board to the other side and repeating on the other foot. Track how many total reps it took to complete 10 successful.',
  uses_tracking: true,
  sets: 2,
    max_is_good: false,
      successful_reps: 10,

  rest: 30,
  perFoot: true,
  videoUrls: {
    left: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Left%20Foot%20Driven%20Ball%20In%20Air.mp4?alt=media&token=4af7d6fe-8385-4d5a-a145-4aa4b73c72c6',
    right: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Right%20Foot%20Driven%20Ball%20in%20Air.mp4?alt=media&token=1a04755c-2c9a-482f-aa8b-d4444e2ce5e4'
    },
},
{
  id: 'ballstriking-5',
  name: 'Clipped Ball - In Air',
  subcategory: 'Ball Striking',
  positionCategory: ['All Positions'],
  setup:
    'Place a kickboard or bench at the top of the D centered. Situate yourself to be 5-10 yards away from the kickboard (25-30 yards from goal) with soccer balls.',
  description:
    'Pass the ball off of the board, and as it comes back to you take your first touch forward at an angle. On your second touch, look to clip the ball with your laces, aiming to get backspin, and hit the cross bar. Repeat until 10 successful repetitions before repeating on the other foot. Track how many total reps it took to complete 10 successful.',
  uses_tracking: true,
  sets: 2,
    max_is_good: false,
      successful_reps: 10,

  rest: 30,
  perFoot: true,
  videoUrls: {
    left: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Left%20Foot%20Clipped%20Ball%20In%20Air.mp4?alt=media&token=da316344-d6cd-43ba-ad69-d336b5f7c5f4',
    right: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Right%20Foot%20Clipped%20Ball%20In%20Air.mp4?alt=media&token=8bd5bae2-bfb7-46c9-8a02-a33a4daf7793'
    },
},
{
  id: 'attacking-finish-1',
  name: '1v1 to Finish',
  subcategory: 'Finishing',
  positionCategory: ['Attacking Players', 'Center Midfielders'],
  setup:
    'Setup a cone at the top of the 18, between the corner of the 6 yard box and the corner of the D. Place soccer ball(s) 6-8 yards away at an angle.',
  description:
    'Dribble at the cone with pace before performing 1v1 move to simulate beating a defender to the outside. After performing the 1v1 move, look to finish low and to the far post. Repeat until 5 successful repetitions before switching feet and moving the cone to the other side.',
  uses_tracking: true,
  sets: 2,
    max_is_good: false,
      successful_reps: 5,

  rest: 30,
  perFoot: true,
  videoUrls: {
    left: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Left%20Foot%201v1%20to%20Finish.mp4?alt=media&token=73317bf8-53c9-430d-99e9-657c3e5accb9',
    right: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Right%20Foot%201v1%20to%20Finish.mp4?alt=media&token=0f8832d8-0d35-4e35-8f93-c319d49ff0ab'
  },
},
{
  id: 'attacking-finish-2',
  name: '1v1 to Shot Fake',
  subcategory: 'Finishing',
  positionCategory: ['Attacking Players', 'Center Midfielders'],
  setup:
    'Setup a cone at the top of the 18, between the corner of the 6 yard box and the corner of the D. Place soccer ball(s) 6-8 yards away at an angle.',
  description:
    'Dribble at the cone with pace before performing 1v1 move to simulate beating a defender to the outside. After performing the 1v1 move, fake a shot before cutting inside. On the next touch, look to finish low and to the far post by curling the ball. Repeat until 5 successful repetitions before switching feet and moving the cone to the other side.',
  uses_tracking: true,
  sets: 2,
    max_is_good: false,
      successful_reps: 5,

  rest: 30,
  perFoot: true,
  videoUrls: {
    left: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Left%20Foot%201v1%20to%20Shot%20Fake.mp4?alt=media&token=85f11dc2-3cd8-4ff2-b967-9107d2f2af96',
    right: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Right%20Foot%201v1%20to%20Shot%20Fake.mp4?alt=media&token=1d801c35-1f3c-4a40-b1ce-558a981b8b8e'
  },
},
{
  id: 'attacking-finish-3',
  name: 'Open Up and Finish',
  subcategory: 'Finishing',
  positionCategory: ['Attacking Players', 'Center Midfielders'],
  setup:
    'Start at top of the 18, with a kickboard 5 yards to the side of you.',
  description:
    'Play off of the kickboard, and as ball comes back to you take first touch outside of your hips. On the 2nd touch, look to finish into either of the bottom corners. Look to complete 5 successful repetitions before moving the board to the other side and repeating with your other foot.',
  uses_tracking: true,
  sets: 2,
    max_is_good: false,
      successful_reps: 5,

  rest: 30,
  perFoot: true,
  videoUrls: {
    left: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Left%20Foot%20Open%20Up%20to%20Finish.mp4?alt=media&token=f75367cd-13d9-4bd9-9f71-b01e67e0a02f',
    right: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/Right%20Foot%20Open%20Up%20to%20Finish.mp4?alt=media&token=dcc413e4-8971-49b2-9439-7eb763c01b25'
  },
},
{
  id: 'attacking-finish-4',
  name: 'Touch Forward to Finish',
  subcategory: 'Finishing',
  positionCategory: ['Attacking Players', 'Center Midfielders'],
  setup:
    'Start at top of the D, with a kickboard 5 yards to the side of you.',
  description:
    'Play off of the kickboard, and as ball comes back to you take first touch forward at an angle. On the 2nd touch, look to finish into either of the bottom corners. Look to complete 5 successful repetitions before moving the board to the other side and repeating with your other foot.',
  uses_tracking: true,
  sets: 2,
    max_is_good: false,
      successful_reps: 5,

  rest: 30,
  perFoot: true,
  videoUrls: {
    left: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/videos%2FLeft%20Foot%20Touch%20Forward%20to%20Finish.mp4?alt=media&token=53299c79-6ae6-4c15-8e75-424c708f8196',
    right: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/videos%2FRight%20Foot%20Touch%20Forward%20to%20Finish.mp4?alt=media&token=e0dbca83-6ec3-4e00-b449-7243be0f3aaf'
  },
},
{
  id: 'attacking-finish-5',
  name: 'Out of Air - 2 Touch',
  subcategory: 'Finishing',
  positionCategory: ['Attacking Players', 'Center Midfielders'],
  setup: 'Start at top of the D, with the ball in your hands.',
  description:
    'Toss ball into air ahead of you. Look to run through the ball on your 1st touch after a bounce and finish efficiently on your 2nd touch into one of the corners of the goal. Complete 5 successful repetitions before switching to the other foot.',
  uses_tracking: true,
  sets: 2,
    max_is_good: false,
      successful_reps: 5,
  rest: 30,
  perFoot: true,
  videoUrls: {
    left: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/videos%2FLeft%20Foot%20Out%20of%20Air%202%20Touch.mp4?alt=media&token=87df7fb2-52da-4f0b-8343-e1fb6fe62bf9',
    right: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/videos%2FRight%20Foot%20Out%20of%20Air%202%20Touch.mp4?alt=media&token=31f0a89b-8936-437c-8403-b30197f4230a'
  },
},
{
  id: 'attacking-finish-6',
  name: 'Out of Air - 1 Touch',
  subcategory: 'Finishing',
  positionCategory: ['Attacking Players', 'Center Midfielders'],
  setup: 'Start at top of the D, with the ball in your hands.',
  description:
    'Toss ball into air ahead of you. Look to finish the ball off of the bounce in 1 touch into one of the corners. Complete 5 successful repetitions before switching to the other foot.',
  uses_tracking: true,
  sets: 2,
    max_is_good: false,
      successful_reps: 5,

  rest: 30,
  perFoot: true,
  videoUrls: {
    left: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/videos%2FLeft%20Foot%20Out%20of%20Air%201%20Touch.mp4?alt=media&token=b9f23b87-ca79-481e-a12d-76629ed58c56',
    right: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/videos%2FRight%20Foot%20Out%20of%20Air%201%20Touch.mp4?alt=media&token=14d55fea-2d39-4382-a916-05b47f792bf0'
  },
},
{
  id: 'crossing-1-attacking',
  name: 'Early and Creating Space',
  subcategory: 'Crossing',
  positionCategory: ['Attacking Players','Outside Backs'],
  setup:
    'Start 10 yards behind the corner of the 18, and 10 yards wide of the corner of the 18. Place a kickboard or bench 5 yards inside of where you are positioned. Place a goal or 5 yard gate on the opposite corner of the 6.',
  description:
    'Play off of the kickboard, and take your first touch forward at an angle, before using the inside of your foot to whip the ball with pace, looking to land it between the penalty spot and the 6 yard box. Complete 5 successful repetitions before switching to the other foot.',
  uses_tracking: true,
  sets: 2,
    max_is_good: false,
          successful_reps: 5,

  rest: 30,
  perFoot: true,
  videoUrls: {
    left: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/videos%2FLeft%20Foot%20Early%20and%20Creating%20Space.mp4?alt=media&token=b672b20b-0fd9-4a99-863e-474dc684830f',
    right: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/videos%2FRight%20Foot%20Early%20and%20Creating%20Space.mp4?alt=media&token=53b957c0-280e-4b32-8f59-463eae32646b'
  },
},
{
  id: 'crossing-2-attacking',
  name: 'Early and Creating Space with 1v1',
  subcategory: 'Crossing',
  positionCategory: ['Attacking Players','Outside Backs'],
  setup:
    'Start 10 yards behind the corner of the 18, and 10 yards wide of the corner of the 18. Place a kickboard or bench 5 yards inside of where you are positioned. Place a cone even with the corner of the 18, ahead of the kickboard or bench. Place a goal or 5 yard gate on the opposite corner of the 6.',
  description:
    'Play off of the kickboard, and dribble at the cone with speed. Perform a 1v1 move to beat the cone to the outside before whipping the ball with pace with the inside of your foot, looking to land it between the penalty spot and the 6 yard box. Complete 5 successful repetitions before switching to the other foot.',
  uses_tracking: true,
  sets: 2,
    max_is_good: false,
          successful_reps: 5,

  rest: 30,
  perFoot: true,
  videoUrls: {
    left: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/videos%2FLeft%20Foot%20Early%20and%20Creating%20Space%20with%201v1.mp4?alt=media&token=375f0544-2360-4a9e-a68d-bd560c8149a1',
    right: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/videos%2FRight%20Foot%20Early%20and%20Creating%20Space%20with%201v1.mp4?alt=media&token=d2ee152d-2031-480b-84c0-f62c6b14214f'
  },
},
{
  id: 'crossing-3-attacking',
  name: '1v1 with Cutback Service',
  subcategory: 'Crossing',
  positionCategory: ['Attacking Players','Outside Backs'],
  setup:
    'Place a cone 5 yards wide of the 18 yard box even with the 6 yard box. Start away from the cone near the sideline so you can dribble towards it. Place a goal or 5 yard gate at an angle near the opposite corner of the top of the D.',
  description:
    'Dribble at the cone with pace, before performing a 1v1 move to beat the cone towards the endline. Once at the endline, cut the ball back at an angle, looking to roll it over the penalty spot, or within a couple of yards. Complete 5 successful repetitions before switching to the other foot.',
  uses_tracking: true,
  sets: 2,
    max_is_good: false,
          successful_reps: 5,

  rest: 30,
  perFoot: true,
  videoUrls: {
    left: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/videos%2FLeft%20Foot%201v1%20with%20Cutback%20Service.mp4?alt=media&token=934d4d6d-499d-4635-a147-9a469a6503fc',
    right: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/videos%2FRight%20Foot%201v1%20with%20Cutback%20Service.mp4?alt=media&token=43e36f6b-5911-4fd2-adf8-49e3f5e3fa8d'
  },
},
{
  id: 'crossing-4-attacking',
  name: '1v1 with Floated Service',
  subcategory: 'Crossing',
  positionCategory: ['Attacking Players','Outside Backs'],
  setup:
    'Place a cone 5 yards wide of the 18 yard box even with the 6 yard box. Start away from the cone near the sideline so you can dribble towards it.',
  description:
    'Dribble at the cone with pace, before performing a 1v1 move to beat the cone towards the endline. Once at the endline, float the ball to the back post, looking to land it just past the opposite corner of the 6, or within a couple of yards. Complete 5 successful repetitions before switching to the other foot.',
  uses_tracking: true,
  sets: 2,
    max_is_good: false,
          successful_reps: 5,

  rest: 30,
  perFoot: true,
  videoUrls: {
    left: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/videos%2FLeft%20Foot%201v1%20with%20Floated%20Service.mp4?alt=media&token=7ff685bc-ad14-4d06-92bb-9808ffa111bd',
    right: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/videos%2FRight%20Foot%201v1%20with%20Floated%20Service.mp4?alt=media&token=9ec88437-603f-4416-bf3e-da34244083ec'
  },
},
{
  id: 'midfield-dribbling-1',
  name: 'Dribble to Break Lines',
  subcategory: 'Dribbling',
  positionCategory: ['Center Midfielders', 'Outside Backs', 'Center Backs'],
  setup:
    'Place a kickboard or bench 5 yards away from you to either side with a 3 yard gate 3 yards ahead of you. Place another cone 15 yards ahead of the gate (central), with 2 goals or gates 15 yards away from the cone at a 45 degree angle.',
  description:
    'Play off of the kickboard, and as the ball is coming back to you look to break through the gate on your 1st touch. Dribble with speed towards the cone, and as you are 3–5 yards away look to play into either goal. Complete 5 successful repetitions before completing 5 successful repetitions in the other goal. Switch the board to the other side and repeat. Track how many reps it took to complete 5 successful per side.',
  uses_tracking: true,
  sets: 4,
    max_is_good: false,
          successful_reps: 5,

  rest: 30,
  perFoot: true,
  videoUrls: {
    left: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/videos%2FLeft%20Foot%20Dribble%20to%20Break%20Lines.mp4?alt=media&token=c901c094-8ef6-4e3a-90c2-f81ed331dc2a',
    right: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/videos%2FRight%20Foot%20Dribble%20to%20Break%20Lines.mp4?alt=media&token=654a624f-bf9a-44ba-a65f-c24858abecd5'
  },
},
{
  id: 'midfield-clearance-1',
  name: 'Set Ball Clearance',
  subcategory: 'Clearances',
  positionCategory: ['Center Midfielders', 'Outside Backs', 'Center Backs'],
  setup:
    'Place a kickboard 15 yards ahead of you and a line or goal 30 yards ahead of the kickboard.',
  description:
    'Play off of the kickboard, and as the ball is coming back to you look to play a ball 1st time that clears the line or goes over the cross bar of the goal that is ahead of you. Complete 10 successful repetitions before switching to the other foot. Track how many total reps it took to complete 10 successful.',
  uses_tracking: true,
  sets: 2,
    max_is_good: false,
          successful_reps: 10,

  rest: 30,
  perFoot: true,
  videoUrls: {
    left: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/videos%2FLeft%20Foot%20Set%20Ball%20Clearance.mp4?alt=media&token=cc33dcb7-27d6-4dca-ad4c-659eb74c7fbf',
    right: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/videos%2FRight%20Foot%20Set%20Ball%20Clearance.mp4?alt=media&token=e769ef9d-9135-410a-9d7a-eed67f58fb8e'
  },
},
{
  id: 'midfield-clearance-2',
  name: 'Bouncing Ball Clearance',
  subcategory: 'Clearances',
  positionCategory: ['Center Midfielders', 'Outside Backs', 'Center Backs'],
  setup:
    'Start with the ball in your hand and place a line or goal 25 yards ahead of where you are standing.',
  description:
    'Throw the ball in the air in front of you slightly, and after 1 or 2 bounces use the inside of your foot to pop the ball up in the air. Look to clear the line or go over the cross bar of the goal that is ahead of you. Complete 10 successful repetitions before switching to the other foot. Track how many total reps it took to complete 10 successful.',
  uses_tracking: true,
  sets: 2,
    max_is_good: false,
          successful_reps: 10,

  rest: 30,
  perFoot: true,
  videoUrls: {
    left: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/videos%2FLeft%20Foot%20Bouncing%20Ball%20Clearance.mp4?alt=media&token=ed2eed19-01fd-4ebb-a6ce-51df79fc58d6',
    right: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/videos%2FRight%20Foot%20Bouncing%20Ball%20Clearance.mp4?alt=media&token=18852ec8-0d49-4fb8-bea7-a7fed3a99ec1'
  },
},
{
  id: 'passing-deception',
  name: '2 Touch - Deception',
  subcategory: 'Passing/Receiving',
  positionCategory: ['Center Midfielders', 'Outside Backs', 'Center Backs'],
  setup: 'Place a kickboard or bench 5 yards away from you at an angle with a goal 15 yards away from you at an angle.',
  description: 'Play off of the kickboard, and as the ball is coming back to you use deception as the ball is approaching you. Take a touch to open up, and on the 2nd touch play into the goal. Complete 10 successful repetitions before moving the board and goal to opposite sides. Track how many total reps it took to complete 10 successful.',
  uses_tracking: true,
  sets: 2,
    max_is_good: false,
          successful_reps: 10,

  rest: 30,
  perFoot: true,
  videoUrls: {
    left: '',
    right:''
  },
},
{
  id: 'passing-deception-reverse',
  name: '2 Touch - Deception to Reverse Pass',
  subcategory: 'Passing/Receiving',
  positionCategory: ['Center Midfielders', 'Outside Backs', 'Center Backs'],
  setup: 'Place a kickboard or bench 5 yards away from you at an angle with a goal 15 yards away from you straight ahead.',
  description: 'Play off of the kickboard, and as the ball is coming back to you use deception as the ball is approaching you. Take a touch to open up, and on the 2nd touch play into the goal using a reverse pass. Complete 10 successful repetitions before moving the board and goal to opposite sides. Track how many total reps it took to complete 10 successful.',
  uses_tracking: true,
  sets: 2,
    max_is_good: false,
          successful_reps: 10,
  rest: 30,
  perFoot: true,
   videoUrls: {
    left: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/videos%2Fpassing-deception-reverse-left.mp4?alt=media&token=b58ae2dc-0138-4263-af8d-c7833bfac5fa',
    right: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/videos%2Fpassing-deception-reverse-right.mp4?alt=media&token=066a0512-e13c-4a32-8a3e-9b72d6c4ff09'
  },
},
{
  id: 'passing-turn-forward',
  name: 'Turn to Play Forward',
  subcategory: 'Passing/Receiving',
  positionCategory: ['Center Midfielders', 'Outside Backs', 'Center Backs'],
  setup: 'Place a kickboard or bench 5 yards behind you with a goal 15 yards forward at an angle.',
  description: 'Play off of the kickboard, and take a touch at an angle away from the goal. Perform a stepover or turn using deception to turn towards goal before playing into goal. Complete 10 successful repetitions before moving the board and goal to opposite sides. Track how many total reps it took to complete 10 successful.',
  uses_tracking: true,
  sets: 2,
    max_is_good: false,
          successful_reps: 10,

  rest: 30,
  perFoot: true,
  videoUrls: {
    left: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/videos%2Fpassing-turn-forward-left.mp4?alt=media&token=ac084599-79a1-47d3-ab52-a3236bd4d20f',
    right: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/videos%2Fpassing-turn-forward-right.mp4?alt=media&token=cdb32736-4ebd-4409-a514-880debe289d4'
  },
},
{
  id: 'passing-bounce-play',
  name: 'Bounce to Play Forward',
  subcategory: 'Passing/Receiving',
  positionCategory: ['Center Midfielders', 'Outside Backs', 'Center Backs'],
  setup: 'Place a kickboard or bench 5 yards behind you with a goal 15 yards forward at an angle, and a goal 10 yards behind you at an angle.',
  description: 'Play off of the kickboard, and play a 1 touch pass into the goal the way you are facing. Play another ball off the kickboard, and take a touch at an angle away from the goal. Perform a stepover or turn using deception to turn towards goal before playing into goal. Complete 10 successful repetitions before moving the board and goals to opposite sides. Track how many total reps it took to complete 10 successful.',
  uses_tracking: true,
  sets: 2,
    max_is_good: false,
          successful_reps: 10,

  rest: 30,
  perFoot: true,
  videoUrls: {
    left: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/videos%2Fpassing-bounce-play-left.mp4?alt=media&token=44c333ee-16fc-40c9-bc46-0fc443fba2e5',
    right:'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/videos%2Fpassing-bounce-play-right.mp4?alt=media&token=224014df-1341-4cc2-98dd-9dee9ffe5368'
  }
},
{
  id: 'passing-open-wide',
  name: 'Open Up to Play Wide',
  subcategory: 'Passing/Receiving',
  positionCategory: ['Center Midfielders', 'Outside Backs', 'Center Backs'],
  setup: 'Place a kickboard or bench 5 yards to either side of you with a goal 15 yards away from you at a wide angle.',
  description: 'Play off of the kickboard, and use your first touch to open up. On your second touch, pass the ball into the goal wide of you. Complete 10 successful repetitions before moving the board and goal to the opposite side. Track how many total reps it took to complete 10 successful.',
  uses_tracking: true,
  sets: 2,
    max_is_good: false,
          successful_reps: 10,

  rest: 30,
  perFoot: true,
  videoUrls: {
    left: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/videos%2Fpassing-open-wide-left.mp4?alt=media&token=e3528475-1693-4e72-bbe9-74b2d941d22c',
    right: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/videos%2Fpassing-open-wide-right.mp4?alt=media&token=912d64ac-f8d0-4781-a296-2ef6558231a2'
  },
},
{
  id: 'passing-open-recycle',
  name: 'Open Up to Recycle',
  subcategory: 'Passing/Receiving',
  positionCategory: ['Center Midfielders', 'Outside Backs', 'Center Backs'],
  setup: 'Place a kickboard or bench 5 yards to either side of you with a goal 10 yards behind you even with the kickboard at an angle facing you.',
  description: 'Play off of the kickboard, and use your first touch to open up. Take 2 hard dribbles forward at an angle, before using a stepover or fake to turn back towards the goal. After performing the turn, play into the goal behind you. Complete 10 successful repetitions before moving the board and goal to the opposite side. Track how many total reps it took to complete 10 successful.',
  uses_tracking: true,
  sets: 2,
    max_is_good: false,
          successful_reps: 10,

  rest: 30,
  perFoot: true,
  videoUrls: {
  left: "https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/videos%2Fpassing-open-recycle-left.mp4?alt=media&token=da468ada-6631-4a2b-b780-8e31938348bc",
  right: "https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/videos%2Fpassing-open-recycle-right.mp4?alt=media&token=f1922143-de46-4fdc-b918-a080f8990253"
}

},
{
  id: 'passing-open-forward',
  name: 'Open Up to Play Forward',
  subcategory: 'Passing/Receiving',
  positionCategory: ['Center Midfielders', 'Outside Backs', 'Center Backs'],
  setup: 'Place a kickboard or bench 5 yards to either side of you with a goal 15 yards ahead of the kickboard at an angle facing you.',
  description: 'Play off of the kickboard, and use your first touch to open up. Take a hard dribble forward at an angle before faking a pass wide and bringing the ball back central. On your next touch, play a forward pass into the goal. Complete 10 successful repetitions before moving the board and goal to the opposite side. Track how many total reps it took to complete 10 successful.',
  uses_tracking: true,
  sets: 2,
    max_is_good: false,
          successful_reps: 10,

  rest: 30,
  perFoot: true,
  videoUrls: {
    left: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/videos%2Fpassing-open-forward-left.mp4?alt=media&token=d0a1a8a9-8f68-435a-9cb2-a6f1dac222be',
    right: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/videos%2Fpassing-open-forward-right.mp4?alt=media&token=074b4335-88a3-45e4-9464-6b369d069f58'
  },
},
{
  id: 'crossing-deep-1',
  name: 'Deep Service - 2 Touch',
  subcategory: 'Crossing',
  positionCategory: ['Center Backs', 'Outside Backs'],
  setup: 'Start near the sideline, 30 yards from goal. Place a kickboard 10 yards away from you at an angle.',
  description: 'Play off of the kickboard, and as the ball comes back to you, use your first touch to go forward at an angle. On your second touch, drive the ball with your laces, looking to land it near the opposite corner of the 6 yard box, or within a couple of yards. Complete 5 successful repetitions before switching to the opposite side.',
  uses_tracking: true,
  sets: 2,
    max_is_good: false,
          successful_reps: 5,

  rest: 30,
  perFoot: true,
  videoUrls: {
    left: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/videos%2FLeft%20Foot%20Deep%20Service%202%20Touch.mp4?alt=media&token=f7426d4d-253b-4907-af8f-ffa29ab3c770',
    right: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/videos%2FRight%20Foot%20Deep%20Service%202%20Touch.mp4?alt=media&token=8635a899-6620-4bdc-a16a-2ff8e278120d'
  },
},
{
  id: 'crossing-deep-2',
  name: 'Deep Service - 1 Touch',
  subcategory: 'Crossing',
  positionCategory: ['Center Backs', 'Outside Backs'],
  setup: 'Start near the sideline, 30 yards from goal. Place a kickboard 10 yards away from you at an angle.',
  description: 'Play off of the kickboard, and as the ball comes back to you, look to float or drive the ball to the far post on your 1st touch. Look to land the ball near the opposite corner of the 6 yard box, or within a couple of yards. Complete 5 successful repetitions before switching to the opposite side.',
  uses_tracking: true,
  sets: 2,
    max_is_good: false,
          successful_reps: 5,

  rest: 30,
  perFoot: true,
  videoUrls: {
    left: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/videos%2FLeft%20Foot%20Deep%20Service%201%20Touch.mp4?alt=media&token=c22f31f3-8a79-4f84-8cfe-0a494ab36d17',
    right: 'https://firebasestorage.googleapis.com/v0/b/soccer-app-7147f.firebasestorage.app/o/videos%2FRight%20Foot%20Deep%20Service%201%20Touch.mp4?alt=media&token=c8765f59-87bd-41b3-ac22-7fbf8bd005d6'
  },
}

];
