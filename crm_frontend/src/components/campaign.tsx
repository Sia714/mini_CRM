//frontend campaign

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
import { BarChart } from "@mui/x-charts/BarChart";

const API_BASE = import.meta.env.VITE_API_BASE;

type Campaign = {
  segmentId: string;
  campaignObjective: string;
  createdBy: string;
  sentCount: number;
  failedCount: number;
  previewCount: number;
};

type segment={
    _id:string,
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

type GraphData = {
  sent: number;
  preview: number;
  failed: number;
};

function Campaign() {
const { segmentId: paramSegmentId } = useParams<{ segmentId?: string }>();

  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(
    paramSegmentId || null
  );
   const [selectedSegment, setSelectedSegment] = useState<segment | null>(null);
  const [segmentOptions, setSegmentOptions] = useState<segment[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [graphData, setGraphData] = useState<GraphData[]>([]);
  const [aiMessages, setAiMessages] = useState<string[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [campaignObjective,setCampaignObjective]=useState<string | null>(null);
  const navigate=useNavigate();
  const [loadingAI, setLoadingAI] = useState(false);
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
  const loadSegments = () => {
    fetch(`${API_BASE}/segment/getAllSegments`, { credentials: "include" })
      .then((res) => res.json())
      .then((details) => {
        setSegmentOptions(details.segments || []);
      })
      .catch((err) => console.error(err));
  };

  const loadSegmentData = (segmentId: string) => {
    fetch(`${API_BASE}/segment/${segmentId}`, { credentials: "include" })
      .then((res) => res.json())
      .then((details) => {
        setSelectedSegment(details.segment);
        setCampaigns(Array.isArray(details.campaigns) ? details.campaigns : []);
      })
      .catch((err) => console.error(err));
  };

  const prepareGraphData = () => {
    const tempData = campaigns.map((camp) => ({
      sent: camp.sentCount,
      preview: camp.previewCount,
      failed: camp.failedCount,
    }));
    setGraphData(tempData);
  };

  useEffect(() => {
    loadSegments();
  }, []);

  useEffect(() => {
    if (selectedSegmentId) {
      loadSegmentData(selectedSegmentId);
    }
  }, [selectedSegmentId]);

  useEffect(() => {
    prepareGraphData();
  }, [campaigns]);

  const fetchAISuggestions = async () => {
    setLoadingAI(true);
    try {
      const response = await fetch(`${API_BASE}/ai/chat`, {
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
    const prompt=JSON.stringify({
        segmentId: selectedSegmentId,
        createdBy: userData?.email,
        messagesUsed: aiMessages,
        campaignObjective: campaignObjective, // or use original objective if saved
        selectedMessage: selectedMessage,
      });
      console.log(prompt);
    fetch(`${API_BASE}/segment/${selectedSegmentId}/`, {
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

  const Graph = ({ ind }: { ind: number }) => (
    <BarChart
      colors={["red", "blue", "green"]}
      series={[
        {
          data: [
            graphData[ind]?.sent || 0,
            graphData[ind]?.failed || 0,
            graphData[ind]?.preview || 0,
          ],
        },
      ]}
      xAxis={[{ data: ["sent", "failed", "preview"] }]}
      height={100}
      width={250}
    />
  );

  return (
    <Box mt={4} sx={{ color: "white" }}>
      <Autocomplete
        options={segmentOptions}
        getOptionLabel={(option) => option.segmentName}
      onChange={(_, value) => {
  if (value) {
    setSelectedSegmentId(value._id);
    navigate(`/campaign/${value._id}`); // updates URL!
  }
}}
        renderInput={(params) => (
          <TextField {...params} label="Select Segment" variant="outlined" />
        )}
        sx={{ mb: 3, width: 300 }}
      />

      {selectedSegmentId && (
        
        <>
          <Typography variant="h5" gutterBottom>
            {selectedSegment?.segmentName}'s Campaigns
          </Typography>
          <Typography variant="h6">
           Created At: {selectedSegment?.createdAt.toLocaleString()} 
          </Typography>
           <Typography variant="h6">
           Latest Campaign: {campaigns[0]?.campaignObjective?? "N/A"} 
          </Typography>
          <Typography variant="h6">
  Conditions:{" "}
  {selectedSegment?.conditions?.length ? (
    selectedSegment.conditions.map((cond, index) => (
      <span key={index}>
        {cond.field} {cond.operator} {String(cond.value)}
        {index !== selectedSegment.conditions.length - 1 ? ", " : ""}
      </span>
    ))
  ) : (
    "N/A"
  )}
</Typography>

          <Box sx={{ display: "flex", gap: 2, mb: 2, mt: 1 }}>
            <Button variant="outlined" onClick={handleNewCampaign}>
              Add Campaign
            </Button>
          </Box>
          {campaignObjective?"Campaign Objective:"+ campaignObjective:" "}<br/>
          {loadingAI && <CircularProgress/>}
          {aiMessages.length > 0 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography variant="subtitle1">
                Select a Message Variant:
              </Typography>
              <Box display="flex" gap={2} flexWrap="wrap">
                {aiMessages.map((msg, idx) => (
                  <Card
                    key={idx}
                    variant="outlined"
                    sx={{
                      width: 300,
                      borderColor:
                        selectedMessage === msg ? "primary.main" : "grey.400",
                      backgroundColor:
                        selectedMessage === msg ? "primary.light" : "inherit",
                    }}
                  >
                    <CardActionArea onClick={() => setSelectedMessage(msg)}>
                      <CardContent>{msg}</CardContent>
                    </CardActionArea>
                  </Card>
                ))}
              </Box>

              <Button
                disabled={!selectedMessage}
                onClick={launchCampaign}
                variant="contained"
                color="primary"
              >
                Launch Campaign 🚀
              </Button>
            </Box>
          )}

          <Box mt={4}>
            {campaigns.length > 0 ? (
              <TableContainer component={Paper}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Campaign Objective</TableCell>
                      <TableCell>Created By</TableCell>
                      <TableCell>Failed Count</TableCell>
                      <TableCell>Preview Count</TableCell>
                      <TableCell>Sent Count</TableCell>
                      <TableCell>Graph</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {campaigns.map((c, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{c.campaignObjective}</TableCell>
                        <TableCell>{c.createdBy}</TableCell>
                        <TableCell>{c.failedCount}</TableCell>
                        <TableCell>{c.previewCount}</TableCell>
                        <TableCell>{c.sentCount}</TableCell>
                        <TableCell>
                          <Graph ind={idx} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>No campaigns found for this segment.</Typography>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}

export default Campaign;
