import { useDrag } from "react-dnd";
import React, { useEffect } from "react";
import { getEmptyImage } from "react-dnd-html5-backend";
import { DragItem } from "../DragItem";
import { useListContext } from "../contexts/listContext";

export const useDragItem = (item: DragItem) => {
  const { setDraggedItem } = useListContext();
  const [, drag, preview] = useDrag({
    type: item.type,
    item: () => {
      setDraggedItem(item);
      return item;
    },
    end: () => setDraggedItem(null),
  });
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);
  return { drag };
};
