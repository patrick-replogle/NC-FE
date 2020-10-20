import React, { useState } from "react";
import { Field } from "formik";
import { TextField } from "formik-material-ui";
import { Button } from "@material-ui/core";
import { buttonStyles } from "../../styles";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

const LoginFields = (props) => {
  const classes = buttonStyles();
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
          className={`${classes.root} ${classes.active}`}
          type="submit"
          disabled={buttonDisable}
          style={{marginTop: "30px"}}
        >
          <Typography variant="h5">
            {props.submitting ? (
              <CircularProgress size="12px"
              style={{ color: "white"}} />
            ) : (
              "Submit"
            )}
          </Typography>
        </Button>
        {props.errMessage && (
            <p style={{ color: "crimson" }}>{props.errMessage}</p>
          )}
    </>
  );
};

export default LoginFields;
