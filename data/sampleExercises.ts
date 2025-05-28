// src/data/sampleExercises.ts

export interface Exercise {
  id: string;
  name: string;
  subcategory: string;
  positionCategory: string;
}

export const sampleExercises: Exercise[] = [
  // Crossing - Attacking Players
  {
    id: 'crossing-1',
    name: 'Early Service - 2 touch',
    subcategory: 'Crossing',
    positionCategory: 'Attacking Players',
  },
  {
    id: 'crossing-2',
    name: 'Early Service - 1v1',
    subcategory: 'Crossing',
    positionCategory: 'Attacking Players',
  },
  {
    id: 'crossing-3',
    name: '1v1 to endline - cutback',
    subcategory: 'Crossing',
    positionCategory: 'Attacking Players',
  },
  {
    id: 'crossing-4',
    name: '1v1 to endline - floated',
    subcategory: 'Crossing',
    positionCategory: 'Attacking Players',
  },

  // Finishing - Attacking Players
  {
    id: 'finishing-1',
    name: 'Out of air - 1 touch',
    subcategory: 'Finishing',
    positionCategory: 'Attacking Players',
  },
  {
    id: 'finishing-2',
    name: 'Out of air - 2 touch',
    subcategory: 'Finishing',
    positionCategory: 'Attacking Players',
  },
  {
    id: 'finishing-3',
    name: 'Forward touch to finish',
    subcategory: 'Finishing',
    positionCategory: 'Attacking Players',
  },
  {
    id: 'finishing-4',
    name: 'Open up to finish',
    subcategory: 'Finishing',
    positionCategory: 'Attacking Players',
  },
  {
    id: 'finishing-5',
    name: '1v1 w/ fake to low far post',
    subcategory: 'Finishing',
    positionCategory: 'Attacking Players',
  },
  {
    id: 'finishing-6',
    name: '1v1 to low far post',
    subcategory: 'Finishing',
    positionCategory: 'Attacking Players',
  },
];
