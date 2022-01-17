import { IGroupItemState } from "./groups";

import { IAction } from "~/typings/reducers";

export const MODAL_ACTIONS = {
  SET_MODAL_INFO: "SET_MODAL_INFO",
  UPDATE_EXPORT_FILE: "UPDATE_EXPORT_FILE",
  UPDATE_IMPORT_FORMATTED_GROUPS: "UPDATE_IMPORT_FORMATTED_GROUPS",
  UPDATE_IMPORT_TYPE: "UPDATE_IMPORT_TYPE",
  UPDATE_SYNC_TYPE: "UPDATE_SYNC_TYPE",
  UPDATE_SYNC_CURRENT_DATA: "UPDATE_SYNC_CURRENT_DATA",
  UPDATE_SYNC_POSSIBLE_DATA: "UPDATE_SYNC_POSSIBLE_DATA"
};

type TModalType = "import" | "export" | "sync" | "settings" | "about";

export type TImportType = "json" | "plain" | "markdown" | "csv";

export type TSyncType = "Upload" | "Download";

export interface ISyncDataItem {
  name: string;
  color: string;
  windows: {
    incognito: boolean;
    starred: boolean | undefined;
    name: string | undefined;
    tabs: {
      title: string | undefined;
      url: string | undefined;
    }[];
  }[];
}

export interface IModalState {
  info: {
    title: string;
    type: TModalType;
    closeText: string;
    saveText?: string;
  };
  export: {
    file: File | null;
  };
  import: {
    type: TImportType;
    formatted: IGroupItemState[];
  };
  sync: {
    type: TSyncType;
    currentData: ISyncDataItem[];
    possibleData: ISyncDataItem[];
  };
}

export const initModalState: IModalState = {
  info: {
    title: "About TabMerger",
    type: "about",
    closeText: "Close"
  },
  export: {
    file: null
  },
  import: {
    type: "json",
    formatted: []
  },
  sync: {
    type: "Upload",
    currentData: [],
    possibleData: []
  }
};

const modalReducer = (state: IModalState, action: IAction): IModalState => {
  const { type, payload } = action;

  switch (type) {
    case MODAL_ACTIONS.SET_MODAL_INFO:
      return {
        ...state,
        info: payload as IModalState["info"]
      };

    case MODAL_ACTIONS.UPDATE_EXPORT_FILE:
      return {
        ...state,
        export: {
          ...state.export,
          file: payload as IModalState["export"]["file"]
        }
      };

    case MODAL_ACTIONS.UPDATE_IMPORT_FORMATTED_GROUPS:
      return {
        ...state,
        import: {
          ...state.import,
          formatted: payload as IModalState["import"]["formatted"]
        }
      };

    case MODAL_ACTIONS.UPDATE_IMPORT_TYPE:
      return {
        ...state,
        import: {
          ...state.import,
          type: payload as IModalState["import"]["type"]
        }
      };

    case MODAL_ACTIONS.UPDATE_SYNC_TYPE:
      return {
        ...state,
        sync: {
          ...state.sync,
          type: payload as IModalState["sync"]["type"]
        }
      };

    case MODAL_ACTIONS.UPDATE_SYNC_CURRENT_DATA:
      return {
        ...state,
        sync: {
          ...state.sync,
          currentData: payload as IModalState["sync"]["currentData"]
        }
      };

    case MODAL_ACTIONS.UPDATE_SYNC_POSSIBLE_DATA:
      return {
        ...state,
        sync: {
          ...state.sync,
          possibleData: payload as IModalState["sync"]["possibleData"]
        }
      };

    default:
      return state;
  }
};

export default modalReducer;
