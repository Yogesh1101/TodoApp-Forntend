import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../API_LINK";
import "./comp-css/dashboard.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Button, Modal } from "react-bootstrap";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import * as yup from "yup";
import { useFormik } from "formik";
import LoadingButton from "@mui/lab/LoadingButton";
import { TextField } from "@mui/material";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import TodoList from "./TodoList";
import CircularProgress from "@mui/material/CircularProgress";

const createTodoFormValidationSchema = yup.object().shape({
  title: yup.string().required("Why not? Fill your Todo Title!"),
  description: yup.string().required("Why not? Fill your Todo Description!"),
});

function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [userTodos, setUserTodos] = useState([]);
  const [mainRefresh, setMainRefresh] = useState(true);
  const [createTodoModalShow, setCreateTodoModalShow] = useState(false);
  const [createTodoLoadingButton, setCreateTodoLoadingButton] = useState(false);
  const handleCreateTodoModalClose = () => setCreateTodoModalShow(false);
  const handleCreateTodoModalShow = () => setCreateTodoModalShow(true);

  const checkToken = async () => {
    if (!localStorage.getItem("token")) {
      navigate("/login", { replace: true });
    } else {
      await fetch(`${API}/todo/userDetails`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
      })
        .then((response) => response.json())
        .then(async (data) => {
          await getUserTodo();
          if (data.data) {
            setMainRefresh(false);
            setUserData(data.data);
          } else {
            alert(data.error);
          }
        });
    }
  };

  const getUserTodo = async () => {
    await fetch(`${API}/todo/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.data) {
          setUserTodos(data.data);
        } else {
          alert(data.error);
        }
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    checkToken();
  }, []);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    validationSchema: createTodoFormValidationSchema,
    onSubmit: (values, actions) => {
      setCreateTodoLoadingButton(true);
      createTodo(values);
      actions.resetForm();
    },
  });

  const createTodo = async (values) => {
    const dateTime = new Date();
    const postDate = `${dateTime.getDate()}-${
      dateTime.getMonth() + 1
    }-${dateTime.getFullYear()}`;
    const postTime = `${dateTime.getHours()}:${dateTime.getMinutes()}:${dateTime.getSeconds()}`;
    await fetch(`${API}/todo/new`, {
      method: "POST",
      body: JSON.stringify({ ...values, date: postDate, time: postTime }),
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setCreateTodoLoadingButton(false);
          handleCreateTodoModalClose();
          getUserTodo();
        } else {
          alert(data.error);
        }
      });
  };

  return (
    <div className="main-div">
      {mainRefresh ? (
        <div className="h-100 d-flex justify-content-center align-items-center  ">
          <CircularProgress />
        </div>
      ) : (
        <div className="h-100">
          {/* NavBar */}
          <Navbar expand="lg" className="shadow-lg main-navbar">
            <Container>
              <Navbar.Brand className="fs-3 nav-title">
                YK's TODO APP
              </Navbar.Brand>
              <Navbar.Toggle
                className="nav-toggler"
                aria-controls="basic-navbar-nav"
              />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="main-nav-names fs-5 w-100 d-flex justify-content-end align-items-center">
                  <Nav.Link className="nav-names" onClick={() => navigate("/")}>
                    HOME
                  </Nav.Link>
                  <Nav.Link
                    className="nav-names"
                    onClick={handleCreateTodoModalShow}
                  >
                    CREATE
                  </Nav.Link>
                  <Nav.Link className="nav-names" onClick={handleLogout}>
                    LOGOUT
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>

          <div className="container mt-5">
            <div className="d-flex justify-content-around align-items-center py-5">
              <h1>{userData.firstName} {userData.lastName}</h1>
              <Fab
                color="primary"
                aria-label="add"
                onClick={handleCreateTodoModalShow}
              >
                <AddIcon />
              </Fab>
            </div>
            <div>
              {userTodos.length === 0 ? (
                <h1 className="w-100 text-center mt-5 text-warning">No Todos to Display.</h1>
              ) : (
                <div className="row h-100 mt-5 gx-3 gx-lg-5 row-cols-1 row-cols-md-2 row-cols-xl-3">
                  {userTodos.map((todo, index) => (
                    <TodoList
                      todo={todo}
                      key={index}
                      getUserTodo={getUserTodo}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Create Todo Modal */}
          <Modal
            backdrop="static"
            keyboard={false}
            show={createTodoModalShow}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={handleCreateTodoModalClose}
          >
            <Modal.Header closeButton>
              <Modal.Title>
                <h3>CREATE NEW TODO</h3>
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
                <Button variant="danger" onClick={handleCreateTodoModalClose}>
                  Close
                </Button>
                <LoadingButton
                  type="submit"
                  loading={createTodoLoadingButton}
                  variant="contained"
                  endIcon={<AddRoundedIcon />}
                  loadingposition="end"
                  color="success"
                >
                  <span>Create</span>
                </LoadingButton>
              </Modal.Footer>
            </form>
          </Modal>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
