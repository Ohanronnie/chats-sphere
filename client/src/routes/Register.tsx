import { useState, useRef, useEffect, FC } from "react";
import axios from "../utils/axios.ts";
import { IProps, IForm, IMeta } from "../interfaces/login.ts";
import { useNavigate } from "react-router-dom";
import MyTextInput from "../components/MyTextInput";
type Position = "absolute" | "relative" | "fixed";
const styles = {
  popup: {
    width: "90vw",
    height: "7rem",
    backgroundColor: "#008fff",
    padding: "20px",
    textAlign: "center" as unknown as undefined,
    display: "flex",
    flexFlow: "column",
    position: "fixed" as Position,
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    borderRadius: "5px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    justifyContent: "center",
    animation: "fade-in 5s",
  },
  h1: {
    color: "#fff",
    fontSize: "20px",
  },
  p: {
    color: "#fff",
    fontSize: "10px",
  },
  button: {
    width: "20%",
    position: "relative" as Position,
    left: "50%",
    color: "#008fff",
    backgroundColor: "#FFF",
    border: "1px solid #333",
    height: "1rem",
    transform: "translateX(-50%)",
    justifyContent: "center",
    fontSize: "10px",
    marginTop: ".4rem",
  },
};

export default function Login() {
  const [value, setValue] = useState<IForm>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<IForm>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const SuccessMessage = ({
    h1,
    p,
    button,
    div,
  }: {
    h1?: string;
    p?: string;
    button?: string;
    div?: string;
  }) => (
    <div className="popup" style={styles.popup}>
      {h1 && <h1 style={styles["h1"]}>{h1}</h1>}
      {p && <p style={styles.p}>{p}</p>}
      {button && (
        <button onClick={handleClick} style={styles.button}>
          Okay
        </button>
      )}
      {div && <div className="roller"></div>}
    </div>
  );
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [csrf, setCsrf] = useState<string>("");
  const setErrorVal = (name: string, value: string) => {
    setError((e: IForm) => ({ ...e, [name]: value }));
  };
  const navigate = useNavigate();
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const handleChange = (ev: any) => {
    setValue((e: IForm) => ({ ...e, [ev.target!.name]: ev.target!.value }));
  };
  const handleClick = () => {
    setSuccess(false);
    navigate("/register/login");
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (value.firstName.length < 4) setErrorVal("firstName", "Too short");
    else if (/^[a-z]/g.test(value.firstName))
      setErrorVal("firstName", "Invalid chars");
    else setErrorVal("firstName", "");
    if (value.lastName.length < 4) setErrorVal("lastName", "Too short");
    else if (/^[a-z]/g.test(value.firstName))
      setErrorVal("firstName", "Invalid chars");
    else setErrorVal("lastName", "");

    if (!/^[^\s@]+@[^\s@]+\.[a-z]+$/.test(value.email))
      setErrorVal("email", "Invalid email format");
    else setErrorVal("email", "");

    if (!/^[a-zA-Z0-9_ ]+$/.test(value.username))
      setErrorVal("username", "Invalid username format");
    if (value.password.length < 6)
      setErrorVal("password", "Password too short");
    else setErrorVal("password", "");

    try {
      let response = await axios().post(
        `/register/username?username=${value.username}`,
        null
      );
      setErrorVal("username", "");
    } catch (err: any) {
      setErrorVal("username", err.response.data.message);
    }
    try {
      let response = await axios().post(
        `/register/email?email=${value.email}`,
        null
      );
      setErrorVal("email", "");
    } catch (err: any) {
      setErrorVal("email", err.response.data.message);
    }
    for (let key of Object.values(error)) {
      console.log(key);
      if (key.length > 1) return;
      setLoading(true);
      try {
        let response = await axios().post("/register/signup", value);
        console.log(response);
        break;
      } catch (err: any) {
        console.log(err.response.status);
        if (err.response.status === 300) {
          setLoading(false);
          setSuccess(true);
        } else {
          setLoading(false);
        }
        break;
      }
    }
  };
  return (
    <>
      <div className="rounded-br-4xl pt-7 pl-5 h-28 shadow-xl">
        <h3 className="text-xl text-great-blue-10 capitalize">New account</h3>
        <p className="text-slate-900 text-md">Sign up and get started</p>
      </div>
      <form
        className="mt-10 px-9"
        action="/register/signup"
        method="post"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
      >
        <MyTextInput
          label="Email"
          name="email"
          type="mail"
          placeholder="Enter your mail"
          error={error.email}
          onChange={handleChange}
          value={value.email}
        />
        <div className="mt-4 mb-4 flex">
          <div className="mr-3">
            <MyTextInput
              label="First Name"
              name="firstName"
              type="text"
              placeholder="First Name"
              error={error.firstName}
              onChange={handleChange}
              value={value.firstName}
            />
          </div>
          <div>
            <MyTextInput
              label="Last Name"
              name="lastName"
              type="text"
              placeholder="Last Name"
              error={error.lastName}
              onChange={handleChange}
              value={value.lastName}
            />
          </div>
        </div>
        <MyTextInput
          label="Username"
          name="username"
          type="text"
          dClass="mb"
          className="mb-4"
          placeholder="Username"
          error={error.username}
          onChange={handleChange}
          value={value.username}
        />
        <MyTextInput
          label="Enter your password"
          name="password"
          type="password"
          placeholder="Enter your password"
          error={error.password}
          onChange={handleChange}
          value={value.password}
        />
        <button
          type="submit"
          style={{ borderWidth: "1.5px" }}
          className="mt-5 text-slate-500 rounded-2xl h-9 w-full bg-gradient-to-r from-great-blue-50 to-great-blue-100 hover:bg-slate-200 hover:from-slate-200 hover:to-slate-200 hover:text-slate-500 hover:border-solid hover:border-2 hover:border-great-blue-100"
          disabled={isSubmitting}
        >
          Sign Up
        </button>
      </form>
      <hr className="w-1/2 mx-auto mt-5" />
      <div className="px-10">
        <button
          onClick={() => {
            navigate("/register/login");
          }}
          style={{ borderWidth: "1.5px" }}
          className="hover:bg-gradient-to-r hover:from-great-blue-50 hover:border-slate-200 hover:to-great-blue-100 text-great-blue-100 bg-slate-200 hover:text-white rounded-2xl mt-3 h-9 w-full border-solid border-2 border-great-blue-100 mb-13"
        >
          Sign In
        </button>
      </div>
      {success && (
        <SuccessMessage
          h1="Success"
          p="Your form has been submitted successfully, click the link in your mail to verify your account"
          button="true"
        />
      )}
      {!success && loading && <SuccessMessage div="true" />}
    </>
  );
}
