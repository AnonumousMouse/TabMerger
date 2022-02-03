import { createContext, useMemo, useReducer } from "react";

import type { Dispatch} from "react";
import type { TRootActions, TRootState } from "~/typings/redux";

import useReducerLogger from "~/hooks/useReducerLogger";
import { rootReducer, rootState } from "~/store";

export const ReduxStore = createContext<{ state: TRootState; dispatch: Dispatch<TRootActions> }>({
  state: rootState,
  dispatch: () => ""
});

const StoreProvider = ({ children }: { children: JSX.Element }) => {
  const loggedReducer = useReducerLogger(rootReducer);

  const [state, dispatch] = useReducer(process.env.NODE_ENV === "development" ? loggedReducer : rootReducer, rootState);

  const store = useMemo(() => ({ state, dispatch }), [state]);

  return <ReduxStore.Provider value={store}>{children}</ReduxStore.Provider>;
};

export default StoreProvider;
