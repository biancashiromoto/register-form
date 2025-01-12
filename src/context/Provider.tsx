import { formStepsReducer } from '@/reducers/formStepsReducer';
import { FormStepsType } from '@/types';
import { FC, ReactNode, useReducer } from 'react';
import { Context } from '.';

const INITIAL_STEPS_STATE: FormStepsType = {
  activeStep: 0,
};

const Provider: FC<{ children: ReactNode }> = ({ children }) => {
  const [formStepsState, formStepsDispatch] = useReducer(
    formStepsReducer,
    INITIAL_STEPS_STATE,
  );

  return (
    <Context.Provider
      value={{
        formStepsState,
        formStepsDispatch,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
