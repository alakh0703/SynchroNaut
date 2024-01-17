import React, { useEffect } from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import "./Task.css";
import AddTask from "./Task_Subs/AddTask";

const Container = styled.div`
  border-radius: 10px;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.2); /* Added a subtle box shadow */
  padding: 12px; /* Increased padding for better spacing */
  color: #000;
  margin-bottom: 16px; /* Increased margin for spacing between containers */
  min-height: 90px;
  margin-left: 10px;
  margin-right: 10px;
  background-color: ${(props) => bgcolorChange(props)};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const TextContent = styled.div`
  /* Add your styles for the text content here */
`;

const Icons = styled.div`
  display: flex;
  justify-content: flex-end; /* Corrected the property name */
  padding: 4px; /* Increased padding for spacing between icons */
`;

function bgcolorChange(props) {
  return props.isDragging
    ? "#d2f0ff"
    : props.isDraggable
      ? props.isBacklog
        ? "#F2D7D5"
        : "#DCDCDC"
      : props.isBacklog
        ? "#F2D7D5"
        : "#ffffff";
}

export default function Task({ task, index }) {



  return (
    <Draggable draggableId={`${task.taskId}`} key={task.taskId} index={index}>
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          <div className="task-main-nav">
            <p className="task-main-title">{task.title}</p>
            <p className="task-main-des">{(task.description).slice(0, 25)}...</p>
          </div>
          <div className="task-main-assign">
            <div className="task-main-assign-img">
              {task.assingedTo.slice(0, 1)}
            </div>
            <p className="task-main-name">{task.assingedTo}</p>

          </div>

          {provided.placeholder}

        </Container>

      )}
    </Draggable>
  );
}