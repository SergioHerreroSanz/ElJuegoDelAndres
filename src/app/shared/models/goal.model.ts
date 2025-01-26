export interface EjdaGoal {
  id: string;
  name: string;
  price: number;
  status: EjdaGoalStatus;
}

export enum EjdaGoalStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}
