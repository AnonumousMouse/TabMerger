import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { saveAs } from "file-saver";
import { Dispatch, SetStateAction, useState } from "react";
import styled from "styled-components";

import About from "./About";
import Export from "./Export";
import Import from "./Import";
import Settings from "./Settings";
import Sync from "./Sync";

import { useDispatch, useSelector } from "~/hooks/useRedux";
import { useSyncStorageDownload, useSyncStorageUpload } from "~/hooks/useSyncStorage";
import { updateAvailable, updateActive } from "~/store/actions/groups";
import Button from "~/styles/Button";

const CloseIconContainer = styled.span`
  padding: 4px 8px;
  cursor: pointer;
  display: flex;

  &:hover {
    color: red;
    background-color: #ff000020;
  }
`;

const CloseIcon = styled(FontAwesomeIcon)`
  font-size: 16px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 500px;
  position: absolute;
  top: 32px;
  left: 230px;
  background: white;
  padding: 8px;
  box-shadow: 0 0 2px 2px #1113;
  z-index: 2;
`;

const Overlay = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #31313140;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
`;

const HeaderRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const FooterRow = styled(HeaderRow)`
  gap: 8px;
  justify-content: end;
`;

export interface IModal {
  setVisible: Dispatch<SetStateAction<boolean>>;
}

export default function Modal({ setVisible }: IModal): JSX.Element {
  const dispatch = useDispatch();

  const { available } = useSelector((state) => state.groups);

  const {
    info: { type, title, closeText, saveText },
    export: { file },
    import: { formatted },
    sync: { type: syncType, possibleData, currentData }
  } = useSelector((state) => state.modal);

  const syncUpload = useSyncStorageUpload(possibleData);
  const syncDownload = useSyncStorageDownload(currentData, available);

  const [disableSubmit, setDisableSubmit] = useState(false);

  const hide = () => setVisible(false);

  const handleSave = () => {
    if (type === "export" && file) {
      saveAs(file);
      hide();
    } else if (type === "import") {
      dispatch(updateAvailable([available[0], ...formatted]));
      dispatch(updateActive({ index: 0, id: formatted[0].id }));
      hide();
    } else if (type === "sync") {
      if (possibleData.length) syncUpload();
      else if (currentData.length) syncDownload();

      /**
       * Prevent user from mashing the submit button, due to rate limit on sync storage
       * @see https://developer.chrome.com/docs/extensions/reference/storage/#property-sync-sync-MAX_WRITE_OPERATIONS_PER_MINUTE
       */
      setDisableSubmit(true);
      setTimeout(() => setDisableSubmit(false), 3000);
    }
  };

  return (
    <>
      <Overlay onClick={hide} role="presentation" />

      <Container>
        <HeaderRow>
          <h3>{title}</h3>

          <CloseIconContainer
            tabIndex={0}
            role="button"
            onClick={hide}
            onPointerDown={(e) => e.preventDefault()}
            onKeyPress={({ key }) => key === "Enter" && hide()}
          >
            <CloseIcon icon="times" />
          </CloseIconContainer>
        </HeaderRow>

        {type === "import" && <Import />}
        {type === "export" && <Export />}
        {type === "sync" && <Sync />}
        {type === "settings" && <Settings />}
        {type === "about" && <About />}

        <FooterRow>
          {saveText && type === "export" && file && (
            <Button onClick={handleSave} $variant="primary">
              {saveText}
            </Button>
          )}

          {saveText && type === "import" && formatted.length > 0 && (
            <Button onClick={handleSave} $variant="primary">
              {saveText + (type === "import" ? ` (${formatted.length})` : "")}
            </Button>
          )}

          {saveText && type === "sync" && syncType === "Upload" && possibleData.length > 0 && (
            <Button onClick={handleSave} $variant="primary" disabled={disableSubmit}>
              {`Upload ${saveText} (${possibleData.length})`}
            </Button>
          )}

          {saveText && type === "sync" && syncType === "Download" && currentData.length > 0 && (
            <Button onClick={handleSave} $variant="primary" disabled={disableSubmit}>
              {`Download ${saveText} (${currentData.length})`}
            </Button>
          )}

          <Button onClick={hide}>{closeText}</Button>
        </FooterRow>
      </Container>
    </>
  );
}
