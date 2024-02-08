import React, { useState } from "react";
import { dataForSecondTable } from "src/utils/data";

export const Table2 = () => {
  const [draggingFileId, setDraggingFileId] = useState(null);
  const [typeSelectedFile, setTypeSelectedFile] = useState("");

  const [allDataInfo, setAllDataInfo] = useState(dataForSecondTable);
  const [folders, setFolders] = useState(
    allDataInfo.filter((file) => file.type === "folder"),
  );
  const [fileInFolder, setFileInFolder] = useState(
    folders.reduce((acc, folder) => {
      return [...acc, ...folder.filesId];
    }, []),
  );
  const [foldersInFolder, setFoldersInFolder] = useState(
    folders.reduce((acc, folder) => {
      return [...acc, ...folder.foldersId];
    }, []),
  );

  // console.log("allDataInfo", allDataInfo);
  // console.log("folders", folders);
  // console.log("fileInFolder", fileInFolder);

  const filteredFolders = allDataInfo.filter(
    (file) => !foldersInFolder.includes(file.id) && file.type === "folder",
  );
  const filteredFiles = allDataInfo.filter(
    (file) => !fileInFolder.includes(file.id) && file.type !== "folder",
  );

  // console.log("filteredFolders", filteredFolders);
  // console.log("filteredFiles", filteredFiles);

  const handleDragStart = (e, id, type) => {
    e.dataTransfer.setData("id", id);
    setDraggingFileId(id);
    setTypeSelectedFile(type);
  };
  const handleDragEnd = () => {
    setDraggingFileId(null);
    setTypeSelectedFile("");
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDrop = (e, folder) => {
    e.preventDefault();
    console.log("dropped in folder", folder.id);

    const id = parseInt(e.dataTransfer.getData("id"), 10);

    if (typeSelectedFile === "file") {
      folder.filesId.push(id);

      setFolders((prevFolders) => {
        return prevFolders.map((f) => {
          if (f.id === folder.id) {
            return folder;
          }
          return f;
        });
      });

      setFileInFolder((prevFileInFolder) => {
        return [...prevFileInFolder, id];
      });

      setAllDataInfo((prevAllDataInfo) => {
        return prevAllDataInfo.map((file) => {
          if (file.id === folder.id) {
            return folder;
          }
          return file;
        });
      });
    }

    if (typeSelectedFile === "folder") {
      folder.foldersId.push(id);

      setFolders((prevFolders) => {
        return prevFolders.map((f) => {
          if (f.id === folder.id) {
            return folder;
          }
          return f;
        });
      });

      setFoldersInFolder((prevFoldersInFolder) => {
        return [...prevFoldersInFolder, id];
      });

      setAllDataInfo((prevAllDataInfo) => {
        return prevAllDataInfo.map((file) => {
          if (file.id === folder.id) {
            return folder;
          }
          return file;
        });
      });
    }
  };

  console.log("draggingFileId", draggingFileId);
  console.log("typeSelectedFile", typeSelectedFile);
  console.log("filteredFolders", filteredFolders);

  return (
    <div className="overflow-hidden rounded-lg border border-gray-500 bg-white">
      {[...filteredFolders, ...filteredFiles].map((file) => (
        <div
          className={`flex items-center justify-between gap-2 border-b border-gray-500 px-4 py-2 last:border-none ${draggingFileId === file.id ? "opacity-20" : ""}`}
          key={file.id}
          draggable
          onDragStart={(e) => handleDragStart(e, file.id, file.type)}
          onDragEnd={() => handleDragEnd()}
          onDragOver={(e) => handleDragOver(e)}
          onDrop={
            file.type === "folder"
              ? file.id !== draggingFileId
                ? (e) => handleDrop(e, file)
                : null
              : null
          }
        >
          <div>{file.name}</div>
          {file.type !== "folder" && <div>{file.size}</div>}
        </div>
      ))}
    </div>
  );
};
