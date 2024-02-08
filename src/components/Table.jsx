import React, { useState } from "react";
import { folders, files } from "src/utils/data";

export const Table = () => {
  const [allFolders, setAllFolders] = useState(folders);
  const [allFiles, setAllFiles] = useState(files);
  const [fileInFolder, setFileInFolder] = useState(
    allFolders.reduce((acc, folder) => {
      return [...acc, ...folder.filesId];
    }, []),
  );
  const [filesNotInFolders, setFilesNotInFolders] = useState(
    allFiles.filter((file) => !fileInFolder.includes(file.id)),
  );

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("id", id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, folder) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("id");

    const newFolders = allFolders.map((f) => {
      if (f.id === folder.id) {
        return { ...f, filesId: [...f.filesId, id] };
      }
      return f;
    });

    setAllFolders(newFolders);

    const newFilesNotInFolders = filesNotInFolders.filter(
      (file) => file.id !== id,
    );
    setFilesNotInFolders(newFilesNotInFolders);
  };

  console.log("allFolders", allFolders);

  return (
    <div className="rounded-lg border border-gray-500 bg-white ">
      {allFolders.map((folder) => (
        <div
          className=" border-b border-gray-800 px-2 py-1"
          key={folder.id}
          onDragOver={(e) => handleDragOver(e)}
          onDrop={(e) => handleDrop(e, folder)}
        >
          {folder.name}
        </div>
      ))}
      {filesNotInFolders.map((file) => (
        <div
          className="border-b border-gray-800 px-2 py-1 last:border-none"
          key={file.id}
          draggable
          onDragStart={(e) => handleDragStart(e, file.id)}
        >
          {file.name}
        </div>
      ))}
    </div>
  );
};
