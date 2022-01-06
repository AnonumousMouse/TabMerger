import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import styled, { css } from "styled-components";

import Selector from "./Selector";

import { GOOGLE_HOMEPAGE } from "~/constants/urls";
import { useDebounce } from "~/hooks/useDebounce";
import useParseText from "~/hooks/useParseText";
import { useDispatch, useSelector } from "~/hooks/useRedux";
import MODAL_CREATORS from "~/store/actions/modal";
import { Note } from "~/styles/Note";

const DropZone = styled.div<{ $isRejected: boolean; $isAccepted: boolean }>`
  height: 300px;
  width: 400px;
  margin: auto;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 16px;
  cursor: pointer;
  ${({ $isRejected, $isAccepted }) => css`
    border: 1px dashed ${$isAccepted ? "green" : $isRejected ? "red" : "grey"};
    background-color: ${$isAccepted ? "#ccffcc" : $isRejected ? "#ffcccc" : "#f0f0f0"};
  `}
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
  align-items: center;
`;

const StyledTextArea = styled.textarea`
  height: 300px;
  width: 400px;
  padding: 8px;
  resize: none;
  margin: auto;
  white-space: pre;
  overflow-wrap: normal;
`;

const UploadIcon = styled(FontAwesomeIcon)`
  &:hover {
    color: #666;
  }
`;

const Message = styled.p<{ $error?: boolean }>`
  font-weight: bold;
  color: ${({ $error }) => ($error ? "red" : "green")};
  text-align: center;
`;

const UPLOAD_FILE_ERROR = "Something is wrong with this file, please try another one";
const IMPORT_TEXT_ERROR = "This text does not match the expected import format";

export default function Import(): JSX.Element {
  const dispatch = useDispatch();

  const {
    import: { formatted }
  } = useSelector((state) => state.modal);

  const [activeTab, setActiveTab] = useState<"File" | "Text">("File");
  const [currentText, setCurrentText] = useState("");

  const debouncedCurrentText = useDebounce(currentText, 250);

  const { recomputeUploadType } = useParseText(debouncedCurrentText);

  // Reset the uploaded text & formatted groups if the activeTab is changed
  useEffect(() => {
    if (activeTab === "File") {
      setCurrentText("");
      dispatch(MODAL_CREATORS.updateImportFormattedGroups([]));
    }
  }, [dispatch, activeTab]);

  // Get uploaded text & move to the next screen for confirmation
  const onDropAccepted = useCallback(
    async ([file]: File[]) => {
      const { name } = file;

      const type = /\.json$/.test(name)
        ? "json"
        : /\.csv$/.test(name)
        ? "csv"
        : /\.txt$/.test(name)
        ? "plain"
        : "markdown";

      const text = type === "json" ? JSON.stringify(await new Response(file).json(), null, 4) : await file.text();

      dispatch(MODAL_CREATORS.updateImportType(type));
      setCurrentText(text);
      setActiveTab("Text");
    },
    [dispatch]
  );

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, fileRejections } = useDropzone({
    onDropAccepted,
    accept: [
      "application/json",
      "text/plain",
      ".md",
      "text/markdown",
      ".csv",
      "application/vnd.ms-excel",
      "text/csv",
      ""
    ],
    multiple: false,
    maxFiles: 1,
    maxSize: 25e6
  });

  return (
    <>
      <Selector opts={["File", "Text"]} activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "File" ? (
        <>
          <DropZone {...getRootProps()} $isRejected={isDragReject} $isAccepted={isDragAccept}>
            <input {...getInputProps()} />

            <Column>
              {isDragActive && isDragAccept ? (
                <>
                  <FontAwesomeIcon icon="check-circle" size="2x" color="green" />
                  <Message>File looks promising... drop it to proceed</Message>
                </>
              ) : isDragActive && isDragReject ? (
                <>
                  <FontAwesomeIcon icon="times-circle" size="2x" color="red" />
                  <Message $error>{UPLOAD_FILE_ERROR}</Message>
                </>
              ) : (
                <>
                  <p>Drop files here to upload</p>
                  <h3>OR</h3>
                  <UploadIcon icon="upload" size="3x" />

                  <br />
                  <p>
                    Accepted files: <b>.json</b>, <b>.txt</b>, <b>.md</b>, <b>.csv</b>
                  </p>

                  <p>
                    Maximum upload size: <b>25 MB</b>
                  </p>
                </>
              )}
            </Column>
          </DropZone>

          {!isDragActive && fileRejections.length > 0 && <Message $error>{UPLOAD_FILE_ERROR}</Message>}

          <Note>
            <FontAwesomeIcon icon="exclamation-circle" color="#aaa" size="2x" />

            <p>Upon successful upload, you will have a chance to confirm!</p>
          </Note>
        </>
      ) : (
        <>
          <StyledTextArea
            placeholder="Paste JSON, markdown, CSV, or plain text here..."
            value={currentText}
            onChange={({ target: { value } }) => {
              // If value changed due to a paste event, need to re-compute the upload type
              recomputeUploadType(value);

              setCurrentText(value);
            }}
          />

          {currentText.replace(/\n/g, "") !== "" && formatted.length === 0 && (
            <Message $error>{IMPORT_TEXT_ERROR}</Message>
          )}

          <Note>
            <FontAwesomeIcon icon="exclamation-circle" color="#aaa" size="2x" />

            <p>Each tab must have an associated URL (eg. {GOOGLE_HOMEPAGE})</p>
          </Note>
        </>
      )}
    </>
  );
}
