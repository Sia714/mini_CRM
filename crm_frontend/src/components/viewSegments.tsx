import React, { useState,useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Container,
  Paper,
  Autocomplete, CircularProgress,
   Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText
} from "@mui/material";

function ViewSegments() {
  const API_BASE = import.meta.env.VITE_API_BASE;
type segment={
     segmentName: string,
    createdBy: string,
    conditions: [
      {
        field: string,
        operator: String,
        value: boolean|number|string, // Boolean, String, Number, etc.
      },
    ],
    previewCount: number,
    createdAt:Date,

}
  const [segments, setSegments] = useState<segment[]>([]);
const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  type user={
    name:String,
    email:String,
    photo: URL,
  }
    const [userData,setUserData]=useState<user>();
     const loadUserData=()=>{
        fetch(`${API_BASE}/me`, { credentials: 'include',})
            .then(res=>res.json())
            .then(details=>{
                setUserData(details||[]);
            })
             .catch((err) => console.error(err));
      }
       useEffect(()=>{
        loadUserData();
        
      },[])
 const loadSegments = () => {
    fetch(`${API_BASE}/segment/`, { credentials: "include" })
      .then((res) => res.json())
      .then((details) => {
        setSegments(details.segments || []);
      })
      .catch((err) => console.error(err));
  };

 useEffect(() => {
  
     loadSegments();

}, []);

  return (
    
    <Box mt={4} className="table">
    <Typography variant="h5" gutterBottom color="white">
          Segments
        </Typography>
        
    {segments.length > 0 ?(
      
      <TableContainer component={Paper}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Preview Count</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {segments.map((s: segment, idx) => (
              <TableRow key={idx}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{s.segmentName}</TableCell>
                <TableCell>{s.createdBy}</TableCell>
                <TableCell>{s.previewCount || "-"}</TableCell>
                <TableCell>{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    ):( <Typography variant="h6" color="white">
        No Data to Display
      </Typography>)}
  </Box>
  )};
export default ViewSegments;