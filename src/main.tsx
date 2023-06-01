import React from "react";
import ReactDOM from "react-dom/client";
import { DndProvider } from "react-dnd";
import { HTML5Backend as Backend } from "react-dnd-html5-backend";
import { App } from "./App";
import "./index.css";
import ListContextProvider from "./contexts/listContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DndProvider backend={Backend}>
      <ListContextProvider>
        <App />
      </ListContextProvider>
    </DndProvider>
  </React.StrictMode>
);
