import React from "react";
import { Table } from "./components/Table";
import { Table2 } from "./components/Table2";

function App() {
  return (
    <div className=" flex h-screen w-screen items-center justify-center gap-5 bg-slate-300 p-2">
      {/* <Table /> */}
      <Table2 />
    </div>
  );
}

export default App;
