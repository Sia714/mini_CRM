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
} from "@mui/material";

function AddNewOrder() {
  //product: { type: String },
  //   customerId: { type: ObjectId, ref: "Customer" },
  //   orderedOn: Date,
  //   price: Number,
  //   rating: Number,
  //   category: String,
  const API_BASE = import.meta.env.VITE_API_BASE;

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
  const [errors, setErrors] = useState({});

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
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
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
            InputLabelProps={{
              shrink: true, // keeps label visible when date is picked
            }}
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
            variant="outlined"
          >
            {categories.map((cat, ind) => (
              <MenuItem key={ind} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>

          <Button variant="contained" onClick={addOrder}>
            Add Order
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default AddNewOrder;
