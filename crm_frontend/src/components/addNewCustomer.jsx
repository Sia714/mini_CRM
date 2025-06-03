import React, { useState,useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Container,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
    Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Grid
} from "@mui/material";

function AddNewCustomer() {
  const API_BASE = import.meta.env.VITE_API_BASE;
 const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState  ("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [isActive, setIsActive] = useState (null);
  const [lastVisited, setLastVisited] = useState  (""); // store as yyyy-mm-dd string
  const [visits, setVisits] = useState(null);
  const [totalSpent, setTotalSpent] = useState  (null);
  const [totalOrders, setTotalOrders] = useState(null);
  const [lastRating, setLastRating] = useState(null);
  const [customers, setCustomers] = useState([]);

  const [category, setCategory] = useState("");
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

  const [errors, setErrors] = useState({});

  const validateFields = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Name is required";
    if (!mobile) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(mobile)) {
      newErrors.mobile = "Mobile number must be exactly 10 digits";
    }
    if (!email) newErrors.email = "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Invalid email format";
    if (!address) newErrors.address = "Address is required";
    if (isActive === null) newErrors.isActive = "Select if active or not";

    if (totalOrders) {
      setTotalOrders(Math.floor(totalOrders));
    }
    if (visits) {
      setVisits(Math.floor(visits));
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchCustomers=async()=>{
     try {
       fetch(`${API_BASE}/user/customers`, {
        credentials: "include",
      }).then((res)=>res.json())
      .then((details)=>{setCustomers(details);})
      .catch((err)=>{console.log(err);})
     
    }catch(err){console.log(err);}
  };

  useEffect(()=>{fetchCustomers()},[])

  const addCustomer = async () => {
    if (!validateFields()) return;

    try {
      const response = await fetch(`${API_BASE}/customer/addCustomer`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          mobile,
          gender,
          email,
          fullAddress: address,
          lastVisited,
          visits,
          isActive,
          totalSpent,
          totalOrders,
          lastRating,
          category,
        }),
      });

      const res = await response.json();
      alert("Customer added successfully!");

      // Reset form
      setName("");
      setMobile("");
      setAddress("");
      setGender("");
      setEmail("");
      setIsActive(null);
      setVisits(null);
      setTotalSpent(null);
      setLastRating(null);
      setTotalOrders(null);
      setCategory("");
      setErrors({});
    } catch (err) {
      console.error("Error adding customer:", err);
    }
  };

  return (
    <>
     <Container maxWidth="md" sx={{ mb: 5 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
              {showForm ? "" :
              <Button
                variant="contained"
                onClick={() => setShowForm(true)}
              >
                + Add New Customer
    
              </Button>}
            </Box>
    
    <Container maxWidth="md" sx={{ mb: 5 }}>
     
            {showForm && (
      <Paper elevation={3} sx={{ p: 4, mt: 4 , boxShadow:10}}>
        <Typography variant="h5" gutterBottom>
          Add New Customer
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            size="small"
            label="Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            size="small"
            label="Mobile"
            fullWidth
            type="number"
            value={mobile ?? ""}
            onChange={(e) => setMobile(e.target.value)}
            error={!!errors.mobile}
            helperText={errors.mobile}
          />
          <TextField
            size="small"
            label="Email"
            fullWidth
            value={email ?? ""}
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            size="small"
            label="Address"
            fullWidth
            value={address ?? ""}
            onChange={(e) => setAddress(e.target.value)}
            error={!!errors.address}
            helperText={errors.address}
          />
          <FormLabel>Gender</FormLabel>
          <RadioGroup
            row
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <FormControlLabel value="Male" control={<Radio />} label="Male" />
            <FormControlLabel
              value="Female"
              control={<Radio />}
              label="Female"
            />
            <FormControlLabel
              value="None"
              control={<Radio />}
              label="Prefer not to say"
            />
          </RadioGroup>

          <Box display="flex" gap={2}>
  <TextField
    size="small"
    label="Visits"
    fullWidth
    type="number"
    slotProps={{ htmlInput: { maxLength: 12 } }}
    InputProps={{ inputProps: { min: 0 } }}
    value={visits ?? ""}
    onChange={(e) => setVisits(Number(e.target.value))}
  />
  <TextField
    size="small"
    label="Last Visited"
    type="date"
    fullWidth
    value={lastVisited ?? ""}
    onChange={(e) => setLastVisited(e.target.value)}
    InputLabelProps={{ shrink: true }}
  />
</Box>

<Box display="flex" gap={2} mt={2}>
  <TextField
    size="small"
    label="Total Spent"
    fullWidth
    type="number"
    InputProps={{ inputProps: { min: 0 } }}
    value={totalSpent ?? ""}
    onChange={(e) => setTotalSpent(Number(e.target.value))}
  />
  <TextField
    size="small"
    label="Total Orders"
    fullWidth
    type="number"
    InputProps={{ inputProps: { min: 0 } }}
    value={totalOrders ?? ""}
    onChange={(e) => setTotalOrders(Number(e.target.value))}
  />
</Box>

<Box display="flex" gap={2} mt={2}>
  <TextField
    size="small"
    label="Last Rating"
    fullWidth
    type="number"
    InputProps={{ inputProps: { min: 0, max: 5 } }}
    value={lastRating ?? ""}
    onChange={(e) => setLastRating(Number(e.target.value))}
  />
  <TextField
    select
    size="small"
    label="Category"
    fullWidth
    value={category ?? ""}
    onChange={(e) => setCategory(e.target.value)}
    variant="outlined"
  >
    {categories.map((cat) => (
      <MenuItem key={cat} value={cat}>
        {cat}
      </MenuItem>
    ))}
  </TextField>
</Box>

<Box display="flex" alignItems="center" mt={2}>
  <FormLabel sx={{ mr: 2 }}>Customer is</FormLabel>
  <RadioGroup
    row
    value={isActive === null ? "" : String(isActive)}
    onChange={(e) => setIsActive(e.target.value === "true")}
  >
    <FormControlLabel value="true" control={<Radio />} label="Active" />
    <FormControlLabel value="false" control={<Radio />} label="Inactive" />
  </RadioGroup>
</Box>

{errors.isActive && (
  <Typography color="error" variant="caption">
    {errors.isActive}
  </Typography>
)}
<Box mt={4}>
  <Grid container spacing={2}>
    <Grid size={{xs:6}}>
      <Button
        fullWidth
        variant="contained"
        onClick={addCustomer}
      >
        Add Customer
      </Button>
    </Grid>
    <Grid size={{xs:6}}>
      <Button
        fullWidth
        variant="contained"
        color="secondary"
        onClick={() => setShowForm(false)}
      >
        Close Form
      </Button>
    </Grid>
  </Grid>
</Box>

        </Box>
      </Paper>
      )}

    </Container>
    <Paper sx={{ p: 2 , boxShadow:10}}>
  {customers.length > 0 ? (
    <>
    <Typography variant="h6" sx={{ p: 2 }}>
    All Customers
  </Typography>
     <TableContainer component={Paper} sx={{ mt: 2, p:2,boxShadow:"6" }}>
  
  <Table size="small">
    <TableHead>
      <TableRow>
        <TableCell>Name</TableCell>
        <TableCell>Mobile</TableCell>
        <TableCell>Email</TableCell>
        <TableCell>Gender</TableCell>
        <TableCell>Address</TableCell>
        <TableCell>Last Visited</TableCell>
        <TableCell>Total Spent</TableCell>
        <TableCell>Visits</TableCell>
        <TableCell>Total Orders</TableCell>
        <TableCell>Last Rating</TableCell>
        <TableCell>Category</TableCell>
        <TableCell>Status</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {customers.map((cust, index) => (
        <TableRow key={cust._id || index}>
          <TableCell>{cust.name}</TableCell>
          <TableCell>{cust.mobile}</TableCell>
          <TableCell>{cust.email}</TableCell>
          <TableCell>{cust.gender}</TableCell>
          <TableCell>{cust.fullAddress}</TableCell>
          <TableCell>{cust.lastVisited ? new Date(cust.lastVisited).toLocaleDateString() : "-"}</TableCell>
          <TableCell>₹{cust.totalSpent}</TableCell>
          <TableCell>{cust.visits}</TableCell>
          <TableCell>{cust.totalOrders}</TableCell>
          <TableCell>{cust.lastRating}</TableCell>
          <TableCell>{cust.category}</TableCell>
          <TableCell>
            {cust.isActive ? (
              <Typography color="green">Active</Typography>
            ) : (
              <Typography color="red">Inactive</Typography>
            )}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
    </>
  ) : (
    <Typography variant="body2" color="text.secondary">
      No customers found.
    </Typography>
  )}
</Paper>
</Container>
</>
  );
}

export default AddNewCustomer;
