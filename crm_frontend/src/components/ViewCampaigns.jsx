import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Popover,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";

const ViewCampaigns = ({ campaigns }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMessages, setSelectedMessages] = useState([]);

  const handleRowClick = (event, campaign) => {
    setAnchorEl(event.currentTarget);
    setSelectedMessages(campaign.messagesUsed || []);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedMessages([]);
  };

  const open = Boolean(anchorEl);

  const Graph = ({ campaign }) => (
    <PieChart
      width={100}
      height={100}
      series={[
        {
          data: [
            { id: 0, value: campaign.sentCount, label: "Sent" },
            { id: 1, value: campaign.failedCount, label: "Failed" },
          ],
        },
      ]}
      colors={["#55AD9B", "#51829B"]}
    />
  );

  return (
    <Box mt={4}>
      {campaigns.length > 0 ? (
        <>
          <TableContainer component={Paper}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Campaign Objective</TableCell>
                  <TableCell>Created By</TableCell>
                  <TableCell>Sent Count</TableCell>
                  <TableCell>Audience size</TableCell>
                  <TableCell>Message Sent</TableCell>
                  <TableCell>Graph</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {campaigns.map((c, idx) => (
                  <TableRow
                    key={idx}
                    hover
                    onClick={(e) => handleRowClick(e, c)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        boxShadow: "0 0 5px #1976d2",
                      },
                    }}
                    >
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{c.campaignObjective}</TableCell>
                    <TableCell>{c.createdBy}</TableCell>
                    <TableCell>{c.sentCount}</TableCell>
                    <TableCell>{c.previewCount}</TableCell>
                    <TableCell>{c.messageSent}</TableCell>
                    <TableCell>
                      <Graph campaign={c} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Popover */}
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Box p={2} minWidth={300}>
              <Typography variant="h6">Messages Used</Typography>
              {selectedMessages.length > 0 ? (
                <List dense>
                  {selectedMessages.map((msg, idx) => (
                    <ListItem key={idx}>
                      <ListItemText primary={`• ${msg}`} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No messages found.
                </Typography>
              )}
            </Box>
          </Popover>
        </>
      ) : (
        <Typography>No campaigns found.</Typography>
      )}
    </Box>
  );
};

export default ViewCampaigns;
