import { useAuth } from '@/contexts/AuthContext';
import { getPapersByLecturer } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Send, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const LecturerDashboard = () => {
  const { user } = useAuth();
  const papers = user ? getPapersByLecturer(user.id) : [];

  const stats = {
    total: papers.length,
    draft: papers.filter(p => p.status === 'draft').length,
    pending: papers.filter(p => p.status === 'pending_moderation').length,
    revisionRequired: papers.filter(p => p.status === 'revision_required').length,
    approved: papers.filter(p => p.status === 'approved' || p.status === 'printed').length,
  };

  const recentPapers = papers.slice(-5).reverse();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.fullName}</h1>
          <p className="text-muted-foreground mt-1">Manage your examination papers</p>
        </div>
        <Link to="/dashboard/create-paper">
          <Button className="bg-gradient-primary hover:opacity-90">
            <FileText className="w-4 h-4 mr-2" />
            Create New Paper
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Papers</CardTitle>
            <FileText className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
            <Clock className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-destructive">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Needs Revision</CardTitle>
            <AlertCircle className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.revisionRequired}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
            <CheckCircle className="h-5 w-5 text-success" />
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
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No papers yet. Create your first examination paper!</p>
              <Link to="/dashboard/create-paper">
                <Button variant="link" className="mt-2">Create Paper</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPapers.map((paper) => (
                <Link
                  key={paper.id}
                  to={`/dashboard/papers/${paper.id}`}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{paper.courseCode} - {paper.courseName}</p>
                      <p className="text-sm text-muted-foreground">
                        {paper.year} • {paper.semester}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={paper.status} />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'draft':
        return 'bg-muted text-muted-foreground';
      case 'pending_moderation':
        return 'bg-warning/10 text-warning';
      case 'moderated':
        return 'bg-info/10 text-info';
      case 'revision_required':
        return 'bg-destructive/10 text-destructive';
      case 'pending_approval':
        return 'bg-warning/10 text-warning';
      case 'approved':
        return 'bg-success/10 text-success';
      case 'printed':
        return 'bg-success/10 text-success';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'draft':
        return 'Draft';
      case 'pending_moderation':
        return 'Pending Review';
      case 'moderated':
        return 'Moderated';
      case 'revision_required':
        return 'Revision Required';
      case 'pending_approval':
        return 'Pending Approval';
      case 'approved':
        return 'Approved';
      case 'printed':
        return 'Printed';
      default:
        return status;
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles()}`}>
      {getStatusLabel()}
    </span>
  );
};

export default LecturerDashboard;
