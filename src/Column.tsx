import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import { throttle } from "throttle-debounce-ts";
import { isHidden } from "./utils/isHidden";
import { useDragItem } from "./utils/useDragItem";
import { ColumnContainer, ColumnTitle } from "./styles";
import { Card } from "./Card";
import { AddNewItem } from "./AddNewItem";
import { Task, useListContext } from "./contexts/listContext";

type ColumnProps = {
  id: string;
  columnName: string;
  isPreview?: boolean;
  tasks?: Task[];
};

export function Column({ columnName, id, isPreview, tasks }: ColumnProps) {
  // const draggedItem = useAppSelector(draggedItemSelector);
  const ref = useRef<HTMLDivElement>(null);
  const { addNewTask, moveList, moveTask, setDraggedItem, draggedItem } = useListContext();

  const [, drop] = useDrop({
    accept: ["COLUMN", "CARD"],
    hover: throttle(200, () => {
      if (!draggedItem) return;
      if (draggedItem.type === "COLUMN") {
        if (draggedItem.id === id) return;
        const payload = {
          draggedId: draggedItem.id,
          hoveredId: id,
        };
        moveList(payload);
      } else {
        if (draggedItem.listId === id) return;
        if (tasks && tasks.length) return;
        const payload = {
          draggedId: draggedItem.id,
          hoveredId: null,
          sourceListId: draggedItem.listId,
          targetListId: id,
          draggedItem: { ...draggedItem, listId: id },
        };
        moveTask(payload);
        setDraggedItem({ ...draggedItem, listId: id });
      }
    }),
  });
  const { drag } = useDragItem({ type: "COLUMN", id, columnName });
  // const dispatch = useAppDispatch();

  const handleAddNewTask = (task: Task) => {
    addNewTask(task);
  };
  drag(drop(ref));
  return (
    <ColumnContainer
      isPreview={isPreview}
      ref={ref}
      isHidden={isHidden(draggedItem, "COLUMN", id, isPreview)}
    >
      <ColumnTitle>{columnName}</ColumnTitle>
      {tasks &&
        tasks.map((task) => (
          <Card
            key={task.id}
            text={task.text}
            listId={task.listId}
            id={task.id}
          />
        ))}
      <AddNewItem
        toggleButtonText="+Add Task"
        listId={id}
        onAddNewTask={handleAddNewTask}
        dark
      />
    </ColumnContainer>
  );
}
