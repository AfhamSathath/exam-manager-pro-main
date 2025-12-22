import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { getPapersForHOD } from '@/lib/storage';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from '@/components/StatusBadge';

const PendingApproval = () => {
  const { user } = useAuth();
  const allPapers = user ? getPapersForHOD(user.department) : [];
  const pendingPapers = allPapers.filter(p => p.status === 'pending_approval');

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pending Approval</h1>
          <p className="text-muted-foreground mt-1">Papers awaiting your final approval</p>
        </div>

        {pendingPapers.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-success/50" />
              <h3 className="text-lg font-medium mb-2">All caught up!</h3>
              <p className="text-muted-foreground">No papers pending approval at the moment</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {pendingPapers.map((paper) => (
              <Link key={paper.id} to={`/dashboard/approval/${paper.id}`}>
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
                            Lecturer: {paper.lecturerName} | Examiner: {paper.examinerName || 'N/A'}
                          </p>
                          <div className="flex items-center gap-3 mt-3">
                            <StatusBadge status={paper.status} />
                            <span className="text-xs text-muted-foreground">
                              {paper.signatures.length} signatures
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(paper.updatedAt).toLocaleDateString()}
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

export default PendingApproval;
