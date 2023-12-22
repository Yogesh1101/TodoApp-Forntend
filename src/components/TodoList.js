import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import Fab from "@mui/material/Fab";
import LoadingButton from "@mui/lab/LoadingButton";
import { EditModal } from "./EditModal";
import { API } from "../API_LINK";

function TodoList({ todo, getUserTodo }) {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editStatusLoading, setEditStatusLoading] = useState(false);
  const [editTodoModalShow, setEditTodoModalShow] = useState(false);
  const handleEditTodoModalShow = () => setEditTodoModalShow(true);
  const handleEditTodoModalClose = () => setEditTodoModalShow(false);

  const handleDelete = async (id) => {
    await fetch(`${API}/todo/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          getUserTodo();
        }
      });
  };
  const handleEditStatus = async (id) => {
    await fetch(`${API}/todo/edit/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status: "Completed" }),
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setEditStatusLoading(false);
          getUserTodo();
        }
      });
  };
  return (
    <div className="col mb-5">
      <div className="card h-100 text-white">
        <div className="card-header bg-danger text-center">
          <h3>{todo.title}</h3>
        </div>
        <div className="card-body text-center bg-light text-black">
          <h4 className="mt-2">{todo.description}</h4>
          <h5 className="mt-4 text-uppercase">
            STATUS :{" "}
            {todo.status === "Completed" ? (
              <span className="text-success">{todo.status}</span>
            ) : (
              <span className="text-danger">{todo.status}</span>
            )}
          </h5>
          <div className="d-flex mt-4 justify-content-between">
            <h5>DATE : {todo.date}</h5>
            <h5>TIME : {todo.time}</h5>
          </div>
        </div>
        <div className="card-footer w-100 text-black d-flex justify-content-between align-items-center p-4">
          <div className="h-100 w-100">
            {todo.status === "Completed" ? null : (
              <LoadingButton
                loading={editStatusLoading}
                variant="contained"
                endIcon={<CheckCircleRoundedIcon />}
                loadingposition="end"
                color="success"
                className="h-100 w-50 rounded-5"
                onClick={() => {
                  handleEditStatus(todo._id);
                  setEditStatusLoading(true);
                }}
              >
                <span>Done</span>
              </LoadingButton>
            )}
          </div>
          <div className="d-flex gap-3">
            <Fab
              color="warning"
              aria-label="edit"
              onClick={handleEditTodoModalShow}
            >
              <EditIcon />
            </Fab>
            <div>
              {deleteLoading ? (
                <Fab color="error" aria-label="delete" disabled>
                  <DeleteRoundedIcon />
                </Fab>
              ) : (
                <Fab
                  color="error"
                  aria-label="delete"
                  onClick={() => {
                    handleDelete(todo._id);
                    setDeleteLoading(true);
                  }}
                >
                  <DeleteRoundedIcon />
                </Fab>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Todo Modal */}
      <EditModal
        todo={todo}
        editTodoModalShow={editTodoModalShow}
        handleEditTodoModalClose={handleEditTodoModalClose}
        getUserTodo={getUserTodo}
      />
    </div>
  );
}

export default TodoList;
