import React, { useState, useRef, useEffect } from "react";
import "../styles/segment.css"; 
import {
  Button,
  Box,
  Typography,
  Paper,
  TextField,
  IconButton,
} from "@mui/material";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import ClearIcon from "@mui/icons-material/Clear";
import {
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

function SegmentCampaign() {
  const API_BASE = import.meta.env.VITE_API_BASE;
  const navigate = useNavigate();

  const [userData, setUserData] = useState();
  const loadUserData = () => {
    fetch(`${API_BASE}/auth/me`, { credentials: "include" })
      .then((res) => res.json())
      .then((details) => {
        setUserData(details || []);
      })
      .catch((err) => console.error(err));
  };
  useEffect(() => {
    loadUserData();
  }, []);
  const [workspace, setWorkspace] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);

  const tableRef = useRef(null);
  const [previewCustomers, setPreviewCustomers] = useState([]);

  const boxes = {
    Field: [
      {
        id: "F1",
        label: "visits",
        type: "field",
        precededBy: ["logical"],
        followedBy: ["operator"],
      },
      {
        id: "F2",
        label: "totalSpent",
        type: "field",
        precededBy: ["logical"],
        followedBy: ["operator"],
      },
      {
        id: "F3",
        label: "lastVisited",
        type: "field",
        precededBy: ["logical"],
        followedBy: ["operator"],
      },
      {
        id: "F4",
        label: "totalOrders",
        type: "field",
        precededBy: ["logical"],
        followedBy: ["operator"],
      },
      {
        id: "F5",
        label: "lastRating",
        type: "field",
        precededBy: ["logical"],
        followedBy: ["operator"],
      },
      {
        id: "F6",
        label: "category",
        type: "field",
        precededBy: ["logical"],
        followedBy: ["operator"],
      },
      {
        id: "F7",
        label: "isActive",
        type: "field",
        precededBy: ["logical"],
        followedBy: ["operator"],
      },
    ],
    Operators: [
      {
        id: "O1",
        label: "<=",
        type: "operator",
        precededBy: ["field"],
        followedBy: ["value"],
      },
      {
        id: "O2",
        label: ">=",
        type: "operator",
        precededBy: ["field"],
        followedBy: ["value"],
      },
      {
        id: "O3",
        label: "<",
        type: "operator",
        precededBy: ["field"],
        followedBy: ["value"],
      },
      {
        id: "O4",
        label: ">",
        type: "operator",
        precededBy: ["field"],
        followedBy: ["value"],
      },
      {
        id: "O5",
        label: "=",
        type: "operator",
        precededBy: ["field"],
        followedBy: ["value", "category"],
      },
      {
        id: "O6",
        label: "!=",
        type: "operator",
        precededBy: ["field"],
        followedBy: ["value", "category"],
      },
    ],
    
    Logical: [
      {
        id: "L1",
        label: "AND",
        type: "logical",
        precededBy: ["value", "category"],
        followedBy: ["field"],
      },
      {
        id: "L2",
        label: "OR",
        type: "logical",
        precededBy: ["value", "category"],
        followedBy: ["field"],
      },
    ],

    Categories: [
      {
        id: "C1",
        label: "Electronics",
        type: "category",
        precededBy: ["operator"],
        followedBy: ["logical"],
      },
      {
        id: "C2",
        label: "Smartphones",
        type: "category",
        precededBy: ["operator"],
        followedBy: ["logical"],
      },
      {
        id: "C3",
        label: "Fashion",
        type: "category",
        precededBy: ["operator"],
        followedBy: ["logical"],
      },
      {
        id: "C4",
        label: "Home & Kitchen",
        type: "category",
        precededBy: ["operator"],
        followedBy: ["logical"],
      },
      {
        id: "C5",
        label: "Beauty & Personal Care",
        type: "category",
        precededBy: ["operator"],
        followedBy: ["logical"],
      },
      {
        id: "C6",
        label: "Sports & Outdoors",
        type: "category",
        precededBy: ["operator"],
        followedBy: ["logical"],
      },
      {
        id: "C7",
        label: "Books",
        type: "category",
        precededBy: ["operator"],
        followedBy: ["logical"],
      },
      {
        id: "C8",
        label: "Toys & Games",
        type: "category",
        precededBy: ["operator"],
        followedBy: ["logical"],
      },
      {
        id: "C9",
        label: "Grocery & Gourmet Food",
        type: "category",
        precededBy: ["operator"],
        followedBy: ["logical"],
      },
      {
        id: "C10",
        label: "Automotive",
        type: "category",
        precededBy: ["operator"],
        followedBy: ["logical"],
      },
    ],
    Values: [
      {
        id: "V1",
        label: "",
        type: "value",
        precededBy: ["operator"],
        followedBy: ["logical"],
      },
      {
        id: "V2",
        label: "30",
        type: "value",
        precededBy: ["operator"],
        followedBy: ["logical"],
      },
      {
        id: "V3",
        label: "50",
        type: "value",
        precededBy: ["operator"],
        followedBy: ["logical"],
      },
      {
        id: "V4",
        label: "90",
        type: "value",
        precededBy: ["operator"],
        followedBy: ["logical"],
      },
      {
        id: "V5",
        label: "10000",
        type: "value",
        precededBy: ["operator"],
        followedBy: ["logical"],
      },
      {
        id: "V6",
        label: "3",
        type: "value",
        precededBy: ["operator"],
        followedBy: ["logical"],
      },
      {
        id: "V7",
        label: "5",
        type: "value",
        precededBy: ["operator"],
        followedBy: ["logical"],
      },
      {
        id: "V8",
        label: "true",
        type: "value",
        precededBy: ["operator"],
        followedBy: ["logical"],
      },
      {
        id: "V9",
        label: "false",
        type: "value",
        precededBy: ["operator"],
        followedBy: ["logical"],
      },
    ],
  };
  const instructions = [
    "Drag and drop fields, operators, and logical connectors from the two side columns to the workspace in the middle.",
    "Rule must start with a condition, followed by AND/OR, then by another conditions, which can then be repeated",
    "Start the condition with a field, follow it by an operator, and then by matching criteria.",
    "Combine conditions using logical operators (AND, OR) — these must follow a condition, not at the start.",
    "Enter a custom value by dragging the empty value fields to the workspace and entering your desired number or text.",
    "Remove current item by double-clicking it in the workspace",
    "Erase entire contents of the workspace using 'X' icon.",
    "Click on “Preview Audience” to preview how many customers match your segment criteria.",
    "Click on “ADD Segment” to save your segment once the rules look good.",
    "Note:\nThe audience segmentation uses flat AND-OR logic without nested parentheses or any grouping. All conditions are evaluated left-to-right without operator precedence.",
  ];
  useEffect(() => {
  const hasSeenInstructions = localStorage.getItem("hasSeenInstructions");
  if (!hasSeenInstructions) {
    setShowInstructions(true);
    localStorage.setItem("hasSeenInstructions", "true");
  }
}, []);

  function parseWorkspace(workspace) {
    const result = [];
    const last = workspace[workspace.length - 1];
    if(!last){alert("Please enter some query");
      return;
    }
    if (last.type !== "value" && last.type !== "category") {
      alert("Invalid End");
      return;
    }
    for (let i = 0; i < workspace.length; i++) {
      const token = workspace[i];
      if (["AND", "OR"].includes(token.label.toString())) {
        result.push({ logic: token });
      } else if (
        ["<", "<=", ">", ">=", "=", "!="].includes(
          workspace[i + 1]?.label.toString()
        )
      ) {
        result.push({
          field: token,
          operator: workspace[i + 1],
          value: workspace[i + 2],
        });
        i += 2; // Skip next 2 tokens
      }
    }
    return result;
  }

  const handleDragStart = (item) => {
    setDraggedItem(item);
  };

  const handleDrop = () => {
    if (draggedItem) {
      if (workspace.length > 12) {
        alert("Too many queries. please simplify");
        return;
      }
      const lastItem = workspace[workspace.length - 1];
      const secondLastItem = workspace[workspace.length - 2];
      const validSuccessor = lastItem?.followedBy?.includes(
        draggedItem.type.toLowerCase()
      );
      const validPredecessor = draggedItem.precededBy?.includes(lastItem?.type);

      if (!lastItem && draggedItem.type != "field") {
        alert("Invalid start");
        return;
      }
      if (lastItem) {
        const isBoolField = ["isActive", "category"].includes(
          lastItem.label.toString()
        );
        const isEqualityOperator = ["=", "!="].includes(
          draggedItem.label.toString()
        );
        if (isBoolField && !isEqualityOperator) {
          alert("Field expects a Boolean");
          return;
        }
        if (
          draggedItem.type === "category" &&
          secondLastItem?.label !== "category"
        ) {
          alert("can only be assignned category");
          return;
        } else if (
          secondLastItem?.label === "isActive" &&
          draggedItem.label !== "true" &&
          draggedItem.label !== "false"
        ) {
          alert("isActive can be Boolean only");
          return;
        } else if (
          secondLastItem?.label === "category" &&
          draggedItem.type !== "category"
        ) {
          alert("Category can be a category only");
          return;
        } else if (!validPredecessor) {
          alert(
            `"${draggedItem.label}" must follow a ${draggedItem.precededBy?.join(" or ")}`
          );
          return;
        } else if (!validSuccessor) {
          alert(
            `"${lastItem.label}" must preceed a ${lastItem.followedBy?.join(" or ")}`
          );
          return;
        }
      }

      setWorkspace((prev) => [...prev, draggedItem]);
      setDraggedItem(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const removeItem = (index) => {
    if (index != workspace.length - 1) {
      alert("can't remove middle Items");
      return;
    }
    let tempSpace = [...workspace];
    tempSpace.pop();
    setWorkspace(tempSpace);
  };
  const handleValueChange = (index, newValue) => {
    if (
      (newValue == "true" || newValue == "true") &&
      workspace[index - 2].label != "=" &&
      workspace[index - 2].label != "!=" &&
      workspace[index - 2].label != "isActive"
    ) {
      alert("can't assign Boolean to this field");
      return;
    }
    setWorkspace((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, label: newValue } : item
      )
    );
  };
  const clearWorkspace = () => {
    setWorkspace([]);
  };
  const previewSegment = () => {

    const payload = parseWorkspace(workspace);
    
    try {
      let querySeg = payload.map((rule) => {
        if (rule.logic) {
          return { logic: rule.logic?.label };
        }
        return {
          field: rule.field?.label,
          operator: rule.operator?.label,
          value:
            typeof rule.value === "object"
              ? rule.value.input || rule.value.label || rule.value.value
              : rule.value,
        };
      });

      const queryStr = encodeURIComponent(JSON.stringify(querySeg));
      fetch(`${API_BASE}/segment/preview?rules=${queryStr}`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          setPreviewCustomers(data.customers || []);
          setTimeout(() => {
            if (tableRef.current) {
              tableRef.current.scrollIntoView({ behavior: "smooth" });
            }
          }, 200);
        })
        .catch((err)=>{console.error(err)});
    } catch (e) {
      console.error(e);
    }
  };

  const addSegment = () => {
    const payload = parseWorkspace(workspace);
    if (!payload) {
      return;
    }

    const segName = prompt("Please enter a segment Name");
    if(!segName){return;}
    try {
      const querySeg = payload?.map((rule) => {
        if (rule.logic) return { logic: rule.logic.label };
        return {
          field: rule.field.label,
          operator: rule.operator.label,
          value:
            typeof rule.value === "object"
              ? rule.value.input || rule.value.label || rule.value.value
              : rule.value,
        };
      });
      fetch(`${API_BASE}/segment/`, {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: segName,
          createdBy: userData?.emails?.[0]?.value,
          rules: querySeg,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          alert("Segment Added successfully");
          navigate(`/campaign/${data.id}`);

          setPreviewCustomers([]);
          setWorkspace([]);
        })
        .catch((err) => console.error(err));
    } catch (e) {
      console.error(e);
    }
  };

  const primaryBoxNames = ["Logical", "Operators", "Field"];

  const primaryBoxes = Object.entries(boxes).filter(([name]) =>
    primaryBoxNames.includes(name)
  );

  const otherBoxes = Object.entries(boxes).filter(
    ([name]) => !primaryBoxNames.includes(name)
  );

  return (
    <>
      <Dialog open={showInstructions}>
        <DialogTitle>📘 How it Works?</DialogTitle>
        <DialogContent>
          <List>
            {instructions.map((ins) => (
              <ListItem>
                <ListItemText>▶ {ins}</ListItemText>
              </ListItem>
            ))}
          </List>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setShowInstructions(false);
            }}
            variant="contained"
          >
            I Understand
          </Button>
        </DialogActions>
      </Dialog>
 <Typography variant="h5" color="white">Create a Segment Query</Typography>
<Typography variant="text" >Click on<IconButton onClick={() => setShowInstructions(true)}>
              <InfoOutlineIcon />
            </IconButton> to view the instructions</Typography>
            <br/>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        
         <Typography variant="h6" color="white">Example Query:</Typography> <img src="/assets/example.png" height={40}/>
        <Box className="floating-buttons">
        <Button variant="contained" onClick={previewSegment} >
          Preview Audience
        </Button>

        <Button variant="contained" onClick={addSegment}>
          ADD Segment
        </Button>
        <Button variant="contained" onClick={() => navigate("/view-segment")}>
          View Segments
        </Button>
        </Box>
      </Box>

      <Box className="container">
        <Box className="boxes">
          {primaryBoxes.map(([boxName, items]) => (
            <Paper key={boxName} className="box" elevation={3}>
              <Typography variant="h6">{boxName}</Typography>
              {items.map((item) => (
                <Box
                  key={item.id}
                  className="draggable-item"
                  draggable
                  onDragStart={() => handleDragStart(item)}
                >
                  {item.label}
                </Box>
              ))}
            </Paper>
          ))}
        </Box>

        <Box
          className="workspace"
          sx={{ position: "relative" }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Box
            sx={{
              position: "absolute",
              top: 15,
              right: 10,
              zIndex: 10,
            }}
          >
            
            <IconButton onClick={() => clearWorkspace()}>
              <ClearIcon /> <br/>
              <Typography variant="subtitle1">Clear</Typography>
            </IconButton>
          </Box>
          <Typography variant="h5" color="white" mb={2}>
            Workspace
          </Typography>
          <Typography variant="subtitle2" color="rgb(12,12,250,0.5)" mb={2}>
            (Drag and Drop the Items here)
          </Typography>

          <Box className="dropped-items">
            {workspace.map((item, idx) => (
              <Box
                key={item.id}
                onDoubleClick={() => removeItem(idx)}
                className="draggable-box"
              >
                {item.type === "value" && item.label === "" ? (
                  <TextField
                    type="number"
                    onBlur={(e) => handleValueChange(idx, e.target.value)}
                    placeholder="Enter value"
                    size="small"
                    className="input-box"
                  />
                ) : (
                  <span className="workspace-item">{item.label}</span>
                )}
              </Box>
            ))}
          </Box>
        </Box>

        <Box className="boxes">
          {otherBoxes.map(([boxName, items]) => (
            <Paper key={boxName} className="box" elevation={3}>
              <Typography variant="h6">{boxName}</Typography>
              {items.map((item) => (
                <Box
                  key={item.id}
                  className="draggable-item"
                  draggable
                  onDragStart={() => handleDragStart(item)}
                >
                  {item.label}
                </Box>
              ))}
            </Paper>
          ))}
        </Box>
      </Box>

      <Box mt={4} ref={tableRef} className="table">
        <Typography variant="h5" gutterBottom color="white">
          Preview Customers
        </Typography>
        <Typography variant="h6" color="white">
          Audience size: {previewCustomers.length ?? "0"}
        </Typography>
        {previewCustomers.length > 0 ? (
          <TableContainer component={Paper}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Last Active</TableCell>
                  <TableCell>Total Spent</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {previewCustomers.map((c, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>{c.mobile || "-"}</TableCell>
                    <TableCell>
                      {c.lastVisited
                        ? new Date(c.lastVisited).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      ₹{c.totalSpent?.toLocaleString() || "0"}
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
    </>
  );
}

export default SegmentCampaign;
