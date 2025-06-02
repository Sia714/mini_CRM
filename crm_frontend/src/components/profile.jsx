import {
  Avatar,
  Box,
  Paper,
  Tab,
  Tabs,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import ViewCampaigns from "./ViewCampaigns"; // adjust path if needed

const Profile = () => {
  const API_BASE = import.meta.env.VITE_API_BASE;
  const [tab, setTab] =  useState("campaigns");
  const [req, setReq] =  useState({});

  const [segments, setSegments] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);

  const handleTabChange = (_, newValue) => {
    setTab(newValue);
  };

 useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/user/activity`, {
        credentials: "include",
      });
      const data = await res.json();
      console.log(data);
      setReq(data);
      setUser(data.user);
      setSegments(data.segments);
      setCampaigns(data.campaigns);
    } catch (err) {
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);




  return (
   <>
      {/* User Info */}
       {loading ? <CircularProgress />:

      ( <Box p={3}>
      <Box display="flex" alignItems="center" mb={4}>
        <Avatar
          src={user?.photos?.[0]?.value || "/profile-placeholder.png"}
          alt={user?.displayName}
          sx={{ width: 80, height: 80, mr: 3 }}
        />
        <Box>
          <Typography variant="h5">{user?.displayName} </Typography>
          <Typography variant="body1">{user?.emails?.[0]?.value ?? "No email found"}</Typography>
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab value="campaigns" label="Your Campaigns" />
        <Tab value="segments" label="Your Segments" />
      </Tabs>
     
      {/* Content */}
      {tab === "campaigns" ? (
        <ViewCampaigns campaigns={campaigns} />
      ) : (
        <Box>
          {segments.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
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
                    <TableRow key={s._id}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{s.segmentName}</TableCell>
                      <TableCell>{s.createdBy}</TableCell>
                      <TableCell>{s.previewCount ?? "-"}</TableCell>
                      <TableCell>
                        {new Date(s.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No Segments Found</Typography>
          )}
        </Box>
      )}
    </Box>)
}
    </>
  );
};

export default Profile;
