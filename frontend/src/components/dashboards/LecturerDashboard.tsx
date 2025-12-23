// frontend/src/components/dashboards/LecturerDashboard.tsx
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { Year, Semester } from "@/types";

const API_URL = "http://localhost:5001/api/papers";

interface Paper {
  lecturerId: string;
  _id: string;
  courseName: string;
  year: Year;
  semester: Semester;
  status: string;
  createdAt: string;
}

const LecturerDashboard = () => {
  const { user, token } = useAuth();
  const location = useLocation();

  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshFlag, setRefreshFlag] = useState(false);

  // Refresh dashboard after navigation
  useEffect(() => {
    if (location.state?.refresh) {
      setRefreshFlag((prev) => !prev);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Fetch papers from API
  useEffect(() => {
    if (!user || !token) return;

    const fetchPapers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const lecturerPapers = res.data.filter(
          (p: Paper) => String(p.lecturerId) === String(user.id)
        );
        lecturerPapers.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setPapers(lecturerPapers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, [user, token, refreshFlag]);

  // Define status categories
  const pendingStatuses = ["draft", "revision_required"]; // waiting for lecturer action
  const inProgressStatuses = ["pending_moderation", "pending_approval"]; // submitted, waiting for approval
  const approvedStatuses = ["approved", "printed"]; // fully approved

  // Stats
  const stats = {
    total: papers.length,
    pending: papers.filter((p) => pendingStatuses.includes(p.status)).length,
    inProgress: papers.filter((p) => inProgressStatuses.includes(p.status)).length,
    approved: papers.filter((p) => approvedStatuses.includes(p.status)).length,
  };

  const recentPapers = papers.slice(0, 5);

  // Submit paper: moves from draft/revision_required → pending_moderation
  const handleSubmit = async (paperId: string) => {
    try {
      await axios.patch(
        `${API_URL}/${paperId}/submit`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Optimistically update the paper status in UI
      setPapers((prev) =>
        prev.map((p) =>
          p._id === paperId ? { ...p, status: "pending_moderation" } : p
        )
      );
    } catch (err) {
      console.error("Failed to submit paper", err);
    }
  };

  if (loading)
    return (
      <div className="text-center py-10 text-muted-foreground">
        Loading dashboard...
      </div>
    );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.fullName}</h1>
          <p className="text-muted-foreground mt-1">Manage your examination papers</p>
        </div>
        <Link to="/dashboard/create-paper">
          <Button>
            <FileText className="w-4 h-4 mr-2" /> Create Paper
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Papers</CardTitle>
            <FileText className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm text-muted-foreground">Pending</CardTitle>
            <Clock className="w-5 h-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm text-muted-foreground">In Progress</CardTitle>
            <AlertCircle className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.inProgress}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-sm text-muted-foreground">Approved</CardTitle>
            <CheckCircle className="w-5 h-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.approved}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Papers */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Papers</CardTitle>
        </CardHeader>
        <CardContent>
          {recentPapers.length === 0 ? (
            <p className="text-muted-foreground text-center py-6">
              No papers created yet
            </p>
          ) : (
            recentPapers.map((paper) => (
              <div
                key={paper._id}
                className="flex justify-between items-center p-4 border rounded-lg hover:bg-muted/40 transition"
              >
                <div>
                  <p className="font-medium">{paper.courseName}</p>
                  <p className="text-sm text-muted-foreground">
                    {paper.year} • {paper.semester}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {pendingStatuses.includes(paper.status) && (
                    <Button size="sm" onClick={() => handleSubmit(paper._id)}>
                      Submit
                    </Button>
                  )}
                  <StatusBadge status={paper.status} />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LecturerDashboard;
