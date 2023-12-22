import React, { useEffect, useState } from "react";
import "./comp-css/login.css";
import { TextField, Typography } from "@mui/material";
import todoLogin from "../images/login.svg";
import { useNavigate } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import * as yup from "yup";
import { useFormik } from "formik";
import LoadingButton from "@mui/lab/LoadingButton";
import { API } from "../API_LINK";

const formValidationSchema = yup.object().shape({
  email: yup.string().required("Why not? Fill your Email Address!"),
  password: yup.string().required("Why not? Fill your Password!"),
});

function Login() {
  const navigate = useNavigate();
  const [loadingButton, setLoadingButton] = useState(false);
  const [err, setErr] = useState("");
  const buttonStyle = {
    backgroundColor: "rgba(255 165 0)",
    border: "0px",
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: formValidationSchema,
    onSubmit: (values) => {
      setLoadingButton(true);
      loginUser(values);
    },
  });

  const loginUser = async (values) => {
    await fetch(`${API}/user/login`, {
      method: "POST",
      body: JSON.stringify(values),
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
    <div className="login-div d-flex flex-row justify-content-between ">
      <div
        data-aos-delay="300"
        data-aos="fade-down"
        className="login-left d-flex flex-column justify-content-center align-items-start"
      >
        <h1 className="login-title w-100">YK's TODO APP</h1>
        <p className="login-description mt-3">
          Unlock the door to productivity and dive into a realm where every
          login is a step closer to conquering your tasks. Your journey to
          accomplishment begins with a single click.
        </p>
        <form onSubmit={formik.handleSubmit} className="w-100 mt-5">
          <h2 className="text-danger">Login to Continue</h2>
          <div className="mt-5">
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
              Don't have an Account,{" "}
              <span
                onClick={() => navigate("/signup")}
                className="login-toSignup"
              >
                Create...
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
      <div className="login-right d-flex align-items-center justify-content-center ">
        <img
          data-aos-delay="300"
          data-aos="fade-up"
          width={"80%"}
          src={todoLogin}
          alt="Todo..."
        ></img>
      </div>
    </div>
  );
}

export default Login;
