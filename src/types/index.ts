export interface UserType {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  password: string;
  confirmPassword: string;
}

export type FormStepsType = {
  activeStep: number;
};

export type ActionType = {
  type: string;
  payload?: any;
};
