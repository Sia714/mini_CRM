import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Container,
  Paper,
  Autocomplete,
  CircularProgress,
   Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow,  Grid
} from "@mui/material";

function AddNewOrder() {

  const API_BASE = import.meta.env.VITE_API_BASE;

   const [showForm, setShowForm] = useState(false);
  const [product, setProduct] = useState("");
  const [customerId, setCustomerId] = useState ("");
  const [orderedOn, setOrderedOn] = useState (""); // store as yyyy-mm-dd string
  const [price, setPrice] = useState(null);
  const [rating, setRating] = useState(null);
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

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  const [errors, setErrors] = useState({});

   const fetchOrders=async()=>{
       try {
         fetch(`${API_BASE}/user/orders`, {
          credentials: "include",
        }).then((res)=>res.json())
        .then((details)=>{setOrders(details);})
        .catch((err)=>{console.log(err);})
       
      }catch(err){console.log(err);}
    };
  
    useEffect(()=>{fetchOrders()},[])

  const validateFields = () => {
    const newErrors = {};
    if (!product) newErrors.name = "Product Name is required";
    if (!customerId) {
      newErrors.mobile = "CustomerId is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchQuery.length > 2) {
        fetch(`${API_BASE}/customer/search?query=${searchQuery}`, {
          credentials: "include",
        })
          .then((res) => res.json())
          .then((data) => {
            if (Array.isArray(data)) {
              setSearchResults(data);
            } else {
              console.warn("Unexpected response format:", data);
              setSearchResults([]); // or show a toast
            }
          })
          .catch((err) => {
            console.error("Search failed:", err);
            setSearchResults([]);
          });
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const addOrder = async () => {
    if (!validateFields()) return;

    try {
      const response = await fetch(`${API_BASE}/customer/addOrder`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product,
          customerId,
          orderedOn,
          price,
          rating,
          category,
        }),
      });

      const res = await response.json();
      console.log("Order added:", res);
      alert("Order added successfully!");

      // Reset form
      setProduct("");
      setCustomerId("");
      setOrderedOn("");
      setPrice(null);
      setRating(null);
      setCategory("");
      setErrors({});
    } catch (err) {
      console.error("Error adding order:", err);
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
                          + Add New Order

          </Button>}
        </Box>
    <Container maxWidth="md" sx={{ mb: 5 }}>

        {showForm && (
          <Paper elevation={3} sx={{ p: 4, mt: 3,   boxShadow:10}}>
            <Typography variant="h6" gutterBottom>
              Add New Order
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                size="small"
                label="Product Name"
                fullWidth
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                error={!!errors.product}
                helperText={errors.product}
              />

              <Autocomplete
                options={searchResults || []}
                getOptionLabel={(option) => `${option.name} - ${option.mobile}`}
                onInputChange={(e, value) => setSearchQuery(value)}
                onChange={(e, value) => setCustomerId(value?._id || "")}
                loading={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Customer"
                    variant="outlined"
                    size="small"
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />

              <TextField
                size="small"
                label="Ordered on"
                type="date"
                value={orderedOn ?? ""}
                onChange={(e) => setOrderedOn(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                size="small"
                label="Price"
                fullWidth
                type="number"
                value={price ?? ""}
                onChange={(e) => setPrice(Number(e.target.value))}
              />

              <TextField
                size="small"
                label="Rating"
                fullWidth
                type="number"
                value={rating ?? ""}
                onChange={(e) => setRating(Number(e.target.value))}
              />

              <TextField
                select
                size="small"
                label="Category"
                value={category ?? ""}
                onChange={(e) => setCategory(e.target.value)}
                fullWidth
              >
                {categories.map((cat, ind) => (
                  <MenuItem key={ind} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>

<Box mt={4}>
  <Grid container spacing={2}>
    <Grid size={{xs:6}}>
      <Button
        fullWidth
        variant="contained"
        onClick={addOrder}
      >
        Add Order
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

        <Paper  sx={{ p: 2 , boxShadow:10}}>
            <Typography variant="h6" sx={{ p: 2 }}>
        All Orders
      </Typography>
        <TableContainer component={Paper} sx={{ mt: 2, p:2,boxShadow:"6" }}>
    
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Ordered By</TableCell>
            <TableCell>Ordered On</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Rating</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order, index) => (
            <TableRow key={order._id || index}>
              <TableCell>{order.product}</TableCell>
              <TableCell>{order.category}</TableCell>
              <TableCell>{order.customerId?.name || "N/A"}</TableCell>

              <TableCell>{order.orderedOn ? new Date(order.orderedOn).toLocaleDateString() : "-"}</TableCell>
              <TableCell>₹{order.price}</TableCell>
              <TableCell>{order.rating ?? "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
  </Container>
</>

  );
}

export default AddNewOrder;
