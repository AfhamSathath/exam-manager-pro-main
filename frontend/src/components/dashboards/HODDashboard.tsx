import { useAuth } from '@/contexts/AuthContext';
import { getPapersForHOD } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, CheckCircle, Clock, Printer, Archive } from 'lucide-react';
import { Link } from 'react-router-dom';

const HODDashboard = () => {
  const { user } = useAuth();
  const papers = user ? getPapersForHOD(user.department) : [];

  const pendingApproval = papers.filter(p => p.status === 'pending_approval');
  const approved = papers.filter(p => p.status === 'approved');
  const printed = papers.filter(p => p.status === 'printed');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.fullName}</h1>
        <p className="text-muted-foreground mt-1">Approve and manage department examination papers</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-warning">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approval</CardTitle>
            <Clock className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingApproval.length}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
            <CheckCircle className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{approved.length}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-hod">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sent to Print</CardTitle>
            <Printer className="h-5 w-5 text-hod" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{printed.length}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total in Repository</CardTitle>
            <Archive className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{approved.length + printed.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approval */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-warning" />
            Papers Awaiting Your Approval
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingApproval.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No papers pending approval.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingApproval.map((paper) => (
                <Link
                  key={paper.id}
                  to={`/dashboard/approval/${paper.id}`}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-warning" />
                    </div>
                    <div>
                      <p className="font-medium">{paper.courseCode} - {paper.courseName}</p>
                      <p className="text-sm text-muted-foreground">
                        {paper.year} • {paper.semester} • By {paper.lecturerName}
                      </p>
                      <div className="flex gap-2 mt-1">
                        {paper.signatures.map((sig, idx) => (
                          <span key={idx} className="text-xs bg-muted px-2 py-0.5 rounded">
                            {sig.role === 'lecturer' ? '✓ Lecturer' : '✓ Examiner'}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">
                    Review Now
                  </span>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HODDashboard;
