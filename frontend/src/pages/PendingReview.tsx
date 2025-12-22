import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { getPapersByExaminer } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from '@/components/StatusBadge';

const PendingReview = () => {
  const { user } = useAuth();
  const allPapers = user ? getPapersByExaminer(user.id, user.department) : [];
  const pendingPapers = allPapers.filter(p => p.status === 'pending_moderation');

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pending Review</h1>
          <p className="text-muted-foreground mt-1">Papers awaiting your moderation</p>
        </div>

        {pendingPapers.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-success/50" />
              <h3 className="text-lg font-medium mb-2">All caught up!</h3>
              <p className="text-muted-foreground">No papers pending review at the moment</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {pendingPapers.map((paper) => (
              <Link key={paper.id} to={`/dashboard/review/${paper.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-warning" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {paper.courseCode} - {paper.courseName}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {paper.year} • {paper.semester} • {paper.paperType === 'exam' ? 'Examination' : 'Assessment'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Submitted by {paper.lecturerName}
                          </p>
                          <div className="mt-3">
                            <StatusBadge status={paper.status} />
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(paper.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PendingReview;
