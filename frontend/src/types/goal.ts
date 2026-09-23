export type GoalStatus = "IN_PROGRESS" | "ACHIEVED" | "CANCELLED";

export interface Goal {
  id: number;
  userId: number;
  goalName: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
  status: GoalStatus;
  createdAt?: string;
  updatedAt?: string;
}

export type NewGoalInput = Omit<Goal, "id" | "createdAt" | "updatedAt">;
