import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import * as yup from "yup";
import { useFormik } from "formik";
import { TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import UpgradeRoundedIcon from "@mui/icons-material/UpgradeRounded";
import { API } from "../API_LINK";

const editTodoFormValidationSchema = yup.object().shape({
  title: yup.string().required("Why not? Fill your Todo Title!"),
  description: yup.string().required("Why not? Fill your Todo Description!"),
});

export function EditModal({
  todo,
  editTodoModalShow,
  handleEditTodoModalClose,
  getUserTodo,
}) {
  const [editTodoLoadingButton, setEditTodoLoadingButton] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: todo.title,
      description: todo.description,
    },
    validationSchema: editTodoFormValidationSchema,
    onSubmit: (values) => {
      setEditTodoLoadingButton(true);
      editTodo(values);
    },
  });

  const editTodo = async (values) => {
    const dateTime = new Date();
    const postDate = `${dateTime.getDate()}-${
      dateTime.getMonth() + 1
    }-${dateTime.getFullYear()}`;
    const postTime = `${dateTime.getHours()}:${dateTime.getMinutes()}:${dateTime.getSeconds()}`;
    await fetch(`${API}/todo/edit/${todo._id}`, {
      method: "PUT",
      body: JSON.stringify({ ...values, date: postDate, time: postTime }),
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setEditTodoLoadingButton(false);
          handleEditTodoModalClose();
          getUserTodo();
        } else {
          alert(data.error);
        }
      });
  };
  return (
    <Modal
      backdrop="static"
      keyboard={false}
      show={editTodoModalShow}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={handleEditTodoModalClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h3>EDIT YOUR TODO</h3>
        </Modal.Title>
      </Modal.Header>
      <form onSubmit={formik.handleSubmit}>
        <Modal.Body>
          <div className="mt-3">
            <TextField
              type="text"
              id="title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
              variant="outlined"
              label="TITLE"
            />
            {formik.touched.title && formik.errors.title ? (
              <p className="text-danger">{formik.errors.title}</p>
            ) : (
              ""
            )}
          </div>
          <div className="mt-4">
            <TextField
              type="text"
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
              variant="outlined"
              label="DESCRIPTION"
            />
            {formik.touched.description && formik.errors.description ? (
              <p className="text-danger">{formik.errors.description}</p>
            ) : (
              ""
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleEditTodoModalClose}>
            Close
          </Button>
          <LoadingButton
            type="submit"
            loading={editTodoLoadingButton}
            variant="contained"
            endIcon={<UpgradeRoundedIcon />}
            loadingposition="end"
            color="success"
          >
            <span>UPDATE</span>
          </LoadingButton>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
