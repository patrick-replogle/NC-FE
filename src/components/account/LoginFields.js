import React, { useState } from "react";
import { Field } from "formik";
import { TextField } from "formik-material-ui";
import { Button } from "@material-ui/core";
import { buttonStyles } from "../../styles";
import Typography from "@material-ui/core/Typography";

const LoginFields = ({ values }) => {
  const buttonClass = buttonStyles();
  const [buttonDisable, setButtonDisable] = useState(true);

  const checkValues = (e) => {
    const email = document.querySelector("input[name='email']").value;
    const password = document.querySelector("input[name='password']").value;
    if (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email) && password) {
      setButtonDisable(false);
    } else {
      setButtonDisable(true);
    }
  };

  return (
    <>
      <Field
        style={{ marginTop: "10%" }}
        component={TextField}
        type="email"
        name="email"
        className="email"
        InputProps={{ onKeyUp: checkValues }}
        label="Email"
        required
      />
      <Field
        style={{ marginTop: "10%" }}
        component={TextField}
        type="password"
        name="password"
        className="email"
        InputProps={{ onKeyUp: checkValues }}
        label="password"
        required
      />

      <Button
        type="submit"
        style={{ marginTop: "10%" }}
        className={`${buttonClass.root} ${buttonClass.active}`}
        onClick={() => {}}
        disabled={buttonDisable}
      >
        <Typography variant="h5">Submit</Typography>
      </Button>
    </>
  );
};

export default LoginFields;
