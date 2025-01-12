import { steps } from '@/helpers/steps';
import { ActionType, FormStepsType } from '@/types';

const MAX_STEPS = steps.length;

export const formStepsReducer = (state: FormStepsType, action: ActionType) => {
  switch (action.type) {
    case 'NEXT_STEP':
      return {
        ...state,
        activeStep:
          state.activeStep < MAX_STEPS - 1
            ? state.activeStep + 1
            : state.activeStep,
      };
    case 'PREVIOUS_STEP':
      return {
        ...state,
        activeStep: state.activeStep > 0 ? state.activeStep - 1 : 0,
      };
    case 'RESET':
      return {
        ...state,
        activeStep: 0,
      };
    default:
      return state;
  }
};
