import React, { useState } from "react";
import { folders, files } from "src/utils/data";
import { createRoot } from "react-dom/client";

export const Table = () => {
  const [allFolders, setAllFolders] = useState(folders);
  const [allFiles, setAllFiles] = useState(files);
  const [draggingFileId, setDraggingFileId] = useState(null);
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
    setDraggingFileId(id);

    const dragImg = document.createElement("div");
    dragImg.id = "dragImg";
    dragImg.style.width = "fit-content";
    document.body.appendChild(dragImg);

    const dragImgComponent = createRoot(document.getElementById("dragImg"));
    dragImgComponent.render(
      <DragImg name={allFiles.find((file) => file.id === id).name} />,
    );

    // ReactDOM.render(
    //   <DragImg name={allFiles.find((file) => file.id === id).name} />,
    //   dragImg,
    // );

    document.body.appendChild(dragImg);

    e.dataTransfer.setDragImage(dragImg, -10, -10);

    setTimeout(() => document.body.removeChild(dragImg), 0);
  };

  const handleDragEnd = () => {
    setDraggingFileId(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, folder) => {
    e.preventDefault();
    const id = parseInt(e.dataTransfer.getData("id"), 10);

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

  return (
    <div className="overflow-hidden rounded-lg border border-gray-500 bg-white">
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
          className={`flex items-center justify-between gap-2 border-b border-gray-800 px-2 py-1 last:border-none ${draggingFileId === file.id ? "opacity-20" : ""}`}
          key={file.id}
          draggable
          onDragStart={(e) => handleDragStart(e, file.id)}
          onDragEnd={() => handleDragEnd()}
        >
          <p>{file.name}</p>
          <p>{file.size / 1024 / 1024} MB</p>
        </div>
      ))}
    </div>
  );
};

const DragImg = ({ name }) => {
  return <div className="scale-150 bg-green-500">{name}</div>;
};
