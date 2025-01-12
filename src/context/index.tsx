import { ActionType } from '@/types';
import { createContext, Dispatch } from 'react';

export interface ContextProps {
  formStepsState: { activeStep: number };
  formStepsDispatch: Dispatch<ActionType>;
}
export const Context = createContext({} as ContextProps);
