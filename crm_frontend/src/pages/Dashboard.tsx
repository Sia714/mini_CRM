// import React, { useState } from "react";
import {
  Grid
} from "@mui/material";
import AddNewCustomer from "../components/addNewCustomer";
import AddNewOrder from "../components/addNewOrder";
function Dashboard() {
//   const API_BASE = import.meta.env.VITE_API_BASE;

  const categories = [
  "Electronics",
  "Smartphones",
  "Fashion",
  "Home & Kitchen",
  "Beauty & Personal Care",
  "Sports & Outdoors",
  "Books",
  "Toys & Games",
  "Grocery & Gourmet Food",
  "Automotive",
];
  return (
    <Grid container direction="row" spacing={2}  sx={{
    justifyContent: "flex-start",
    alignItems: "flex-start",
  }}>
        <Grid size={{ xs: 12, md: 6 }}>
    <AddNewCustomer categories={categories}/>
    </Grid>
    <Grid size={{ xs: 12, md: 6 }}>
    <AddNewOrder categories={categories}/>

    </Grid>
    </Grid>
  );
}

export default Dashboard;
