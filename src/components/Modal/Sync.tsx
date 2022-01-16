import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { saveAs } from "file-saver";
import { useState, useEffect } from "react";
import styled from "styled-components";

import Selector from "./Selector";

import { MAX_SYNC_TABS_PER_GROUP, MAX_SYNC_GROUPS } from "~/constants/sync";
import useFormatText from "~/hooks/useFormatText";
import useLocalStorage from "~/hooks/useLocalStorage";
import { useDispatch, useSelector } from "~/hooks/useRedux";
import useSyncStorageInfo from "~/hooks/useSyncStorage";
import { updateSyncType } from "~/store/actions/modal";
import { TSyncType } from "~/store/reducers/modal";
import Button from "~/styles/Button";
import Message from "~/styles/Message";
import { Note } from "~/styles/Note";
import TextArea from "~/styles/Textarea";
import { relativeTimeStr } from "~/utils/helper";

const StyledMessage = styled(Message)<{ $error: boolean; $recent: boolean }>`
  background: ${({ $error, $recent }) => ($error ? "#ffdddd" : $recent ? "#ddffdd" : "#e8e8ff")};
  color: ${({ $error, $recent }) => ($error ? "#721c24" : $recent ? "#155724" : "blue")};
  width: fit-content;
  padding: 4px 8px;
  margin: auto;
`;

const StyledButton = styled(Button)`
  margin: auto;
`;

export default function Sync(): JSX.Element {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<TSyncType>("Upload");

  const {
    sync: { currentData, possibleData }
  } = useSelector((state) => state.modal);

  const { available } = useSelector((state) => state.groups);

  const { getRegularText: getRegularTextPossible, getHTMLText: getHTMLTextPossible } = useFormatText(possibleData);
  const { getRegularText: getRegularTextCurrent, getHTMLText: getHTMLTextCurrent } = useFormatText(currentData);

  useSyncStorageInfo(activeTab, available);

  const [lastSyncUpload] = useLocalStorage("lastSyncUpload", "");
  const [lastSyncDownload] = useLocalStorage("lastSyncDownload", "");
  const activeLastSync = activeTab === "Upload" ? lastSyncUpload : lastSyncDownload;
  const relativeTime = relativeTimeStr(new Date(activeLastSync).getTime());

  useEffect(() => {
    dispatch(updateSyncType(activeTab));
  }, [dispatch, activeTab]);

  const handlePreviewSyncData = () => {
    const data = [activeTab === "Upload" ? getHTMLTextPossible() : getHTMLTextCurrent()];
    const fileName = `TabMerger Sync - ${new Date().toTimeString()}.html`;
    const file = new File(data, fileName, { type: "text/html" });

    saveAs(file);
  };

  return (
    <>
      <Selector opts={["Upload", "Download"]} activeTab={activeTab} setActiveTab={setActiveTab} />

      <StyledMessage $error={activeLastSync === ""} $recent={relativeTime.includes("<")}>
        {activeLastSync === ""
          ? `Nothing was ${activeTab.toLowerCase()}ed... yet`
          : `Last ${activeTab.toLowerCase()}ed on ${activeLastSync} (${relativeTime} ago)`}
      </StyledMessage>

      <TextArea
        value={activeTab === "Upload" ? getRegularTextPossible() : getRegularTextCurrent()}
        placeholder={`There is nothing to see here yet.\nYou must first upload something to be able to download!`}
        readOnly
      />

      <StyledButton
        $variant="info"
        disabled={activeTab === "Download" && currentData.length === 0}
        onClick={handlePreviewSyncData}
      >
        Preview
      </StyledButton>

      <Note>
        <FontAwesomeIcon icon="exclamation-circle" color="#aaa" size="2x" />

        <div>
          {activeTab === "Upload" ? (
            <p>
              Sync includes the first <b>{MAX_SYNC_TABS_PER_GROUP}</b> tabs per group for the first{" "}
              <b>{MAX_SYNC_GROUPS}</b> groups
            </p>
          ) : (
            <p>
              Press &ldquo;Download Sync&rdquo; to <b>replace</b> current data with the synced data!
            </p>
          )}
        </div>
      </Note>
    </>
  );
}
