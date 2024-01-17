import React from "react";
import styled from "styled-components";
import Task from "./Task";
import "./scroll.css";
import { Droppable } from "react-beautiful-dnd";

const Container = styled.div`
  background-color: #ffffff; 
  border-radius: 10px;
  width: 300px;
  Font-family: Cambria, Georgia, serif;
  height: 475px;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  border: 1px solid #e0e0e0;
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.1);
  margin-right: 30px;
`;

const Title = styled.h3`
  padding: 10px;
  background-color: #f2f2f2;
  text-align: center;
  margin: 0; 
  border-top-left-radius: 10px; 
  border-top-right-radius: 10px; 
  color: #000000; 
  position: sticky;
`;

const TaskList = styled.div`
  padding: 10px; 
  transition: background-color 0.2s ease;
  background-color: #ffffff; 
  flex-grow: 1;
  min-height: 100px;
  border-bottom-left-radius: 10px; 
  border-bottom-right-radius: 10px; 
`;
export default function Column({ title, tasks, id }) {
  if (!tasks) return (<div></div>)
  return (
    <Container className="column">
      <Title
        style={{
          backgroundColor: "#f2f2f2",
          position: "stick",

        }}
      >
        {title}
      </Title>
      <Droppable droppableId={id}
      >
        {(provided, snapshot) => (
          <TaskList
            ref={provided.innerRef}
            {...provided.droppableProps}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {tasks.map((task, index) => (
              <Task key={task.taskId} index={index} task={task} />
            ))}
            {provided.placeholder}
          </TaskList>
        )}
      </Droppable>
    </Container>
  );
}