/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { DraggableLocation } from "react-beautiful-dnd";

import { GROUPS_ACTIONS, IGroupsState, ISidePanelDnd } from "../reducers/groups";

const updateAvailable = (payload?: IGroupsState["available"]) => ({ type: GROUPS_ACTIONS.UPDATE_AVAILABLE, payload });

const updateActive = (payload?: IGroupsState["active"]) => ({ type: GROUPS_ACTIONS.UPDATE_ACTIVE, payload });

const updateName = (payload?: { index: number; name: string }) => ({ type: GROUPS_ACTIONS.UPDATE_NAME, payload });

const updateColor = (payload?: { index: number; color: string }) => ({ type: GROUPS_ACTIONS.UPDATE_COLOR, payload });

const updateTimestamp = (payload?: { index: number; updatedAt: number }) => ({
  type: GROUPS_ACTIONS.UPDATE_TIMESTAMP,
  payload
});

const updateWindows = (payload?: { index: number; windows: chrome.windows.Window[] }) => ({
  type: GROUPS_ACTIONS.UPDATE_WINDOWS,
  payload
});

const updateWindowsFromGroupDnd = (payload?: ISidePanelDnd) => ({
  type: GROUPS_ACTIONS.UPDATE_WINDOWS_FROM_GROUP_DND,
  payload
});

const updateWindowsFromSidePanelDnd = (payload?: ISidePanelDnd) => ({
  type: GROUPS_ACTIONS.UPDATE_WINDOWS_FROM_SIDEPANEL_DND,
  payload
});

const updateTabs = (payload?: { groupIdx: number; windowIdx: number; tabs: chrome.tabs.Tab[] }) => ({
  type: GROUPS_ACTIONS.UPDATE_TABS,
  payload
});

const updateTabsFromGroupDnd = (payload?: ISidePanelDnd) => ({
  type: GROUPS_ACTIONS.UPDATE_TABS_FROM_GROUP_DND,
  payload
});

const updateTabsFromSidePanelDnd = (payload?: ISidePanelDnd) => ({
  type: GROUPS_ACTIONS.UPDATE_TABS_FROM_SIDEPANEL_DND,
  payload
});

const updateInfo = (payload?: { index: number; info?: string }) => ({ type: GROUPS_ACTIONS.UPDATE_INFO, payload });

const updatePermanent = (payload?: boolean) => ({ type: GROUPS_ACTIONS.UPDATE_PERMANENT, payload });

const addGroup = () => ({ type: GROUPS_ACTIONS.ADD_GROUP });

const deleteGroup = (payload?: number) => ({ type: GROUPS_ACTIONS.DELETE_GROUP, payload });

const deleteWindow = (payload?: { groupIndex: number; windowIndex: number }) => ({
  type: GROUPS_ACTIONS.DELETE_WINDOW,
  payload
});

const clearEmptyGroups = () => ({ type: GROUPS_ACTIONS.CLEAR_EMPTY_GROUPS });

const addWindow = (payload?: { index: number }) => ({ type: GROUPS_ACTIONS.ADD_WINDOW, payload });

const clearEmptyWindows = (payload?: { index: number }) => ({ type: GROUPS_ACTIONS.CLEAR_EMPTY_WINDOWS, payload });

const updateGroupOrder = (payload?: { source: DraggableLocation; destination?: DraggableLocation }) => ({
  type: GROUPS_ACTIONS.UPDATE_GROUP_ORDER,
  payload
});

const closeWindow = (payload?: { windowIndex: number; groupIndex: number }) => ({
  type: GROUPS_ACTIONS.CLOSE_WINDOW,
  payload
});

const closeTab = (payload?: { tabIndex: number; windowIndex: number; groupIndex: number }) => ({
  type: GROUPS_ACTIONS.CLOSE_TAB,
  payload
});

const toggleWindowIncognito = (payload?: { windowIndex: number; groupIndex: number }) => ({
  type: GROUPS_ACTIONS.TOGGLE_WINDOW_INCOGNITO,
  payload
});

const toggleWindowStarred = (payload?: { windowIndex: number; groupIndex: number }) => ({
  type: GROUPS_ACTIONS.TOGGLE_WINDOW_STARRED,
  payload
});

const duplicateGroup = (payload?: number) => ({ type: GROUPS_ACTIONS.DUPLICATE_GROUP, payload });

const replaceWithCurrent = (payload?: number) => ({ type: GROUPS_ACTIONS.REPLACE_WITH_CURRENT, payload });

const mergeWithCurrent = (payload?: number) => ({ type: GROUPS_ACTIONS.MERGE_WITH_CURRENT, payload });

const uniteWindows = (payload?: number) => ({ type: GROUPS_ACTIONS.UNITE_WINDOWS, payload });

const splitWindows = (payload?: number) => ({ type: GROUPS_ACTIONS.SPLIT_WINDOWS, payload });

const sortByTabTitle = (payload?: number) => ({ type: GROUPS_ACTIONS.SORT_BY_TAB_TITLE, payload });

const sortByTabUrl = (payload?: number) => ({ type: GROUPS_ACTIONS.SORT_BY_TAB_URL, payload });

export default {
  updateAvailable,
  updateActive,
  updateName,
  updateColor,
  updateTimestamp,
  updateWindows,
  updateWindowsFromGroupDnd,
  updateWindowsFromSidePanelDnd,
  updateTabs,
  updateTabsFromGroupDnd,
  updateTabsFromSidePanelDnd,
  updateInfo,
  updatePermanent,
  addGroup,
  deleteGroup,
  deleteWindow,
  clearEmptyGroups,
  addWindow,
  clearEmptyWindows,
  updateGroupOrder,
  closeWindow,
  closeTab,
  toggleWindowIncognito,
  toggleWindowStarred,
  duplicateGroup,
  replaceWithCurrent,
  mergeWithCurrent,
  uniteWindows,
  splitWindows,
  sortByTabTitle,
  sortByTabUrl
};
