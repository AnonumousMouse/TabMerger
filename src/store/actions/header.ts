/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { HEADER_ACTIONS } from "../reducers/header";

export const setTyping = (payload: boolean | undefined) => ({ type: HEADER_ACTIONS.SET_TYPING, payload });

export const updateInputValue = (payload: string | undefined) => ({ type: HEADER_ACTIONS.UPDATE_INPUT_VALUE, payload });

export const setFilterChoice = (payload: { search: string; include: string } | undefined) => ({
  type: HEADER_ACTIONS.SET_FILTER_CHOICE,
  payload
});
