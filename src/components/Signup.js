import React, { useEffect, useState } from "react";
import "./comp-css/signup.css";
import { TextField, Typography } from "@mui/material";
import todoSignup from "../images/signup.svg";
import { useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import * as yup from "yup";
import { useFormik } from "formik";
import { API } from "../API_LINK";

const formValidationSchema = yup.object({
  firstName: yup.string().required("Why not? Fill your First Name!"),
  lastName: yup.string().required("Why not? Fill your Last Name!"),
  email: yup.string().required("Why not? Fill your Email Address!"),
  password: yup.string().required("Why not? Fill your Password!"),
});

function Signup() {
  const navigate = useNavigate();
  const [err, setErr] = useState("");
  const [loadingButton, setLoadingButton] = useState(false);

  const buttonStyle = {
    backgroundColor: "rgba(255 165 0)",
    border: "0px",
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    validationSchema: formValidationSchema,
    onSubmit: (values) => {
      setLoadingButton(true);
      createUser(values);
    },
  });

  const createUser = async (newUser) => {
    await fetch(`${API}/user/signup`, {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        setLoadingButton(false);
        if (data.token) {
          localStorage.setItem("token", data.token);
          navigate("/");
        } else {
          setErr(data.error);
        }
      });
  };

  const checkToken = async () => {
    if (localStorage.getItem("token")) {
      navigate("/", { replace: true });
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <div className="signup-div d-flex flex-row justify-content-between ">
      <div
        data-aos-delay="300"
        data-aos="fade-right"
        className="signup-left d-flex flex-column justify-content-center align-items-start"
      >
        <h1 className="signup-title w-100">YK's TODO APP</h1>
        <p className="signup-description mt-3">
          Embark on your journey to productivity with a single sign-up. Join us,
          where each registration marks the beginning of a more organized and
          empowered you. Your to-dos, your way, your success story starts here.
        </p>
        <form onSubmit={formik.handleSubmit} className="w-100 mt-5">
          <h2 className="text-danger">Signup to Start</h2>
          <div className="row mt-4">
            <div className="col-6">
              <TextField
                type="text"
                id="firstName"
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                fullWidth
                variant="outlined"
                label="First Name"
              />
              {formik.touched.firstName && formik.errors.firstName ? (
                <p className="text-danger">{formik.errors.firstName}</p>
              ) : (
                ""
              )}
            </div>
            <div className="col-6">
              <TextField
                type="text"
                id="lastName"
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                fullWidth
                variant="outlined"
                label="Last Name"
              />
              {formik.touched.lastName && formik.errors.lastName ? (
                <p className="text-danger">{formik.errors.lastName}</p>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="mt-3">
            <TextField
              type="email"
              id="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
              variant="outlined"
              label="Email Address"
            />
            {formik.touched.email && formik.errors.email ? (
              <p className="text-danger">{formik.errors.email}</p>
            ) : (
              ""
            )}
          </div>
          <div className="mt-3">
            <TextField
              type="password"
              id="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
              variant="outlined"
              label="Password"
            />
            {formik.touched.password && formik.errors.password ? (
              <p className="text-danger">{formik.errors.password}</p>
            ) : (
              ""
            )}
          </div>
          <div className="mt-3">
            <p className="text-black">
              Already have an Account,{" "}
              <span
                onClick={() => navigate("/login")}
                className="signup-toLogin"
              >
                Login
              </span>
            </p>
          </div>
          <div>
            {err ? (
              <Typography className="mt-3" color={"error"}>
                {err}
              </Typography>
            ) : null}
          </div>
          <LoadingButton
            type="submit"
            className="mt-4"
            loading={loadingButton}
            variant="contained"
            endIcon={<SendIcon />}
            loadingposition="end"
            style={buttonStyle}
          >
            <span>Submit</span>
          </LoadingButton>
        </form>
      </div>
      <div className="signup-right d-flex align-items-center justify-content-center ">
        <img
          data-aos-delay="300"
          data-aos="fade-left"
          width={"70%"}
          src={todoSignup}
          alt="Todo..."
        ></img>
      </div>
    </div>
  );
}

export default Signup;
