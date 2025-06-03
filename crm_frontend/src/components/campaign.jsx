//frontend campaign

import react, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  Autocomplete,
  TextField,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
} from "@mui/material";
import ViewCampaigns from "./ViewCampaigns";

const API_BASE = import.meta.env.VITE_API_BASE;

function Campaign() {
  const { segmentId } = useParams();

  const [selectedSegmentId, setSelectedSegmentId] = useState(segmentId);
  const [selectedSegment, setSelectedSegment] = useState();
  const [segmentOptions, setSegmentOptions] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [aiMessages, setAiMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState("");
  const [campaignObjective, setCampaignObjective] = useState("");
  const navigate = useNavigate();
  const [loadingAI, setLoadingAI] = useState(false);

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
  const loadSegments = () => {
    fetch(`${API_BASE}/segment/getAllSegments`, { credentials: "include" })
      .then((res) => res.json())
      .then((details) => {
        setSegmentOptions(details.segments || []);
      })
      .catch((err) => console.error(err));
  };

  const loadSegmentData = (segmentId) => {
    fetch(`${API_BASE}/segment/${segmentId}`, { credentials: "include" })
      .then((res) => res.json())
      .then((details) => {
        setSelectedSegment(details.segment);
        setCampaigns(Array.isArray(details.campaigns) ? details.campaigns : []);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadSegments();
  }, []);

  useEffect(() => {
    if (selectedSegmentId) {
      loadSegmentData(selectedSegmentId);
    }
  }, [selectedSegmentId]);

  const fetchAISuggestions = async () => {
    setLoadingAI(true);
    try {
      const response = await fetch(`${API_BASE}/ai/chat`, {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conditions: selectedSegment?.conditions }),
      });
      const data = await response.json();
      setAiMessages(data.replies);
    } catch (err) {
      console.error("AI fetch failed:", err);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleNewCampaign = async () => {
    const campaignObj = prompt("Enter the Campaign's Objective");
    setCampaignObjective(campaignObj);
    if (!campaignObj || !selectedSegmentId) return;
    setSelectedMessage(null); // Reset previous selection
    await fetchAISuggestions();
  };

  const launchCampaign = () => {
    if (!selectedSegmentId || !selectedMessage) return;
    const prompt = JSON.stringify({
      conditions: selectedSegment?.conditions,
      segmentId: selectedSegmentId,
      createdBy: userData?.emails[0]?.value,
      messagesUsed: aiMessages,
      campaignObjective: campaignObjective, // or use original objective if saved
      selectedMessage: selectedMessage,
    });
    console.log(prompt);
    fetch(`${API_BASE}/segment/${selectedSegmentId}/addCampaign`, {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: prompt,
    })
      .then((res) => res.json())
      .then(() => {
        alert("Campaign added successfully");
        loadSegmentData(selectedSegmentId);
        setAiMessages([]);
        setSelectedMessage(null);
        setCampaignObjective(null);
      })
      .catch((err) => console.error(err));
  };
const formatDate = (dateString) =>
  dateString ? new Date(dateString).toLocaleDateString() : "-";
  return (
   <Box
  mt={4}
  sx={{
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  }}
>
  <Paper
    elevation={6}
    sx={{
      p: 4,
      background: "rgba(255, 255, 255, 0.05)",
      backdropFilter: "blur(10px)",
      borderRadius: 4,
      width: "90%",
      maxWidth: 800,
      boxShadow: "0 0 20px rgba(0, 255, 255, 0.2)",
    }}
  >
    <Typography
      variant="h4"
      gutterBottom
      sx={{
        color: "#02463e",
        fontWeight: 600,
        textShadow: "0 0 8px rgba(21, 154, 148, 0.6)",
      }}
    >
      🎯 Choose Your Segment
    </Typography>

    <Autocomplete
      options={segmentOptions}
      getOptionLabel={(option) => option.segmentName}
      onChange={(_, value) => {
        if (value) {
          setSelectedSegmentId(value._id);
          navigate(`/campaign/${value._id}`);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select Segment"
          variant="outlined"
          sx={{
            input: { color: "white" },
            label: { color: "#ccc" },
            ".MuiOutlinedInput-root": {
              backgroundColor: "rgba(255,255,255,0.1)",
              "& fieldset": {
                borderColor: "#00FFE0",
              },
              "&:hover fieldset": {
                borderColor: "#1976d2",
              },
            },
          }}
        />
      )}
      sx={{ width: "100%", maxWidth: 400, mt: 2 }}
    />
  </Paper>

  {selectedSegmentId && (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        background: "rgba(255, 255, 255, 0.07)",
        backdropFilter: "blur(10px)",
        borderRadius: 4,
        width: "90%",
        maxWidth: 1000,
        color: "#AAA",
      }}
    >
      <Typography variant="h5" sx={{ color: "#02463e", mb: 2 }}>
        📋 {selectedSegment?.segmentName}'s Campaign Dashboard
      </Typography>
      <Typography>🗓️ Created: {formatDate(selectedSegment?.createdAt)}</Typography>
      <Typography>
        🚀 Latest Campaign: {campaigns[0]?.campaignObjective ?? "N/A"}
      </Typography>
      <Typography>
        ⚙️ Conditions:{" "}
        {selectedSegment?.conditions?.length
          ? selectedSegment.conditions.map((cond, index) => (
              <span key={index}>
                {cond.field} {cond.operator} {String(cond.value)}
                {index !== selectedSegment.conditions.length - 1 ? ", " : ""}
              </span>
            ))
          : "N/A"}
      </Typography>

      <Box sx={{ mt: 3 }}>
        <Button
          variant="outlined"
          color="primary"
          sx={{
            
            "&:hover": {
              backgroundColor: "#00ffe033",
              borderColor: "#00FFE0",
            },
          }}
          onClick={handleNewCampaign}
        >
          ➕ Add Campaign
        </Button>
      </Box>
    </Paper>
  )}

  {campaignObjective && (
    <Typography sx={{ color: "#ccc", mt: 2 }}>
      ✍️ Objective: {campaignObjective}
    </Typography>
  )}

  {loadingAI && (
    <Box sx={{ mt: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography sx={{ color: "#aaa" }}>🤖 Generating AI Messages...</Typography>
      <CircularProgress color="info" sx={{ mt: 1 }} />
    </Box>
  )}

  {aiMessages.length > 0 && (
    <Box
      sx={{
        mt: 4,
        width: "90%",
        maxWidth: 1000,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h6" sx={{ color: "#00FFE0" }}>
        💡 Choose an AI Message
      </Typography>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        {aiMessages.map((msg, idx) => (
          <Card
            key={idx}
            variant="outlined"
            sx={{
              width: 280,
              p: 1,
              borderColor: selectedMessage === msg ? "#00FFE0" : "#444",
              backgroundColor:
                selectedMessage === msg ? "rgba(0,255,255,0.1)" : "rgba(255,255,255,0.03)",
              cursor: "pointer",
              "&:hover": {
                borderColor: "#00FFE0",
              },
            }}
          >
            <CardActionArea onClick={() => setSelectedMessage(msg)}>
              <CardContent>
                <Typography variant="body2" color="#ddd">
                  {msg}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
      <Button
        disabled={!selectedMessage}
        onClick={launchCampaign}
        variant="contained"
        color="primary"
        sx={{
          mt: 2,
        
          
          "&:hover": {
            backgroundColor: "#00cfcf",
          },
        }}
      >
        Launch Campaign 🚀
      </Button>
    </Box>
  )}

  {selectedSegmentId && <ViewCampaigns campaigns={campaigns} />}
</Box>

);}

export default Campaign;
