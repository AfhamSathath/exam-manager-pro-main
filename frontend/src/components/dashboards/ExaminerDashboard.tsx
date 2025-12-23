// frontend/src/pages/ExaminerDashboard.tsx
import { useEffect, useState } from "react";
// Remove DashboardLayout import if it's already wrapping the <Outlet /> in your router
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";

const API_URL = import.meta.env.VITE_API_URL + "/papers";

const ExaminerDashboard = () => {
  const { user, token } = useAuth();
  const [papers, setPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (!user || !token) return;
    const fetchPapers = async () => {
      try {
        const res = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
        // Ensure status matches your backend enum (e.g., "pending_moderation")
        setPapers(res.data.filter((p: any) => p.status === "pending_moderation"));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPapers();
  }, [user, token]);

  const requestRevision = async (id: string) => {
    try {
      await axios.patch(`${API_URL}/${id}/revision`, { comment: comments[id] }, { headers: { Authorization: `Bearer ${token}` } });
      setPapers(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to request revision");
    }
  };

  const approvePaper = async (id: string) => {
    try {
      await axios.patch(`${API_URL}/${id}/approve/examiner`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setPapers(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to approve paper");
    }
  };

  // REMOVE the <DashboardLayout> tags here to fix the double sidebar
  return (
    <div className="p-6 space-y-6"> 
      <h1 className="text-2xl font-bold text-slate-800">Examiner Dashboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : papers.length === 0 ? (
        <p className="text-muted-foreground">No papers pending moderation</p>
      ) : (
        <div className="grid gap-4">
          {papers.map(p => (
            <Card key={p._id} className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">{p.courseName}</CardTitle>
                <div className="mt-1">
                  <StatusBadge status={p.status}/>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input 
                  placeholder="Add suggestion/comment" 
                  value={comments[p._id] || ""} 
                  onChange={e => setComments({...comments, [p._id]: e.target.value})}
                />
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => requestRevision(p._id)}>
                    Request Revision
                  </Button>
                  <Button className="bg-slate-900" onClick={() => approvePaper(p._id)}>
                    Approve
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExaminerDashboard;