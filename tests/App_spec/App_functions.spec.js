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

import React from "react";
window.React = React;

import { render, waitFor, act } from "@testing-library/react";

import * as AppFunc from "../../src/components/App/App_functions";
import * as AppHelper from "../../src/components/App/App_helpers";

import * as GroupFunc from "../../src/components/Group/Group_functions";

import App from "../../src/components/App/App";
import { exportedVal } from "../__mocks__/jsonImportMock";
import { TUTORIAL_GROUP } from "../../src/components/Extra/Tutorial";

var chromeSyncSetSpy, chromeSyncGetSpy, chromeSyncRemoveSpy;
var chromeLocalSetSpy, chromeLocalGetSpy, chromeLocalRemoveSpy;
var mockSet, container, sync_node, anything, setBGColor;

beforeAll(() => {
  mockSet = jest.fn(); // mock for setState hooks
  anything = expect.anything();
  console.error = jest.fn();
  console.warn = jest.fn();
  setBGColor = jest.spyOn(GroupFunc, "setBGColor").mockImplementation(() => {});

  chromeSyncSetSpy = jest.spyOn(chrome.storage.sync, "set");
  chromeSyncGetSpy = jest.spyOn(chrome.storage.sync, "get");
  chromeSyncRemoveSpy = jest.spyOn(chrome.storage.sync, "remove");

  chromeLocalSetSpy = jest.spyOn(chrome.storage.local, "set");
  chromeLocalGetSpy = jest.spyOn(chrome.storage.local, "get");
  chromeLocalRemoveSpy = jest.spyOn(chrome.storage.local, "remove");

  jest.clearAllMocks();
});

beforeEach(() => {
  container = render(<App />).container;
  sync_node = container.querySelector("#sync-text span");

  Object.keys(init_groups).forEach((key) => {
    sessionStorage.setItem(key, JSON.stringify(init_groups[key]));
  });

  localStorage.setItem("groups", JSON.stringify(init_groups));
});

afterEach(() => {
  sessionStorage.clear();
  localStorage.clear();
  jest.clearAllMocks();
});

describe("badgeIconInfo", () => {
  var chromeBrowserActionSetBadgeTextSpy = jest.spyOn(chrome.browserAction, "setBadgeText");
  var chromeBrowserActionSetBadgeBackgroundColorSpy = jest.spyOn(chrome.browserAction, "setBadgeBackgroundColor");
  var chromeBrowserActionSetTitleSpy = jest.spyOn(chrome.browserAction, "setTitle");

  const COLORS = { green: "#060", yellow: "#CC0", orange: "#C70", red: "#C00" };

  test.each([
    [1, COLORS.green, false],
    [20, COLORS.green, false],
    [40, COLORS.yellow, false],
    [60, COLORS.orange, false],
    [80, COLORS.red, false],
    [80, COLORS.red, true],
  ])("color, text, and title are correct for %s tabs", (num_tabs, color, one_group) => {
    const expected_title = `You currently have ${num_tabs} ${num_tabs === 1 ? "tab" : "tabs"} in ${one_group ? 1 + " group" : 4 + " groups"}`; // prettier-ignore
    const expected_text = `${num_tabs}|${one_group ? 1 : 4}`;

    if (one_group) {
      localStorage.setItem("groups", JSON.stringify({ "group-0": default_group }));
    }

    jest.clearAllMocks();

    AppFunc.badgeIconInfo(num_tabs);

    expect(chromeSyncGetSpy).toHaveBeenCalledTimes(1);
    expect(chromeSyncGetSpy).toHaveBeenCalledWith("settings", anything);

    expect(chromeLocalGetSpy).toHaveBeenCalledTimes(1);
    expect(chromeLocalGetSpy).toHaveBeenCalledWith("groups", anything);

    expect(chromeBrowserActionSetBadgeTextSpy).toHaveBeenCalledTimes(1);
    expect(chromeBrowserActionSetBadgeTextSpy).toHaveBeenCalledWith({ text: expected_text }, anything);

    expect(chromeBrowserActionSetBadgeBackgroundColorSpy).toHaveBeenCalledTimes(1);
    expect(chromeBrowserActionSetBadgeBackgroundColorSpy).toHaveBeenCalledWith({ color }, anything);

    expect(chromeBrowserActionSetTitleSpy).toHaveBeenCalledTimes(1);
    expect(chromeBrowserActionSetTitleSpy).toHaveBeenCalledWith({ title: expected_title }, anything);
  });

  it("does nothing if there are no groups in local storage", () => {
    localStorage.removeItem("groups");
    jest.clearAllMocks();

    AppFunc.badgeIconInfo(10);

    expect(chromeSyncGetSpy).toHaveBeenCalledTimes(1);
    expect(chromeSyncGetSpy).toHaveBeenCalledWith("settings", anything);

    expect(chromeLocalGetSpy).toHaveBeenCalledTimes(1);
    expect(chromeLocalGetSpy).toHaveBeenCalledWith("groups", anything);

    expect(chromeBrowserActionSetBadgeTextSpy).not.toHaveBeenCalled();
    expect(chromeBrowserActionSetBadgeBackgroundColorSpy).not.toHaveBeenCalled();
    expect(chromeBrowserActionSetTitleSpy).not.toHaveBeenCalled();
  });
});

describe("storageInit", () => {
  test("sync settings are null & local groups are null", () => {
    sessionStorage.clear();
    localStorage.clear();
    localStorage.setItem("tour_needed", true);
    jest.clearAllMocks();

    AppFunc.storageInit(default_settings, default_group, sync_node, mockSet, mockSet, mockSet);
    localStorage.removeItem("tour_needed");

    expect(chromeSyncGetSpy).toHaveBeenCalledTimes(1);
    expect(chromeSyncGetSpy).toHaveBeenCalledWith(null, anything);

    expect(chromeSyncSetSpy).toHaveBeenCalledTimes(1);
    expect(chromeSyncSetSpy).toHaveBeenCalledWith({ settings: default_settings }, anything);

    expect(chromeLocalGetSpy).toHaveBeenCalledTimes(1);
    expect(chromeLocalGetSpy).toHaveBeenCalledWith(["groups", "tour_needed"], anything);

    expect(chromeLocalRemoveSpy).toHaveBeenCalledTimes(1);
    expect(chromeLocalRemoveSpy).toHaveBeenCalledWith(["groups"], anything);

    expect(chromeLocalSetSpy).toHaveBeenCalledTimes(1);
    expect(chromeLocalSetSpy).toHaveBeenCalledWith({ groups: { "group-0": default_group }, groups_copy: [], scroll: 0, tour_needed: false }, anything); // prettier-ignore

    expect(mockSet).toHaveBeenCalledTimes(3);
  });

  test("tour is needed", () => {
    localStorage.removeItem("groups");
    localStorage.setItem("tour_needed", false);
    jest.clearAllMocks();

    AppFunc.storageInit(default_settings, default_group, sync_node, mockSet, mockSet, mockSet);
    localStorage.setItem("tour_needed", true);

    expect(chromeLocalSetSpy).toHaveBeenCalledTimes(1);
    expect(chromeLocalSetSpy).toHaveBeenCalledWith({ groups: TUTORIAL_GROUP, groups_copy: [], scroll: 0, tour_needed: true }, anything); // prettier-ignore
  });

  test("sync settings exist & sync group-0 is null", () => {
    sessionStorage.setItem("settings", 1);
    jest.clearAllMocks();

    AppFunc.storageInit(default_settings, default_group, sync_node, mockSet, mockSet, mockSet);

    expect(chromeSyncSetSpy).not.toHaveBeenCalled();
  });

  test("sync group-0 exists & local groups exist", () => {
    sessionStorage.setItem("group-0", 1);
    localStorage.setItem("groups", JSON.stringify(init_groups));
    jest.clearAllMocks();

    AppFunc.storageInit(default_settings, default_group, sync_node, mockSet, mockSet, mockSet);

    expect(chromeLocalSetSpy).toHaveBeenCalledTimes(1);
    expect(chromeLocalSetSpy).toHaveBeenCalledWith({ groups: init_groups, groups_copy: [], scroll: 0, tour_needed: false}, anything); // prettier-ignore
    expect(mockSet).toHaveBeenCalledTimes(3);
  });
});

describe("resetTutorialChoice", () => {
  it.each([[true], [false]])(
    "sets the tour state properly or opens official homepage correctly - response === %s",
    async (response) => {
      document.body.innerHTML = `<div id="need-btn" response=${response ? "negative" : "positive"}/div>`;
      var element = document.querySelector("#need-btn");
      var stub = { target: { closest: jest.fn(() => element) } };
      const url = "TabMerger_Site";
      const mockSetTour = jest.fn(), mockSetDialog = jest.fn(); // prettier-ignore
      global.open = jest.fn();

      AppFunc.resetTutorialChoice(stub, url, mockSetTour, mockSetDialog);
      element.setAttribute("response", response ? "positive" : "negative");

      expect(mockSetDialog).toHaveBeenCalledWith({
        element,
        show: true,
        title: "❔ TabMerger Question ❔",
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

      await waitFor(() => {
        if (element.getAttribute("response") === "positive") {
          expect(mockSetTour).toHaveBeenCalledWith(true);
          expect(open).not.toHaveBeenCalled();
        } else {
          expect(mockSetTour).not.toHaveBeenCalled();
          expect(open).toHaveBeenCalledWith(url, "_blank", "noreferrer");
        }
      });

      expect.assertions(response ? 4 : 5);
    }
  );
});

describe("syncWrite", () => {
  it("does nothing when no groups in local storage", () => {
    jest.clearAllMocks();

    AppFunc.syncWrite(sync_node);

    expect(chromeSyncSetSpy).not.toHaveBeenCalled();
  });

  it("does nothing when no tabs in TabMerger and only default group is made", () => {
    localStorage.setItem("groups", JSON.stringify({ "group-0": default_group }));
    jest.clearAllMocks();

    AppFunc.syncWrite(sync_node);

    expect(chromeSyncSetSpy).not.toHaveBeenCalled();
  });

  it("calls the correct functions when less groups", async () => {
    // to simulate having to remove extras, since less groups now
    localStorage.setItem("groups", JSON.stringify({ "group-0": init_groups["group-0"] }));
    jest.clearAllMocks();

    AppFunc.syncWrite(sync_node);

    await waitFor(() => {
      expect(chromeSyncGetSpy).toHaveBeenCalledTimes(2);
      expect(chromeSyncGetSpy).toHaveBeenNthCalledWith(1, "group-0", anything); // await AppHelper.updateGroupItem
      expect(chromeSyncGetSpy).toHaveBeenNthCalledWith(2, null, anything);

      expect(chromeSyncSetSpy).not.toHaveBeenCalled();

      expect(chromeSyncRemoveSpy).toHaveBeenCalledTimes(1);
      expect(chromeSyncRemoveSpy).toHaveBeenCalledWith(Object.keys(init_groups).splice(1), anything);
    });

    expect.hasAssertions();
  });

  it("calls the correct functions when more groups", async () => {
    init_groups["group-11"] = default_group;
    localStorage.setItem("groups", JSON.stringify(init_groups));
    jest.clearAllMocks();

    AppFunc.syncWrite(sync_node);

    await waitFor(() => {
      expect(chromeSyncGetSpy).toHaveBeenCalledTimes(6);
      expect(chromeSyncGetSpy).toHaveBeenNthCalledWith(1, "group-0", anything); // await AppHelper.updateGroupItem
      expect(chromeSyncGetSpy).toHaveBeenNthCalledWith(6, null, anything);

      expect(chromeSyncSetSpy).toHaveBeenCalled();

      expect(chromeSyncRemoveSpy).toHaveBeenCalledTimes(1);
      expect(chromeSyncRemoveSpy).toHaveBeenCalledWith([], anything);
    });

    expect.hasAssertions();
  });
});

describe("syncRead", () => {
  var toggleSyncTimestampSpy = jest.spyOn(AppHelper, "toggleSyncTimestamp");
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  it("does nothing when no groups in sync storage", () => {
    AppFunc.syncRead(sync_node, mockSet, mockSet);

    expect(chromeSyncGetSpy).toHaveBeenCalledTimes(1);
    expect(chromeSyncGetSpy).toHaveBeenCalledWith(null, anything);

    expect(mockSet).not.toHaveBeenCalled();
    expect(toggleSyncTimestampSpy).not.toHaveBeenCalled();
  });

  it("calls the correct functions", () => {
    const new_ss_item = {
      "group-0": init_groups["group-0"],
      "group-1": init_groups["group-1"],
    };

    sessionStorage.setItem("group-0", JSON.stringify(new_ss_item["group-0"]));
    sessionStorage.setItem("group-1", JSON.stringify(new_ss_item["group-1"]));

    jest.clearAllMocks();

    AppFunc.syncRead(sync_node, mockSet, mockSet);

    expect(chromeSyncGetSpy).toHaveBeenCalledTimes(1);
    expect(chromeSyncRemoveSpy).toHaveBeenCalledTimes(1);
    expect(chromeSyncRemoveSpy).toHaveBeenCalledWith(["group-0", "group-1"], anything);

    expect(chromeLocalSetSpy).toHaveBeenCalledTimes(1);
    expect(chromeLocalRemoveSpy).toHaveBeenCalledTimes(1);

    expect(chromeLocalSetSpy).toHaveBeenCalledWith({ groups: new_ss_item, scroll: 0 }, anything);
    expect(chromeLocalRemoveSpy).toHaveBeenCalledWith(["groups"], anything);

    expect(toggleSyncTimestampSpy).toHaveBeenCalledTimes(1);
    expect(toggleSyncTimestampSpy).toHaveBeenCalledWith(false, sync_node);

    expect(mockSet).toHaveBeenCalledTimes(2);
    expect(mockSet).toHaveBeenNthCalledWith(1, JSON.stringify(new_ss_item));
    expect(mockSet).toHaveBeenNthCalledWith(2, AppHelper.updateTabTotal(new_ss_item));
  });
});

describe("openOrRemoveTabs", () => {
  var chromeTabsMove, chromeTabsCreate;
  var tab_single = ["https://stackoverflow.com/"];
  var tab_group = [...tab_single, "https://lichess.org/", "https://www.chess.com/"];
  var tab_all = [...tab_group, "https://www.twitch.tv/", "https://www.reddit.com/", "https://www.a.com/", "https://www.b.com/"]; // prettier-ignore
  const tab_arr_map = { SINGLE: tab_single, GROUP: tab_group, ALL: tab_all };

  var open_tabs;
  beforeEach(() => {
    open_tabs = [
      { active: true, id: 0, pinned: false, url: location.href + "a" },
      { active: false, id: 1, pinned: false, url: location.href + "b" },
      { active: false, id: 2, pinned: false, url: location.href + "c" },
    ];
    sessionStorage.setItem("open_tabs", JSON.stringify(open_tabs));

    chromeTabsMove = jest.spyOn(chrome.tabs, "move");
    chromeTabsCreate = jest.spyOn(chrome.tabs, "create");
    jest.clearAllMocks();
  });

  afterEach(() => {
    sessionStorage.removeItem("open_tabs");
  });

  it("does nothing when namespace is not 'local'", () => {
    AppFunc.openOrRemoveTabs({}, "sync", mockSet, mockSet);

    expect(chromeTabsMove).not.toHaveBeenCalled();
    expect(chromeTabsCreate).not.toHaveBeenCalled();
    expect(chromeSyncGetSpy).not.toHaveBeenCalled();
    expect(chromeLocalGetSpy).not.toHaveBeenCalled();
    expect(chromeLocalSetSpy).not.toHaveBeenCalled();
    expect(chromeLocalRemoveSpy).not.toHaveBeenCalled();
  });

  test.each([
    ["KEEP", "WITHOUT", "UNLOCKED", "SINGLE", 7],
    ["KEEP", "WITHOUT", "UNLOCKED", "GROUP", 7],
    ["KEEP", "WITHOUT", "UNLOCKED", "ALL", 7],
    ["REMOVE", "WITH", "LOCKED", "SINGLE", 7],
    ["REMOVE", "WITH", "LOCKED", "GROUP", 7],
    ["REMOVE", "WITH", "LOCKED", "ALL", 3],
    ["REMOVE", "WITH", "UNLOCKED", "SINGLE", 6],
    ["REMOVE", "WITH", "UNLOCKED", "GROUP", 4],
    ["REMOVE", "WITH", "UNLOCKED", "ALL", 0],
  ])(
    "opens the correct tab (not open) | restore = %s | %s removing | locked = %s | %s",
    (keepOrRemove, _, locked, type, expected_tabs_left) => {
      // ARRANGE
      var stub = { remove: { newValue: [type !== "ALL" ? "group-0" : null, ...tab_arr_map[type]] } };
      var expect_open_tabs = [...open_tabs, ...tab_arr_map[type].map((url) => ({ active: false, pinned: false, url }))];

      sessionStorage.setItem("settings", JSON.stringify({ restore: keepOrRemove.toLowerCase() }));

      var expected_groups = JSON.parse(localStorage.getItem("groups")); // only used in remove case
      expected_groups["group-0"].locked = locked === "LOCKED";
      localStorage.setItem("groups", JSON.stringify(expected_groups));
      if (locked === "UNLOCKED") {
        if (type === "SINGLE") {
          expected_groups["group-0"].tabs.shift();
        } else if (type === "GROUP") {
          expected_groups["group-0"].tabs = [];
        } else {
          Object.keys(expected_groups).forEach((key) => {
            expected_groups[key].tabs = [];
          });
        }
      } else {
        // only group-0 is locked
        if (type === "ALL") {
          Object.keys(expected_groups).forEach((key) => {
            if (key !== "group-0") {
              expected_groups[key].tabs = [];
            }
          });
        }
      }

      jest.clearAllMocks();

      // ACT
      AppFunc.openOrRemoveTabs(stub, "local", mockSet, mockSet);

      // ASSERT
      expect(chromeTabsMove).not.toHaveBeenCalled();

      expect(chromeTabsCreate).toHaveBeenCalledTimes(tab_arr_map[type].length);
      tab_arr_map[type].forEach((url) => {
        expect(chromeTabsCreate).toHaveBeenCalledWith({ active: false, pinned: false, url }, anything);
      });

      expect(chromeSyncGetSpy).toHaveBeenCalledTimes(1);
      expect(chromeSyncGetSpy).toHaveBeenCalledWith("settings", anything);

      expect(chromeLocalGetSpy).toHaveBeenCalledTimes(1);
      expect(chromeLocalGetSpy).toHaveBeenCalledWith("groups", anything);

      if (keepOrRemove === "KEEP") {
        expect(chromeLocalSetSpy).not.toHaveBeenCalled();
      } else {
        expect(chromeLocalSetSpy).toHaveBeenCalledTimes(1);
        expect(chromeLocalSetSpy).toHaveBeenCalledWith({ groups: expected_groups, scroll: 0 }, anything);

        expect(mockSet).toHaveBeenCalledTimes(2);
        expect(mockSet).toHaveBeenNthCalledWith(1, expected_tabs_left);
        expect(mockSet).toHaveBeenNthCalledWith(2, JSON.stringify(expected_groups));
      }

      expect(chromeLocalRemoveSpy).toHaveBeenCalledTimes(1);
      expect(chromeLocalRemoveSpy).toHaveBeenCalledWith(["remove"], anything);

      expect(JSON.parse(sessionStorage.getItem("open_tabs"))).toStrictEqual(expect_open_tabs);
    }
  );

  test("restore already open - opens the correct tabs MOVING them to correct position in array", () => {
    var expect_open_tabs = [open_tabs[2], open_tabs[0], open_tabs[1]];
    var stub = { remove: { newValue: ["group-0", open_tabs[0].url, open_tabs[1].url] } };

    sessionStorage.setItem("settings", JSON.stringify({ restore: "remove" }));

    // add new tabs that are also open
    var current_groups = JSON.parse(localStorage.getItem("groups"));
    current_groups["group-0"].tabs.push({ url: open_tabs[0].url, title: "already open a" });
    current_groups["group-0"].tabs.push({ url: open_tabs[1].url, title: "already open b" });
    localStorage.setItem("groups", JSON.stringify(current_groups));

    jest.clearAllMocks();

    AppFunc.openOrRemoveTabs(stub, "local", mockSet, mockSet);

    expect(chromeTabsMove).toHaveBeenCalledTimes(2);
    expect(chromeTabsMove).toHaveBeenNthCalledWith(1, 0, { index: -1 });
    expect(chromeTabsMove).toHaveBeenNthCalledWith(2, 1, { index: -1 });

    expect(JSON.parse(sessionStorage.getItem("open_tabs"))).toStrictEqual(expect_open_tabs) // prettier-ignore
  });
});

// note that duplicate removal is made in background script!
describe("checkMerging", () => {
  var chromeTabsRemove;
  const SYNC_LIMIT = 102000;
  const ITEM_LIMIT = 8000;

  var merge_all = [
    { id: 0, pinned: false, title: "merged tab a", url: location.href + "a" },
    { id: 1, pinned: false, title: "merged tab b", url: location.href + "b" },
    { id: 2, pinned: false, title: "merged tab c", url: location.href + "c" },
  ];

  beforeEach(() => {
    chromeTabsRemove = jest.spyOn(chrome.tabs, "remove");
    jest.clearAllMocks();
  });

  it("does nothing when namespace is not 'local'", () => {
    AppFunc.checkMerging({}, "sync", SYNC_LIMIT, ITEM_LIMIT, mockSet, mockSet);

    expect(chromeLocalGetSpy).not.toHaveBeenCalled();
    expect(chromeLocalSetSpy).not.toHaveBeenCalled();
    expect(chromeTabsRemove).not.toHaveBeenCalled();
    expect(chromeLocalRemoveSpy).not.toHaveBeenCalled();
  });

  test.each([
    ["NOT", "merge", "group-1"],
    ["NOT", "leave", "group-1"],
    ["NOT", "leave", "context"],
    ["SYNC", "merge", "group-1"],
    ["ITEM", "merge", "group-1"],
  ])(
    "merge all and none exist in TabMerger - %s exceeding limit (merge: %s, into: %s)",
    (type, merge_setting, into_group) => {
      var stub = { merged_tabs: { newValue: merge_all } };

      localStorage.setItem("groups", JSON.stringify(init_groups));
      localStorage.setItem("into_group", into_group);
      localStorage.setItem("merged_tabs", JSON.stringify(merge_all));
      sessionStorage.setItem("open_tabs", JSON.stringify(merge_all));

      var expected_groups = JSON.parse(localStorage.getItem("groups"));
      if (into_group.includes("group")) {
        expected_groups[into_group].tabs = [
          ...expected_groups[into_group].tabs,
          ...merge_all.map((x) => ({ pinned: false, title: x.title, url: x.url })),
        ];
      } else {
        into_group = "group-0";
        const group_values = Object.values(expected_groups);
        expected_groups[into_group] = {
          color: default_settings.color,
          created: AppHelper.getTimestamp(),
          hidden: false,
          locked: false,
          starred: false,
          tabs: merge_all.map((x) => ({ pinned: x.pinned, title: x.title, url: x.url })),
          title: default_settings.title,
        };

        group_values.forEach((val, i) => {
          expected_groups["group-" + (i + 1)] = val;
        });
      }

      var expected_tabs_num = 0;
      Object.values(expected_groups).forEach((val) => {
        expected_tabs_num += val.tabs.length;
      });

      var current_settings = JSON.parse(sessionStorage.getItem("settings"));
      current_settings.merge = merge_setting;
      sessionStorage.setItem("settings", JSON.stringify(current_settings));

      var mockSetDialog = jest.fn();
      jest.clearAllMocks();

      if (type === "NOT") {
        AppFunc.checkMerging(stub, "local", SYNC_LIMIT, ITEM_LIMIT, mockSet, mockSet, mockSetDialog);
      } else if (type === "SYNC") {
        AppFunc.checkMerging(stub, "local", 100, ITEM_LIMIT, mockSet, mockSet, mockSetDialog);
      } else {
        AppFunc.checkMerging(stub, "local", SYNC_LIMIT, 100, mockSet, mockSet, mockSetDialog);
      }

      expect(chromeLocalGetSpy).toHaveBeenCalledTimes(1);
      expect(chromeLocalGetSpy).toHaveBeenCalledWith(["merged_tabs", "into_group", "groups"], anything);

      if (type === "NOT") {
        if (merge_setting === "merge") {
          expect(chromeTabsRemove).toHaveBeenCalledTimes(1);
          expect(chromeTabsRemove).toHaveBeenCalledWith([0, 1, 2]);
        }

        expect(chromeLocalSetSpy).toHaveBeenCalledTimes(1);
        expect(chromeLocalSetSpy).toHaveBeenCalledWith({ groups: expected_groups, scroll: 0 }, anything);

        expect(mockSet).toHaveBeenCalledTimes(2);
        expect(mockSet).toHaveBeenNthCalledWith(1, expected_tabs_num);
        expect(mockSet).toHaveBeenNthCalledWith(2, JSON.stringify(expected_groups));
      } else {
        expect(chromeTabsRemove).not.toHaveBeenCalled();
        expect(chromeLocalSetSpy).not.toHaveBeenCalled();
        expect(mockSet).not.toHaveBeenCalled();
      }

      expect(chromeLocalRemoveSpy).toHaveBeenCalledTimes(1);
      expect(chromeLocalRemoveSpy).toHaveBeenCalledWith(["into_group", "merged_tabs"], anything);

      if (type === "NOT") {
        expect(sessionStorage.getItem("open_tabs")).toBe(merge_setting === "merge" ? "[]" : JSON.stringify(merge_all));
      } else if (type === "SYNC" || type === "ITEM") {
        expect(mockSetDialog.mock.calls.pop()[0]).toStrictEqual({
          show: true,
          title: "⚠ TabMerger Alert ⚠",
          msg:
            type === "ITEM" ? (
              <div>
                <u>Group's</u> syncing capacity exceeded by <b>{411}</b> bytes.
                <br />
                <br />
                Please do <b>one</b> of the following:
                <ul style={{ marginLeft: "25px" }}>
                  <li>Create a new group and merge new tabs into it;</li>
                  <li>Remove some tabs from this group;</li>
                  <li>
                    Merge less tabs into this group (each tab is <u>~100-300</u> bytes).
                  </li>
                </ul>
              </div>
            ) : (
              <div>
                <u>Total</u> syncing capacity exceeded by <b>{1364}</b> bytes.
                <br />
                <br />
                Please do <b>one</b> of the following:
                <ul style={{ marginLeft: "25px" }}>
                  <li>Remove some tabs from any group;</li>
                  <li>Delete a group that is no longer needed;</li>
                  <li>
                    Merge less tabs into this group (each tab is <u>~100-300</u> bytes).
                  </li>
                </ul>
                Make sure to Export JSON or PDF to have a backup copy!
              </div>
            ),
          accept_btn_text: "OK",
          reject_btn_text: null,
        });
        expect(sessionStorage.getItem("open_tabs")).toBe(JSON.stringify(merge_all));
      }
    }
  );
});

describe("addGroup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("warns if group limit exceeded", () => {
    AppFunc.addGroup(1, mockSet, mockSet);

    expect(mockSet).toHaveBeenCalledTimes(1);
    expect(mockSet.mock.calls.pop()[0]).toEqual({
      show: true,
      title: "⚠ TabMerger Alert ⚠",
      msg: (
        <div>
          Number of groups exceeded (more than <b>100</b>).
          <br />
          <br />
          Please do <b>one</b> of the following:
          <ul style={{ marginLeft: "25px" }}>
            <li>Delete a group that is no longer needed;</li>
            <li>Merge tabs into another existing group.</li>
          </ul>
        </div>
      ),
      accept_btn_text: "OK",
      reject_btn_text: null,
    });

    expect(chromeLocalGetSpy).toHaveBeenCalledTimes(1);
    expect(chromeLocalGetSpy).toHaveBeenCalledWith("groups", anything);

    expect(chromeSyncGetSpy).not.toHaveBeenCalled();
    expect(chromeLocalSetSpy).not.toHaveBeenCalled();
  });

  it("adjusts the groups if limit is not exceeded", () => {
    Object.defineProperty(document.body, "scrollHeight", { writable: true, configurable: true, value: 1000 });

    delete init_groups["group-11"];
    localStorage.setItem("groups", JSON.stringify(init_groups));

    var groups = init_groups;
    default_group.created = AppHelper.getTimestamp();
    groups["group-4"] = default_group;

    AppFunc.addGroup(100, mockSet);

    expect(chromeSyncGetSpy).toHaveBeenCalledTimes(1);
    expect(chromeSyncGetSpy).toHaveBeenCalledWith("settings", anything);

    expect(chromeLocalSetSpy).toHaveBeenCalledTimes(1);
    expect(chromeLocalSetSpy).toHaveBeenCalledWith({ groups, scroll: document.body.scrollHeight }, anything);

    expect(mockSet).toHaveBeenCalledTimes(1);
    expect(mockSet).toHaveBeenCalledWith(JSON.stringify(groups));
  });
});

describe("openAllTabs", () => {
  it.each([[true], [false]])("sets the local storage item correctly - response === %s", async (response) => {
    document.body.innerHTML =
      `<div id="open-all-btn" response=${response ? "negative" : "positive"}>` +
      `  <a class="a-tab" href="www.abc.com"/>` +
      `</div>`;
    var element = document.querySelector("#open-all-btn");
    var stub = { target: { closest: (arg) => arg !== "" && element } };

    var expected_ls = { remove: [null, location.href + "www.abc.com"] };

    chromeLocalSetSpy.mockClear();
    localStorage.setItem("groups", JSON.stringify(init_groups));

    AppFunc.openAllTabs(stub, mockSet);
    element.setAttribute("response", response ? "positive" : "negative"); // cause a mutation on the element

    expect(mockSet).toHaveBeenCalledTimes(1);
    expect(mockSet).toHaveBeenCalledWith({
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

    await waitFor(() => {
      if (element.getAttribute("response") === "positive") {
        expect(chromeLocalSetSpy).toHaveBeenCalledTimes(1);
        expect(chromeLocalSetSpy).toHaveBeenCalledWith(expected_ls, anything);
      } else {
        expect(chromeLocalSetSpy).not.toHaveBeenCalled();
      }
    });

    expect.assertions(response ? 5 : 3);
  });
});

describe("deleteAllGroups", () => {
  const dialogObj = (element) => ({
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

  it.each([[true], [false]])(
    "adjusts local storage to only have locked group and default group underneath if user accepts - groups locked = %s",
    async (locked) => {
      document.body.innerHTML =
        `<div id="delete-all-btn" class="group-item" response="negative">` +
        `  <div class="tiptext-group-title">${locked ? "unlock" : "lock"}</div>` +
        `  <input type='color' value='#000000'/>` +
        `  <div class="created"><span>11/11/2011 @ 11:11:11</span></div>` +
        `  <div class="star-group-btn"><span class="tiptext-group-title"></span>Star</div>` +
        `  <div class="draggable">` +
        `    <a href="https://www.github.com/lbragile/TabMerger">TabMerger</a>` +
        `  </div>` +
        `  <input class="title-edit-input" value='Group Title'/>` +
        `</div>`;

      sessionStorage.setItem("settings", JSON.stringify(default_settings));
      localStorage.setItem("groups_copy", JSON.stringify([]));

      var expected_groups = JSON.parse(localStorage.getItem("groups"));
      if (locked) {
        expected_groups["group-0"].locked;
        delete expected_groups["group-10"];
        delete expected_groups["group-9"];
      }
      localStorage.setItem("groups", JSON.stringify(expected_groups));

      var new_entry = locked
        ? {
            "group-0": {
              color: "#000000",
              created: "11/11/2011 @ 11:11:11",
              hidden: false,
              locked: true,
              starred: false,
              tabs: [{ pinned: false, title: "TabMerger", url: "https://www.github.com/lbragile/TabMerger" }],
              title: "Group Title",
            },
            "group-1": default_group,
          }
        : { "group-0": default_group };

      var element = document.querySelector("#delete-all-btn");
      var stub = { target: { closest: (arg) => arg !== "" && element } };
      jest.clearAllMocks();

      new_entry["group-" + +locked].created = AppHelper.getTimestamp();
      AppFunc.deleteAllGroups(stub, mockSet, mockSet, mockSet);
      element.setAttribute("response", "positive"); // cause mutation change on element

      // helps prevent flaky tests
      const new_timestamp = AppHelper.getTimestamp();
      if (new_entry["group-" + +locked].created !== new_timestamp) {
        new_entry["group-" + +locked].created = new_timestamp;
      }
      expected_groups["group-4"].created = JSON.parse(localStorage.getItem("groups"))["group-4"].created;

      await waitFor(() => {
        expect(chromeSyncGetSpy).toHaveBeenCalledTimes(1);
        expect(chromeSyncGetSpy).toHaveBeenCalledWith("settings", anything);

        expect(chromeLocalSetSpy).toHaveBeenCalledTimes(1);
        expect(chromeLocalSetSpy).toHaveBeenCalledWith({ groups: new_entry, groups_copy: [expected_groups], scroll: 0 }, anything); // prettier-ignore

        expect(mockSet).toHaveBeenCalledTimes(3);
        expect(mockSet).toHaveBeenNthCalledWith(1, dialogObj(element));
        expect(mockSet).toHaveBeenNthCalledWith(2, +locked);
        expect(mockSet).toHaveBeenNthCalledWith(3, JSON.stringify(new_entry));
      });

      expect.hasAssertions();
    }
  );

  it("does nothing if user rejects", async () => {
    document.body.innerHTML = `<div id="delete-all-btn" class="group-item" response="positive"/>`;
    var element = document.querySelector("#delete-all-btn");
    var stub = { target: { closest: jest.fn(() => element) } };
    jest.clearAllMocks();

    AppFunc.deleteAllGroups(stub, mockSet, mockSet, mockSet);
    element.setAttribute("response", "negative");

    await waitFor(() => {
      expect(chromeSyncGetSpy).not.toHaveBeenCalled();
      expect(chromeLocalSetSpy).not.toHaveBeenCalled();

      expect(mockSet).toHaveBeenCalledTimes(1);
      expect(mockSet).toHaveBeenCalledWith(dialogObj(element));
    });

    expect.hasAssertions();
  });
});

describe("undoDestructiveAction", () => {
  beforeEach(() => {
    localStorage.setItem("groups", JSON.stringify(init_groups));
  });

  test("can undo a state", () => {
    localStorage.setItem("groups_copy", JSON.stringify([init_groups]));
    jest.clearAllMocks();

    AppFunc.undoDestructiveAction(mockSet, mockSet, mockSet);

    expect(chromeLocalGetSpy).toHaveBeenCalledTimes(1);
    expect(chromeLocalGetSpy).toHaveBeenCalledWith(["groups", "groups_copy"], anything);

    expect(chromeLocalSetSpy).toHaveBeenCalledTimes(1);
    expect(chromeLocalSetSpy).toHaveBeenCalledWith({ groups: init_groups, groups_copy: [], scroll: 0 }, anything); // prettier-ignore

    expect(mockSet).toHaveBeenCalledTimes(2);
    expect(mockSet).toHaveBeenNthCalledWith(1, AppHelper.updateTabTotal(init_groups));
    expect(mockSet).toHaveBeenNthCalledWith(2, JSON.stringify(init_groups));
  });

  test("can NOT undo a state", () => {
    localStorage.setItem("groups_copy", JSON.stringify([]));
    jest.clearAllMocks();

    AppFunc.undoDestructiveAction(mockSet, mockSet, mockSet);

    expect(chromeLocalGetSpy).toHaveBeenCalledTimes(1);
    expect(chromeLocalGetSpy).toHaveBeenCalledWith(["groups", "groups_copy"], anything);

    expect(chromeLocalSetSpy).not.toHaveBeenCalled();

    expect(mockSet).toHaveBeenCalledTimes(1);
    expect(mockSet.mock.calls.pop()[0]).toStrictEqual({
      show: true,
      title: "❕ TabMerger Information ❕",
      msg: (
        <div>
          There are <b>no more</b> states to undo. <br />
          <br />
          States are created with <u>destructive actions</u>!
        </div>
      ),
      accept_btn_text: "OK",
      reject_btn_text: null,
    });
  });
});

describe("dragOver", () => {
  it.each([
    ["URL_BAR", "URL", 1, window.innerHeight, ["a", "b", "c", "d", "e", "f", "g", "h", "i"]],
    ["START_MIDDLE", "GROUP", 1, window.innerHeight, ["a", "b", "c", "d", "e", "f", "g", "h", "i"]],
    ["END", "GROUP", 2, window.innerHeight / 2, ["a", "b", "c", "d", "e", "f", "g", "h", "i"]],
    ["AFTER", "GROUP", 0, 0, ["a", "b", "c", "d", "e", "f", "g", "h", "i"]],
    ["START_MIDDLE", "TAB", 1, window.innerHeight, ["a", "b", "c", "d", "e", "f", "g", "h", "i"]],
    ["END", "TAB", 2, window.innerHeight / 2, ["a", "b", "c", "d", "e", "f", "g", "h", "i"]],
    ["AFTER", "TAB", 0, 0, ["a", "b", "c", "d", "e", "f", "g", "h", "i"]],
  ])("finds the correct after element -> %s, %s", (where, type, tab_num, scroll, expect_result) => {
    document.body.innerHTML =
      `<div id="#tabmerger-container">` +
      `  <div class="group ${type === "GROUP" ? "dragging-group" : ""} id="group-0">` +
      `    <div class="tabs-container">` +
      `      <div class="draggable ${type === "TAB" ? "dragging" : ""}">a</div>` +
      `      <div class="draggable">b</div>` +
      `      <div class="draggable">c</div>` +
      `    </div>` +
      `  </div>` +
      `  <div class="group" id="group-1">` +
      `    <div class="tabs-container">` +
      `      <div class="draggable">d</div>` +
      `      <div class="draggable">e</div>` +
      `      <div class="draggable">f</div>` +
      `    </div>` +
      `  </div>` +
      `  <div class="group" id="group-2">` +
      `    <div class="tabs-container">` +
      `      <div class="draggable">g</div>` +
      `      <div class="draggable">h</div>` +
      `      <div class="draggable">i</div>` +
      `    </div>` +
      `  </div>` +
      `</div>`;

    global.scrollTo = jest.fn();

    var getDragAfterElementSpy = jest.spyOn(AppHelper, "getDragAfterElement").mockImplementation(() => {
      return where !== "AFTER" ? document.querySelectorAll(type === "GROUP" ? ".group" : ".draggable")[tab_num] : null;
    });

    var stub = {
      preventDefault: jest.fn(),
      clientY: scroll,
      target: document.querySelector(type === "GROUP" ? ".group" : ".draggable"),
    };

    const tabs_text = [...document.querySelectorAll(".draggable")].map((x) => x.textContent);
    const expected_drag_container = stub.target.closest(type === "GROUP" ? "#tabmerger-container" : ".group");
    AppFunc.dragOver(stub, type.toLowerCase());

    expect(tabs_text).toEqual(expect_result);

    if (type !== "URL") {
      if (where === "END") {
        expect(global.scrollTo).not.toHaveBeenCalled();
      } else {
        expect(global.scrollTo).toHaveBeenCalled();
        expect(global.scrollTo).toHaveBeenCalledWith(0, stub.clientY);
      }
      expect(getDragAfterElementSpy).toHaveBeenCalledWith(expected_drag_container, stub.clientY, type.toLowerCase());
    } else {
      expect(global.scrollTo).not.toHaveBeenCalled();
      expect(getDragAfterElementSpy).not.toHaveBeenCalled();
    }

    getDragAfterElementSpy.mockRestore();
  });

  test.todo("check ofr actual tab and group manipulation");
});

describe("regexSearchForTab", () => {
  it.each([
    ["group", "NO", "#c", ["none", "none"]],
    ["group", "YES", "#a", ["", "none"]],
    ["tab", "NO", "c", ["none", "none"]],
    ["tab", "YES", "b", ["none", ""]],
    ["blank", "BACKSPACE_BLANK", "", ["", ""]],
  ])("works for %s search - %s match", (type, match, value, expect_arr) => {
    document.body.innerHTML =
      `<div class="group-item">` +
      `  <input class="title-edit-input" value="aaaaa"/>` +
      `  <div class="draggable">` +
      `    <a href="#" class="a-tab">aaaaa</a>` +
      `  </div>` +
      `</div>` +
      `<div class="group-item">` +
      `  <input class="title-edit-input" value="bbbbb"/>` +
      `  <div class="draggable">` +
      `    <a href="#" class="a-tab">bbbbb</a>` +
      `  </div>` +
      `</div>`;

    if (match !== "BACKSPACE_BLANK") {
      AppFunc.regexSearchForTab({ target: { value } });
    } else {
      AppFunc.regexSearchForTab({ target: { value: "random" } });
      AppFunc.regexSearchForTab({ target: { value } });
    }

    const targets = [...document.body.querySelectorAll(type === "tab" ? ".draggable" : ".group-item")];
    expect(targets.map((x) => x.style.display)).toStrictEqual(expect_arr);
  });
});

describe("importJSON", () => {
  it("alerts on wrong non json input", () => {
    global.alert = jest.fn();
    var mockSetDialog = jest.fn();
    const input = { target: { files: [{ type: "application/pdf" }] } };
    jest.clearAllMocks();

    AppFunc.importJSON(input, mockSet, mockSet, mockSetDialog);

    expect(chromeSyncSetSpy).not.toHaveBeenCalled();
    expect(chromeLocalSetSpy).not.toHaveBeenCalled();
    expect(mockSet).not.toHaveBeenCalled();

    expect(mockSetDialog).toHaveBeenCalledTimes(1);
    expect(mockSetDialog.mock.calls.pop()[0]).toStrictEqual({
      show: true,
      title: <p><span style={{color: "red"}}>‼</span> TabMerger Warning <span Warning span style={{color: "red"}}>‼</span></p>, // prettier-ignore
      msg: (
        <div>
          You must import a JSON file <i>(.json extension)</i>!<br />
          <br />
          These can be generated via the <b>Export JSON</b> button.
          <br />
          <br />
          <b>Be careful</b>, <u>only import JSON files generated by TabMerger</u>, otherwise you risk losing your
          current configuration!
        </div>
      ),
      accept_btn_text: "OK",
      reject_btn_text: null,
    });
  });

  it("updates sync and local storage on valid input", () => {
    const fakeFile = new File([JSON.stringify(exportedVal)], "file.json", { type: "application/json" });
    const input = { target: { files: [fakeFile] } };

    jest.spyOn(global, "FileReader").mockImplementation(function () {
      this.readAsText = jest.fn(() => (this.result = JSON.stringify(exportedVal)));
    });
    jest.clearAllMocks();

    AppFunc.importJSON(input, mockSet, mockSet);

    expect(FileReader).toHaveBeenCalledTimes(1);
    const reader = FileReader.mock.instances[0];
    act(() => reader.onload());

    expect(reader.readAsText).toHaveBeenCalledTimes(1);
    expect(reader.readAsText).toHaveBeenCalledWith(fakeFile);
    expect(reader.onload).toEqual(expect.any(Function));

    expect(chromeSyncSetSpy).toHaveBeenCalledTimes(1);
    expect(chromeSyncSetSpy).toHaveBeenCalledWith({ settings: exportedVal.settings }, anything);

    delete exportedVal.settings;

    expect(chromeLocalSetSpy).toHaveBeenCalledTimes(1);
    expect(chromeLocalSetSpy).toHaveBeenCalledWith({ groups: exportedVal, scroll: 0 }, anything);

    expect(mockSet).toHaveBeenCalledTimes(2);
    expect(mockSet).toHaveBeenNthCalledWith(1, JSON.stringify(exportedVal));
    expect(mockSet).toHaveBeenNthCalledWith(2, 12);
  });
});

describe("exportJSON", () => {
  it("correctly exports a JSON file of the current configuration", () => {
    function makeAnchor(target) {
      return {
        target,
        setAttribute: jest.fn((key, value) => (target[key] = value)),
        click: jest.fn(),
        remove: jest.fn(),
      };
    }

    var anchor = makeAnchor({ href: "#", download: "" });
    var createElementMock = jest.spyOn(document, "createElement").mockReturnValue(anchor);
    var setAttributeSpy = jest.spyOn(anchor, "setAttribute");
    var clickSpy = jest.spyOn(anchor, "click");
    var removeSpy = jest.spyOn(anchor, "remove");

    var group_blocks = JSON.parse(localStorage.getItem("groups"));
    group_blocks["settings"] = JSON.parse(sessionStorage.getItem("settings"));
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(group_blocks, null, 2));

    jest.clearAllMocks();

    AppFunc.exportJSON();

    expect(chromeLocalGetSpy).toHaveBeenCalledTimes(1);
    expect(chromeLocalGetSpy).toHaveBeenCalledWith("groups", anything);

    expect(chromeSyncGetSpy).toHaveBeenCalledTimes(1);
    expect(chromeSyncGetSpy).toHaveBeenCalledWith("settings", anything);

    expect(document.createElement).toHaveBeenCalledTimes(1);
    expect(document.createElement).toHaveBeenCalledWith("a");

    expect(setAttributeSpy).toHaveBeenCalledTimes(2);
    expect(setAttributeSpy).toHaveBeenNthCalledWith(1, "href", dataStr);
    expect(setAttributeSpy).toHaveBeenNthCalledWith(2, "download", AppHelper.outputFileName() + ".json");

    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(removeSpy).toHaveBeenCalledTimes(1);

    createElementMock.mockRestore();
  });
});

describe("translate", () => {
  it("returns a translation if avaiable", () => {
    expect(AppFunc.translate("Title")).toEqual("титул");
  });

  it("returns original msg if translation is not available", () => {
    expect(AppFunc.translate("random")).toEqual("random");
  });
});
