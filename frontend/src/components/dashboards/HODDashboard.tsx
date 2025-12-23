// frontend/src/pages/HODDashboard.tsx
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";

const API_URL = import.meta.env.VITE_API_URL + "/papers";

const HODDashboard = () => {
  const { user, token } = useAuth();
  const [papers, setPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !token) return;
    const fetchPapers = async () => {
      try {
        const res = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
        setPapers(res.data.filter((p: any) => p.status === "pending_approval"));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPapers();
  }, [user, token]);

  const approvePaper = async (id: string) => {
    try {
      await axios.patch(`${API_URL}/${id}/approve/hod`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setPapers(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to approve paper");
    }
  };

  const printPaper = async (id: string) => {
    try {
      await axios.patch(`${API_URL}/${id}/print`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setPapers(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to mark as printed");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">HOD Dashboard</h1>
        {loading ? <p>Loading...</p> : papers.length === 0 ? <p>No papers pending approval</p> :
          <div className="grid gap-4">
            {papers.map(p => (
              <Card key={p._id}>
                <CardHeader><CardTitle>{p.courseName}</CardTitle></CardHeader>
                <CardContent className="flex justify-between items-center">
                  <StatusBadge status={p.status}/>
                  <div className="flex gap-2">
                    <Button onClick={() => approvePaper(p._id)}>Approve</Button>
                    <Button onClick={() => printPaper(p._id)}>Mark as Printed</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        }
      </div>
    </DashboardLayout>
  );
};

export default HODDashboard;
