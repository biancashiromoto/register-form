export interface UserType {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  phone: string;
  countryCode: string;
  country: string;
}

export type FormStepsType = {
  activeStep: number;
};

export type ActionType = {
  type: string;
  payload?: any;
};
