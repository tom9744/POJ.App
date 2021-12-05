import { useCallback, useReducer } from "react";

class HttpError extends Error {
  constructor(public statusCode: number, public message: string) {
    super(message);
  }
}

interface FetchConfiguration {
  url: RequestInfo;
  options?: RequestInit;
}

interface RequestState {
  showError: boolean;
  showLoading: boolean;
  errorMessage: string;
}

type RequestAction =
  | { type: "LOADING" }
  | { type: "SUCCSESS" }
  | { type: "ERROR"; message: string };

const requestReducer = (
  state: RequestState,
  action: RequestAction
): RequestState => {
  switch (action.type) {
    case "LOADING":
      return { showError: false, showLoading: true, errorMessage: "" };
    case "SUCCSESS":
      return { showError: false, showLoading: false, errorMessage: "" };
    case "ERROR":
      return {
        showError: true,
        showLoading: false,
        errorMessage: action.message,
      };
    default:
      throw new Error("[useHttp] Invalid action type has been dispatched.");
  }
};

const useHttp = <T>(): {
  requestState: RequestState;
  sendRequest: (config: FetchConfiguration) => Promise<T>;
} => {
  const [requestState, dispatchRequestAction] = useReducer(requestReducer, {
    showLoading: false,
    showError: false,
    errorMessage: "",
  });

  const sendRequest = useCallback(
    async (config: FetchConfiguration): Promise<T> => {
      dispatchRequestAction({ type: "LOADING" });

      try {
        const response = await fetch(config.url, config.options);

        if (!response.ok) {
          const errorData = new HttpError(response.status, response.statusText);
          throw errorData;
        }

        dispatchRequestAction({ type: "SUCCSESS" });

        return await response.json();
      } catch (error) {
        const errorMessage =
          error instanceof HttpError
            ? "서버와 통신하는 도중에 오류가 발생했습니다."
            : "서버가 응답하지 않습니다. 잠시 후 다시 시도해주세요.";

        dispatchRequestAction({ type: "ERROR", message: errorMessage });

        throw error;
      }
    },
    []
  );

  return {
    requestState,
    sendRequest,
  };
};

export default useHttp;
