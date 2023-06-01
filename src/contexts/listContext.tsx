import React, { createContext, useState, useContext } from "react";
import { DragItem } from "../DragItem";
import { findItemIndexById, moveItem } from "../utils/arrayUtils";

export type Task = {
  type?: string;
  id: string;
  listId: string;
  text: string;
};

export type List = {
  id: string;
  columnName: string;
  tasks: Task[];
};

export type MoveList = {
  draggedId: string;
  hoveredId: string;
};

export type MoveTask = {
  draggedId: string;
  hoveredId: string | null;
  sourceListId: string;
  targetListId: string;
  draggedItem: Task;
};

export type Lists = {
  lists: List[];
  draggedItem: DragItem | null;
};

export type ListContextProps = {
  lists: List[];
  draggedItem: DragItem | null;
  addNewList: (newList: List) => void;
  removeList: (listToRemove: List) => void;
  addNewTask: (newTask: Task) => void;
  moveList: (moveListPayload: MoveList) => void;
  moveTask: (
    moveTaskPayload: MoveTask
  ) => void;
  setDraggedItem: (draggedItem: DragItem | null) => void;
};

const ListContext = createContext<ListContextProps | undefined>(undefined);

export const useListContext = (): ListContextProps => {
  const context = useContext(ListContext);
  if (!context) {
    throw new Error("useListContext must be used within a ListContextProvider");
  }
  return context;
};

const ListContextProvider: React.FC<any> = ({ children }) => {
  const initialState: Lists = {
    lists: [
      {
        id: "4f90d13a42",
        columnName: "Todo",
        tasks: [],
      },
      {
        id: "4f90d13a43",
        columnName: "Procedding",
        tasks: [],
      },
    ],
    draggedItem: null,
  };

  const [lists, setLists] = useState<List[]>(initialState.lists);
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(
    initialState.draggedItem
  );

  const addNewList = (newList: List) => {
    setLists((prevLists) => [...prevLists, newList]);
  };

  const removeList = (listToRemove: List) => {
    setLists((prevLists) =>
      prevLists.filter((list) => list.id !== listToRemove.id)
    );
  };

  const addNewTask = (newTask: Task) => {
    setLists((prevLists) => {
      const updatedLists = [...prevLists];
      const list = updatedLists.find((list) => list.id === newTask.listId);
      if (list) {
        list.tasks.push(newTask);
      }
      return updatedLists;
    });
  };

  const moveList = (moveListPayload: MoveList) => {
    const { draggedId, hoveredId } = moveListPayload;
    const draggedIndex = findItemIndexById(lists, draggedId);
    const hoverIndex = findItemIndexById(lists, hoveredId);
    const updatedLists = moveItem(lists, draggedIndex, hoverIndex);
    setLists(updatedLists)
  };

  const moveTask = (moveTaskPayload: MoveTask) => {
    const { draggedId, hoveredId, sourceListId, targetListId, draggedItem } =
    moveTaskPayload;

    const listsToUpdate = [...lists];

    const sourceListIndex = findItemIndexById(listsToUpdate, sourceListId);
    const targetListIndex = findItemIndexById(listsToUpdate, targetListId);

    const dragIndex = findItemIndexById(
      listsToUpdate[sourceListIndex].tasks,
      draggedId
    );

    const hoverIndex = findItemIndexById(
      listsToUpdate[targetListIndex].tasks,
      hoveredId
    );

    listsToUpdate[sourceListIndex].tasks.splice(dragIndex, 1);
    listsToUpdate[targetListIndex].tasks.splice(hoverIndex, 0, draggedItem);

      setLists(listsToUpdate);
  };

  return (
    <ListContext.Provider
      value={{
        lists,
        draggedItem,
        addNewList,
        removeList,
        addNewTask,
        moveList,
        moveTask,
        setDraggedItem,
      }}
    >
      {children}
    </ListContext.Provider>
  );
};

export default ListContextProvider;
