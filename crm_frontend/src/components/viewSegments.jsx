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
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function ViewSegments() {
  const API_BASE = import.meta.env.VITE_API_BASE;
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const loadSegments = () => {
    try {
      fetch(`${API_BASE}/segment/getAllSegments`, { credentials: "include" })
        .then((res) => res.json())
        .then((details) => {
          setSegments(details.segments || []);
        })
        .catch((err) => console.error(err));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSegments();
  }, []);

  return (
    <Box mt={4} className="table">
      <Typography variant="h5" gutterBottom color="white">
        Segments
      </Typography>
      {loading && <CircularProgress />}
      {segments.length > 0 ? (
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
              {segments.map((s, idx) => (
                <TableRow
                  key={idx}
                  onClick={() => navigate(`/campaign/${s._id}`)}
                >
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{s.segmentName}</TableCell>
                  <TableCell>{s.createdBy}</TableCell>
                  <TableCell>{s.previewCount || "-"}</TableCell>
                  <TableCell>
                    {s.createdAt
                      ? new Date(s.createdAt).toLocaleDateString()
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="h6" color="white">
          No Data to Display
        </Typography>
      )}
    </Box>
  );
}
export default ViewSegments;
