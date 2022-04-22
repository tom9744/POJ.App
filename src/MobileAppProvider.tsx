import React, { Dispatch, useReducer, createContext, useContext } from "react";

type State = { isAuthorized: boolean };
type Action = { name: "AUTHORIZE_USER" };
type Dispatcher = Dispatch<Action>;

const INITIAL_STATE = {
  isAuthorized: false,
};

const StateContext = createContext<State | null>(null);
const DispatcherContext = createContext<Dispatcher | null>(null);

const reducer = (state: State, action: Action): State => {
  switch (action.name) {
    case "AUTHORIZE_USER":
      return {
        ...state,
        isAuthorized: true,
      };
  }
};

export const MobileAppProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  return (
    <StateContext.Provider value={state}>
      <DispatcherContext.Provider value={dispatch}>
        {children}
      </DispatcherContext.Provider>
    </StateContext.Provider>
  );
};

export const useMobileAppState = () => {
  const state = useContext(StateContext);

  if (!state) throw new Error("Could not find MobileAppProvider");

  return state;
};

export const useMobileAppDispatch = () => {
  const dispatch = useContext(DispatcherContext);

  if (!dispatch) throw new Error("Could not find MobileAppProvider");

  return dispatch;
};
