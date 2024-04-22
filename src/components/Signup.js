import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  // Use State to set the state of the credentials
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    age: "",
    password: "",
    cpassword: "",
  });

  let history = useNavigate();

  const onChange = (e) => {
    e.preventDefault();
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password } = credentials;

    const age = parseInt(credentials.age);

    // console.log("Here1");
    const response = await fetch("http://localhost:5000/api/auth/createUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        age,
      }),
    });

    // console.log("Here2");
    const json = await response.json();
    // console.log(json);
    // console.log(json.success);

    if (json) {
      // Save the authtokena dn redirect
      localStorage.setItem("token", json.authtoken);
      history("/");
    } else {
      alert("Invalid");
    }
  };

  return (
    <div className="container">
      <h2 className="my-2">Create an Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label for="name" className="form-label">
            Name
          </label>
          <input
            type="test"
            className="form-control"
            id="name"
            aria-describedby="emailHelp"
            onChange={onChange}
            name="name"
          />
        </div>
        <div className="mb-3">
          <label for="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
            onChange={onChange}
            name="email"
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label for="age" className="form-label">
            Age
          </label>
          <input
            type="text"
            className="form-control"
            id="age"
            name="age"
            onChange={onChange}
            required
            min="18"
          />
        </div>
        <div className="mb-3">
          <label for="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            onChange={onChange}
            name="password"
            required
            minLength={5}
          />
        </div>
        <div className="mb-3">
          <label for="cpassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="cpassword"
            onChange={onChange}
            name="cpassword"
            required
            minLength={5}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}
