import React, { useState,useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Container,
  Paper,
  Radio, RadioGroup, FormControlLabel, FormLabel,
} from "@mui/material";

function AddNewCustomer({ categories }: { categories: string[] }) {
  const API_BASE = import.meta.env.VITE_API_BASE;

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState<string>("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [isActive, setIsActive] = useState<boolean | null>(null);
  const [lastVisited, setLastVisited] = useState<string>(""); // store as yyyy-mm-dd string
  const [visits, setVisits] = useState<number|null>(null);
  const [totalSpent, setTotalSpent] = useState<number|null>(null);
  const [totalOrders, setTotalOrders] = useState<number|null>(null);
  const [lastRating, setLastRating] = useState<number|null>(null);
  const [category, setCategory] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
type user={
  name:String,
  email:String,
  photo: URL,
}
  const [userData,setUserData]=useState<user>();
   const loadUserData=()=>{
      fetch(`${API_BASE}/auth/me`, { credentials: 'include',})
          .then(res=>res.json())
          .then(details=>{
              setUserData(details||[]);
          })
           .catch((err) => console.error(err));
    }
     useEffect(()=>{
      loadUserData();
      
    },[])

  const validateFields = () => {
    const newErrors: Record<string, string> = {};
    if (!name) newErrors.name = "Name is required";
    if (!mobile){
         newErrors.mobile = "Mobile number is required"; 
    }else if (!/^\d{10}$/.test(mobile)) {
        newErrors.mobile = "Mobile number must be exactly 10 digits";
    }
    if (!email) newErrors.email = "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Invalid email format";
    if (!address) newErrors.address = "Address is required";
    if (isActive === null) newErrors.isActive = "Select if active or not";
    
    if(totalOrders){
      setTotalOrders(Math.floor(totalOrders))}
        if(visits){
      setVisits(Math.floor(visits))}
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addCustomer = async () => {
    if (!validateFields()) return;

    try {
      const response = await fetch(`${API_BASE}/customer/addCustomer`, {
        credentials: 'include',
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
      console.log("Customer added:", res);
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
    
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
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
            value={address?? ""}
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
            <FormControlLabel value="Female" control={<Radio />} label="Female" />
            <FormControlLabel value="None" control={<Radio />} label="Prefer not to say" />
            </RadioGroup>
         
          
          <TextField
            size="small"
            label="Total Orders"
            fullWidth
            type="number"
            InputProps={{ inputProps: { min: 0} }}
            value={visits ?? ""}
            onChange={(e) => setVisits(Number(e.target.value))}
          />
            <TextField
              size="small"
              label="Last Visited"
              type="date"
              value={lastVisited ?? ""}
              onChange={(e) => setLastVisited(e.target.value)}
              InputLabelProps={{
                shrink: true, // keeps label visible when date is picked
              }}
            />
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
            InputProps={{ inputProps: { min: 0} }}
            value={totalOrders ?? ""}
            onChange={(e) => setTotalOrders(Number(e.target.value))}
          />
         
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
            value={category ?? ""}
            onChange={(e) => setCategory(e.target.value)}
            fullWidth
            variant="outlined"
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>
          <FormLabel>Customer is</FormLabel>
            <RadioGroup
            row
            value={isActive === null ? "" : String(isActive)}
            onChange={(e) => setIsActive(e.target.value === "true")}
            >
            <FormControlLabel value="true" control={<Radio />} label="Active" />
            <FormControlLabel value="false" control={<Radio />} label="Inactive" />
            </RadioGroup>
            {errors.isActive && (
            <Typography color="error" variant="caption">
                {errors.isActive}
            </Typography>
            )}
          <Button variant="contained" onClick={addCustomer}>
            Add Customer
          </Button>
        </Box>
      </Paper>
    </Container>
)}

export default AddNewCustomer;
