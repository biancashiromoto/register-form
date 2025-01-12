import { useEffect, useState } from 'react';
import Select from '../Select';
import { ICountry, IState, State } from 'country-state-city';

export type SelectStateProps = {
  setValue: any;
  errors: any;
  shouldShow: boolean;
  register: any;
  selectedCountry: ICountry;
};

const SelectState = ({
  setValue,
  errors,
  shouldShow,
  register,
  selectedCountry,
}: SelectStateProps) => {
  const [states, setStates] = useState([] as IState[]);

  useEffect(() => {
    const filteredStates = State.getStatesOfCountry(selectedCountry.isoCode);
    setStates(filteredStates);
  }, [selectedCountry]);

  return (
    <Select
      register={register}
      label="Choose a state"
      shouldShow={shouldShow}
      setValue={setValue}
      errors={errors}
      name="state"
      options={states}
      displayedValue="name"
    />
  );
};

export default SelectState;
