import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import AccountDrawer from "./account/AccountDrawer";

const styles = makeStyles((theme) => ({
  container: {
    width: "20vw",
    height: "10vh",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  icons: {
    alignSelf: "center",
    color: "gray",
    margin: "0 4%",
  },
}));

function PersistentHeader(props) {
  const classes = styles();

  return (
    <section className={classes.container}>
      {/* <Typography variant="h5" className={classes.icons}>
        <Icon icon={bxBell} />
      </Typography>
      <Typography variant="h5" className={classes.icons}>
        <Icon icon={magnifyingGlass} />
      </Typography> */}

      <AccountDrawer {...props} />
    </section>
  );
}

export default PersistentHeader;
