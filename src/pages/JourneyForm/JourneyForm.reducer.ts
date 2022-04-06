type FormAction =
  | { type: "CHANGE_TITLE"; props: { value: string; isValid: boolean } }
  | { type: "CHANGE_DESC"; props: { value: string; isValid: boolean } }
  | { type: "CHANGE_START_DATE"; props: { value: string; isValid: boolean } }
  | { type: "CHANGE_END_DATE"; props: { value: string; isValid: boolean } };

interface FormState {
  isFormValid: boolean;
  title: string;
  isTitleValid: boolean;
  description: string;
  isDescriptionValid: boolean;
  startDate: string;
  isStartDateValid: boolean;
  endDate: string;
  isEndDateValid: boolean;
}

export const INITIAL_STATE: FormState = {
  isFormValid: false,
  title: "",
  isTitleValid: false,
  description: "",
  isDescriptionValid: false,
  startDate: "",
  isStartDateValid: false,
  endDate: "",
  isEndDateValid: false,
};

const checkFormValidity = (formState: FormState): boolean => {
  return [formState.isTitleValid, formState.isDescriptionValid, formState.isStartDateValid, formState.isEndDateValid].every((isValid) => !!isValid);
};

export const formReducer = (state: FormState, action: FormAction): FormState => {
  const nextState: FormState = { ...state };

  switch (action.type) {
    case "CHANGE_TITLE":
      nextState.title = action.props.value;
      nextState.isTitleValid = action.props.isValid;
      return {
        ...nextState,
        isFormValid: checkFormValidity(nextState),
      };
    case "CHANGE_DESC":
      nextState.description = action.props.value;
      nextState.isDescriptionValid = action.props.isValid;
      return {
        ...nextState,
        isFormValid: checkFormValidity(nextState),
      };
    case "CHANGE_START_DATE":
      nextState.startDate = action.props.value;
      nextState.isStartDateValid = action.props.isValid;
      return {
        ...nextState,
        isFormValid: checkFormValidity(nextState),
      };
    case "CHANGE_END_DATE":
      nextState.endDate = action.props.value;
      nextState.isEndDateValid = action.props.isValid;
      return {
        ...nextState,
        isFormValid: checkFormValidity(nextState),
      };
    default:
      throw new Error("[JourneyForm] Invalid action type has been dispatched.");
  }
};
