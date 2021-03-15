/* 
TabMerger as the name implies merges your tabs into one location to save
memory usage and increase your productivity.

Copyright (C) 2021  Lior Bragilevsky

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

If you have any questions, comments, or concerns you can contact the
TabMerger team at <https://lbragile.github.io/TabMerger-Extension/contact/>
*/

/**
 * @module CONSTANTS
 */

import React from "react";
import { getTimestamp } from "../components/App/App_helpers";
import { storeUserDetailsPriorToCheck } from "../components/App/App_functions";
import { DialogProps } from "../components/Extra/Dialog";

import {
  setStateType,
  Toast,
  userType,
  TierOptions,
  FontStyle,
  BadgeIconColors,
  DefaultGroup,
  DefaultSettings,
  DialogConstantReturn,
} from "../typings/common";

/* USER TIER INFORMATION */
/**
 * Subscription based limits on specific features
 * @default
 * ```json
 *  {
 *    Free: {
 *      NUM_TAB_LIMIT: 50 (15 during development),
 *      NUM_GROUP_LIMIT: 5 (3 during development),
 *      NUM_UNDO_STATES: 2 (1 during development)
 *    },
 *    Basic: {
 *      NUM_TAB_LIMIT: 250 (16 during development),
 *      NUM_GROUP_LIMIT: 15 (4 during development),
 *      NUM_UNDO_STATES: 5 (2 during development)
 *    },
 *    Standard: {
 *      NUM_TAB_LIMIT: 2500 (17 during development),
 *      NUM_GROUP_LIMIT: 50 (5 during development),
 *      NUM_UNDO_STATES: 10 (3 during development)
 *    },
 *    Premium: {
 *      NUM_TAB_LIMIT: 10000 (18 during development),
 *      NUM_GROUP_LIMIT: 100 (6 during development),
 *      NUM_UNDO_STATES: 15 (4 during development)
 *    }
 *  }
 * ```
 * */
export const USER: TierOptions = {
  Free: {
    NUM_TAB_LIMIT: process.env.REACT_APP_PRODUCTION ? 100 : 15,
    NUM_GROUP_LIMIT: process.env.REACT_APP_PRODUCTION ? 5 : 3,
    NUM_UNDO_STATES: process.env.REACT_APP_PRODUCTION ? 2 : 1,
  },
  Basic: {
    NUM_TAB_LIMIT: process.env.REACT_APP_PRODUCTION ? 500 : 16,
    NUM_GROUP_LIMIT: process.env.REACT_APP_PRODUCTION ? 25 : 4,
    NUM_UNDO_STATES: process.env.REACT_APP_PRODUCTION ? 5 : 2,
  },
  Standard: {
    NUM_TAB_LIMIT: process.env.REACT_APP_PRODUCTION ? 2000 : 17,
    NUM_GROUP_LIMIT: process.env.REACT_APP_PRODUCTION ? 100 : 5,
    NUM_UNDO_STATES: process.env.REACT_APP_PRODUCTION ? 10 : 3,
  },
  Premium: {
    NUM_TAB_LIMIT: process.env.REACT_APP_PRODUCTION ? 5000 : 18,
    NUM_GROUP_LIMIT: process.env.REACT_APP_PRODUCTION ? 250 : 6,
    NUM_UNDO_STATES: process.env.REACT_APP_PRODUCTION ? 20 : 4,
  },
};

/* TAB FONT STYLES */
/**
 * Allows the font of all text in TabMerger to be changed to a list of predefined fonts.
 * @default
 * ```json
 *  {
 *    Arial: "Arial, sans-serif",
 *    Verdana: "Verdana, sans-serif",
 *    Helvetica: "Helvetica, sans-serif",
 *    Tahoma: "Tahoma, sans-serif",
 *    "Trebuchet MS": "'Trebuchet MS', sans-serif",
 *    "Brush Script MT": "'Brush Script MT', cursive",
 *    Georgia: "Georgia, serif",
 *    Garamond: "Garamond, serif",
 *    "Courier New": "'Courier New', monospace",
 *    "Times New Roman": "'Times New Roman', serif"
 *  }
 * ```
 */
export const FONT_FAMILY: FontStyle = {
  Arial: "Arial, sans-serif",
  Verdana: "Verdana, sans-serif",
  Helvetica: "Helvetica, sans-serif",
  Tahoma: "Tahoma, sans-serif",
  "Trebuchet MS": "'Trebuchet MS', sans-serif",
  "Brush Script MT": "'Brush Script MT', cursive",
  Georgia: "Georgia, serif",
  Garamond: "Garamond, serif",
  "Courier New": "'Courier New', monospace",
  "Times New Roman": "'Times New Roman', serif",
};

/**
 * Allows the thickness of tab titles to be adjusted.
 * @default
 * ```json
 *  {
 *    Bold: "bold",
 *    Bolder: "bolder",
 *    Normal: "normal",
 *    Lighter: "lighter",
 *    Light: "100"
 *  }
 * ```
 */
export const FONT_WEIGHT: FontStyle = {
  Bold: "bold",
  Bolder: "bolder",
  Normal: "normal",
  Lighter: "lighter",
  Light: "100",
};

/* GROUP RELATED DEFAULTS */
/** The default group title seen in TabMerger before any configuration is done.
 * @default "Title"
 */
export const DEFAULT_GROUP_TITLE: string = "Title";

/** The default group color seen in TabMerger before any configuration is done.
 *  @default "#dedede"
 */
export const DEFAULT_GROUP_COLOR: string = "#dedede";

/**
 * Used when determining if a group's theme should be toggled between dark & light mode.
 * @default "#777777"
 */
export const GROUP_COLOR_THRESHOLD: string = "#777777";

/* EXTENSION ICON DEFAULTS (BADGE ICON) */
/** How many tabs to consider before changing the background color of the extension button text
 * @default 25
 */
export const BADGE_ICON_STEP_SIZE: number = 25;

/**
 * These are the background colors of the text shown on the extension icon
 * @default
 * ```json
 *  {
 *    green: "#060",
 *    yellow: "#CC0",
 *    orange: "#C70",
 *    red: "#C00"
 *  }
 * ```
 */
export const BADGE_ICON_COLORS: BadgeIconColors = { green: "#060", yellow: "#CC0", orange: "#C70", red: "#C00" };

/**
 * What the extension button says when you hover over it.
 * @default "Merge your tabs into groups"
 */
export const BADGE_ICON_DEFAULT_TITLE: string = "Merge your tabs into groups";

/* STORAGE AND INPUT LIMITS */
/** Sync storage limit per group - JSON serialization of a group cannot be longer than this
 *  @default 8000 (500 during developement/testing)
 */
export const ITEM_STORAGE_LIMIT: number = process.env.REACT_APP_PRODUCTION ? 8000 : 500;

/**
 * Sync storage total limit - JSON serialization of TabMerger's configuration cannot be longer than this
 * @default 102000 (1000 during developement/testing)
 */
export const SYNC_STORAGE_LIMIT: number = process.env.REACT_APP_PRODUCTION ? 102000 : 1000;

/**
 * The maximum length of a group title before the typing stops.
 * @note Depending on screen size, you might see significantly less characters
 * @default 50
 */
export const TITLE_TRIM_LIMIT: number = 50;

/* DEFAULT GROUP & SETTINGS */

export const DEFAULT_GROUP: DefaultGroup = {
  color: DEFAULT_GROUP_COLOR,
  created: getTimestamp(null),
  hidden: false,
  locked: false,
  starred: false,
  tabs: [],
  title: DEFAULT_GROUP_TITLE,
};

/**
 * For Premium members, this is the list from which the "randomizer" colors are chosen when forming a new group.
 * @default Obtained from [w3schools](https://www.w3schools.com/colors/colors_groups.asp) */
// prettier-ignore
export const RANDOM_COLOR_LIST: string[] = [
  "#ff9999", "#ff6666", "#ff3333", "#ff0000", "#cc0000", // red
  "#ffdb99", "#ffa366", "#ff8533", "#ff6600", "#cc5200", // orange
  "#ffff99", "#ffff66", "#ffff33", "#ffff00", "#cccc00", // yellow
  "#99ff99", "#66ff66", "#33ff33", "#00ff00", "#00cc00", // green
  "#99ffff", "#66ffff", "#33ffff", "#00ffff", "#00cccc", // cyan
  "#9999ff", "#6666ff", "#3333ff", "#0000ff", "#0000cc", // blue
  "#cc99ff", "#b366ff", "#9933ff", "#8000ff", "#6600cc", // purple
  "#ff99ff", "#ff66ff", "#ff33ff", "#ff00ff", "#cc00cc", // pink
  "#dedede", "#b3b3b3", "#999999", "#808080", "#666666", // grey
  "#666666", "#4d4d4d", "#333333", "#1a1a1a", "#000000", // black
  "#FFB6C1", "#FF69B4", "#FF1493", "#DB7093", "#C71585", // OTHERS
  "#E6E6FA", "#D8BFD8", "#DDA0DD", "#DA70D6", "#EE82EE",
  "#FF00FF", "#FF00FF", "#BA55D3", "#9932CC", "#9400D3",
  "#8A2BE2", "#8B008B", "#800080", "#9370DB", "#7B68EE",
  "#6A5ACD", "#483D8B", "#663399", "#4B0082", "#FFA07A",
  "#FA8072", "#E9967A", "#F08080", "#CD5C5C", "#DC143C",
  "#FF0000", "#B22222", "#8B0000", "#FFA500", "#FF8C00",
  "#FF7F50", "#FF6347", "#FF4500", "#FFD700", "#FFFF00",
  "#FFFFE0", "#FFFACD", "#FAFAD2", "#FFEFD5", "#FFE4B5",
  "#FFDAB9", "#EEE8AA", "#F0E68C", "#BDB76B", "#ADFF2F",
  "#7FFF00", "#7CFC00", "#00FF00", "#32CD32", "#98FB98",
  "#90EE90", "#00FA9A", "#00FF7F", "#3CB371", "#2E8B57",
  "#228B22", "#008000", "#006400", "#9ACD32", "#6B8E23",
  "#556B2F", "#66CDAA", "#8FBC8F", "#20B2AA", "#008B8B",
  "#008080", "#00FFFF", "#00FFFF", "#E0FFFF", "#AFEEEE",
  "#7FFFD4", "#40E0D0", "#48D1CC", "#00CED1", "#5F9EA0",
  "#4682B4", "#B0C4DE", "#ADD8E6", "#B0E0E6", "#87CEFA",
  "#87CEEB", "#6495ED", "#00BFFF", "#1E90FF", "#4169E1",
  "#0000FF", "#0000CD", "#00008B", "#000080", "#191970",
  "#FFF8DC", "#FFEBCD", "#FFE4C4", "#FFDEAD", "#F5DEB3",
  "#DEB887", "#D2B48C", "#BC8F8F", "#F4A460", "#DAA520",
  "#B8860B", "#CD853F", "#D2691E", "#808000", "#8B4513",
  "#A0522D", "#A52A2A", "#800000", "#FFFFFF", "#FFFAFA",
  "#F0FFF0", "#F5FFFA", "#F0FFFF", "#F0F8FF", "#F8F8FF",
  "#F5F5F5", "#FFF5EE", "#F5F5DC", "#FDF5E6", "#FFFAF0",
  "#FFFFF0", "#FAEBD7", "#FAF0E6", "#FFF0F5", "#FFE4E1",
  "#DCDCDC", "#D3D3D3", "#C0C0C0", "#A9A9A9", "#696969",
  "#808080", "#778899", "#708090", "#2F4F4F"
];

/**
 * The frequency of JSON backup operations
 * @default 0 (disabled) */
export const DEFAULT_BACKUP_PERIOD_IN_MINUTES: number = 0;

export const DEFAULT_SETTINGS: DefaultSettings = {
  badgeInfo: true,
  blacklist: "",
  color: DEFAULT_GROUP_COLOR,
  dark: true,
  fileLimitBackup: 15,
  font: "Arial",
  merge: true,
  open: true,
  periodBackup: DEFAULT_BACKUP_PERIOD_IN_MINUTES,
  pin: true,
  randomizeColor: false,
  relativePathBackup: "TabMerger/",
  restore: true,
  saveAsVisibility: true,
  syncPeriodBackup: DEFAULT_BACKUP_PERIOD_IN_MINUTES,
  title: DEFAULT_GROUP_TITLE,
  tooltipVisibility: true,
  weight: "Normal",
};

/* DATABASE & SUBSCRIPTION LINKS */
/**
 * The database user where users can have their subscriptions verified
 */
export const USER_STATUS_URL: string = process.env.REACT_APP_PRODUCTION ? "https://tabmerger-backend.herokuapp.com/customer/" : "http://localhost:5000/customer/"; // prettier-ignore

/**
 * TabMerger's pricing page
 * @default [Official Homepage Pricing](https://lbragile.github.io/TabMerger-Extension/pricing)
 */
export const SUBSCRIPTION_URL: string = process.env.REACT_APP_PRODUCTION ? "https://lbragile.github.io/TabMerger-Extension/pricing" : "http://localhost:3000/TabMerger-Extension/pricing"; // prettier-ignore

/* TOASTS */

/**
 * Whenever a user's subscription does not allow them to use a given feature.
 */
export const SUBSCRIPTION_TOAST: Toast = [
  <div className="text-left">
    To use this feature, you need to <b>upgrade</b> your TabMerger subscription.
    <br />
    <br />
    Please visit our official homepage's{" "}
    <a href={SUBSCRIPTION_URL} target="_blank" rel="noreferrer">
      Subscriptions & Pricing
    </a>{" "}
    page for more information.
  </div>,
  { toastId: "subscription_toast" },
];

/**
 * When a user tries to click the sync write button but they either cannot due to Sync restrictions or their current subscription.
 */
export const SYNC_WRITE_TOAST: Toast = [
  <div className="text-left">
    Either one (or more) of your groups exceed(s) their respective sync limit <u>or</u> the total sync limit is exceeded
    - see TabMerger's sync indicators. <br /> <br />
    Please adjust these as needed by doing <b>one or both</b> of the following:
    <ul style={{ marginLeft: "25px" }}>
      <li>Delete tabs that are no longer important/relevant to you;</li>
      <li>Delete some tab groups for the same reasoning as above.</li>
    </ul>
    Perform these actions until the corresponding indicators are no longer visible in TabMerger.
  </div>,
  { toastId: "syncWrite_exceed" },
];

/**
 * Occurs during the merging process to provide warning to the user about exceeding their limits.
 * @param {string} tier The user's subscription tier
 * @returns {Toast} A toast message indicating that there is an issue and how to resolve it.
 */
export const CHECK_MERGING_TOAST: Function = (tier: string): Toast => [
  <div className="text-left">
    This would exceed your plan's ({tier} Tier) tab limit of <b>{USER[tier].NUM_TAB_LIMIT}</b>!<br />
    <br />
    To successfully execute this action you should do <b>one</b> of the following:
    <ul style={{ marginLeft: "25px" }}>
      <li>If you are merging tabs into TabMerger, try to merge less tabs;</li>
      <li>Remove a few tabs that are not as important/relevant to you anymore;</li>
      <li>
        Upgrade your subscription by visiting our official homepage's{" "}
        <a href={SUBSCRIPTION_URL} target="_blank" rel="noreferrer">
          Subscriptions & Pricing
        </a>
      </li>
    </ul>
  </div>,
  { toastId: "tabExceed_toast" },
];

/**
 * Shown when the user's group limit will be exceeded if the action is allowed.
 * @param {number} NUM_GROUP_LIMIT number of groups that the user can make (based on subscription)
 * @returns {Toast} A toast message indicating that there is an issue and how to resolve it.
 */
export const ADD_GROUP_TOAST: Function = (NUM_GROUP_LIMIT: number): Toast => [
  <div className="text-left">
    Number of groups exceeded (more than <b>{NUM_GROUP_LIMIT}</b>).
    <br />
    <br />
    Please do <b>one</b> of the following:
    <ul style={{ marginLeft: "25px" }}>
      <li>Delete a group that is no longer needed;</li>
      <li>Merge tabs into another existing group;</li>
      <li>
        Upgrade your TabMerger subscription (
        <a href={SUBSCRIPTION_URL} target="_blank" rel="noreferrer">
          Subscriptions & Pricing
        </a>
        ).
      </li>
    </ul>
  </div>,
  { toastId: "addGroup_toast" },
];

/**
 * Shown when there are no more undo states left after a user clicks on the global Undo State button.
 */
export const UNDO_DESTRUCTIVE_ACTION_TOAST: Toast = [
  <div className="text-left">
    There are <b>no more</b> states to undo. <br />
    <br />
    States are created with <u>destructive actions</u>! <br />
    <br />
    Upgrading your subscription will increase the number of undos that can be performed. <br />
    <br />
    Please visit our official homepage's{" "}
    <a href={SUBSCRIPTION_URL} target="_blank" rel="noreferrer">
      Subscriptions & Pricing
    </a>{" "}
    page for more information.
  </div>,
  { toastId: "undoStates_toast" },
];

/**
 * If a user imports an incorrect configuration file (wrong format).
 */
export const IMPORT_JSON_TOAST: Toast = [
  <div className="text-left">
    You must import a JSON file <i>(.json extension)</i>!<br />
    <br />
    These can be generated via the <b>Export JSON</b> button.
    <br />
    <br />
    <b>Be careful</b>, <u>only import JSON files generated by TabMerger</u>, otherwise you risk losing your current
    configuration!
  </div>,
  { toastId: "importJSON_toast" },
];

/**
 * Drag and drop from URL address bar when the tab is already in TabMerger
 */
export const ADD_TAB_FROM_URL_TOAST: Toast = [
  <div className="text-left">That tab is already in TabMerger!</div>,
  { toastId: "addTabFromURL_toast" },
];

/**
 * User attempts to delete a locked group
 */
export const DELETE_GROUP_TOAST: Toast = [
  <div className="text-left">
    This group is <b>locked</b>, thus it cannot be deleted. <br />
    <br /> Press the <b>lock</b> symbol to first <i>unlock</i> the group and then retry deleting it again!
  </div>,
  { toastId: "deleteGroup_toast" },
];

/**
 * User attempts to delete a tab in a locked group
 */
export const REMOVE_TAB_TOAST: Toast = [
  <div className="text-left">
    This group is <b>locked</b> and thus tabs inside cannot be deleted. <br />
    <br /> Press the <b>lock</b> symbol to first <i>unlock</i> the group and then retry deleting the tab again!
  </div>,
  { toastId: "removeTab_toast" },
];

/**
 * Incorrect/error in saving path for automatic JSON backup. Only applies to Premium members.
 */
export const DOWNLOAD_ERROR_TOAST: Toast = [
  <div className="text-left">
    The <b>relative path</b> you have set in the settings is <b>not valid</b>, please adjust it.
  </div>,
  { toastId: "relativePathError_toast" },
];

/**
 * Indicator that automatic JSON backup was turned off.
 */
export const JSON_AUTOBACKUP_OFF_TOAST: Toast = [
  <div className="text-left">
    Automatic JSON file generation/backup was turned off since the saving period was set to 0 minutes.
  </div>,
  { toastId: "automaticBackupOff_toast" },
];

/**
 * Indication that Sync backup was turned off.
 */
export const SYNC_AUTOBACKUP_OFF_TOAST: Toast = [
  <div className="text-left">
    Automatic sync write backup was turned off since the saving period was set to 0 minutes.
  </div>,
  { toastId: "automaticBackupOff_toast" },
];

/**
 * Whenever an update to TabMerger is published and the user opens it for the first time.
 * @param {string} previousVersion The version of TabMerger prior to the update
 * @param {string} currentVersion The version of TabMerger after the update
 * @returns {Toast} A toast message indicating that there is an issue and how to resolve it.
 */
export const UPDATE_TOAST: Function = (previousVersion: string, currentVersion: string): Toast => [
  <div className="text-left">
    TabMerger was updated from <b>v{previousVersion}</b> to <b>v{currentVersion}</b>!
  </div>,
  { toastId: "update_toast", autoClose: false, position: "top-right" },
];

/* MODAL DIALOG */
/**
 * When the user presses the global Open All button
 * @param {HTMLButtonElement} element the button that was pressed (needed to set attribute of response)
 * @returns {DialogConstantReturn} Confirmation request to perform the given action
 */
export const OPEN_ALL_DIALOG: Function = (element: HTMLButtonElement): DialogConstantReturn => ({
  element,
  show: true,
  title: "✔ TabMerger Confirmation Request ❌",
  msg: (
    <div>
      Are you sure you want to open <b>ALL</b> your tabs at once?
      <br />
      <br></br>We do <b>not</b> recommend opening <u>more than 100 tabs</u> at once as it may overload your system!
    </div>
  ),
  accept_btn_text: "YES, OPEN ALL",
  reject_btn_text: "CANCEL",
});

/**
 * When the user presses the global Delete All button
 * @param {HTMLButtonElement} element the button that was pressed (needed to set attribute of response)
 * @returns {DialogConstantReturn} Confirmation request to perform the given action
 */
export const DELETE_ALL_DIALOG: Function = (element: HTMLButtonElement): DialogConstantReturn => ({
  element,
  show: true,
  title: "✔ TabMerger Confirmation Request ❌",
  msg: (
    <div>
      Are you sure?
      <br />
      <br />
      This action will delete <b>ALL</b> groups/tabs that are <u>not locked</u>.<br />
      <br />
      Make sure you have a backup!
    </div>
  ),
  accept_btn_text: "YES, DELETE ALL",
  reject_btn_text: "CANCEL",
});

/**
 * When the user clicks on the global Need Help button.
 * @param {HTMLButtonElement} element the button that was pressed (needed to set attribute of response)
 * @returns {DialogConstantReturn} A navigation proposal (tutorial or official homepage) that the user can select from
 */
export const RESET_TUTORIAL_CHOICE_DIALOG: Function = (element: HTMLButtonElement): DialogConstantReturn => ({
  element,
  show: true,
  title: "✋ TabMerger Question ❔",
  msg: (
    <div>
      Press <b>VIEW TUTORIAL</b> to get a walkthrough of TabMerger's main features{" "}
      <u>
        <i>OR</i>
      </u>{" "}
      <b>GO TO SITE</b> to visit TabMerger's official homepage!
    </div>
  ),
  accept_btn_text: "VIEW TUTORIAL",
  reject_btn_text: "GO TO SITE",
});

/**
 * Stores the user's credentials in TabMerger for later verification of their subscription.
 * @param {setStateType<userType>} setUser For updating the user's credential information
 * @param {setStateType<{ show: boolean }>} setDialog For re-rendering the dialog message
 * @returns {DialogConstantReturn} A form that can be filled out by the user to provide their credentials
 */
export const SET_USER_STATUS_DIALOG: Function = (
  setUser: setStateType<userType>,
  setDialog: setStateType<{ show: boolean }>
): DialogConstantReturn => ({
  element: null,
  show: true,
  title: "🔐 TabMerger Product Activation 🔐",
  msg: (
    <div>
      <form id="activation-form" onSubmit={(e) => storeUserDetailsPriorToCheck(e, setUser, setDialog)}>
        <label>
          <b>Email:</b>
        </label>
        <br />
        <input
          type="email"
          name="email"
          className="p-1"
          placeholder="Email you used during checkout..."
          autoFocus={true}
          autoComplete="true"
          required
        />
        <br />
        <br />
        <label>
          <b>Activation Key:</b>
        </label>
        <br />
        <input type="password" name="password" className="p-1" placeholder="From our email..." minLength={6} required />
        <br />
        <br />
        <button type="submit" className="btn btn-outline-primary text-primary">
          Activate
        </button>
      </form>
    </div>
  ),
  accept_btn_text: null,
  reject_btn_text: null,
});
