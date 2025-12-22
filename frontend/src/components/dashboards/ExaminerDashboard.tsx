import { useAuth } from '@/contexts/AuthContext';
import { getPapersByExaminer } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, CheckCircle, Clock, FileCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const ExaminerDashboard = () => {
  const { user } = useAuth();
  const papers = user ? getPapersByExaminer(user.id, user.department) : [];

  const pendingReview = papers.filter(p => p.status === 'pending_moderation');
  const moderated = papers.filter(p => p.examinerId === user?.id && p.status !== 'pending_moderation');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.fullName}</h1>
        <p className="text-muted-foreground mt-1">Review and moderate examination papers</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-warning">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
            <Clock className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingReview.length}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-examiner">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Moderated by Me</CardTitle>
            <FileCheck className="h-5 w-5 text-examiner" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{moderated.length}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Department Papers</CardTitle>
            <FileText className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{papers.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Review */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-warning" />
            Papers Awaiting Your Review
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingReview.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No papers pending review. Great job!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingReview.map((paper) => (
                <Link
                  key={paper.id}
                  to={`/dashboard/review/${paper.id}`}
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

export default ExaminerDashboard;
