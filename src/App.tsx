import { useContext } from 'react';
import RegisterUser from './components/RegisterUser';
import { Context } from './context';
import { steps } from './helpers/steps';

function App() {
  const { formStepsState } = useContext(Context);

  return (
    <>
      <h1>Register Form</h1>
      <h3>{`Step ${formStepsState.activeStep + 1}: ${steps[formStepsState.activeStep]?.title}`}</h3>
      <RegisterUser />
    </>
  );
}

export default App;
