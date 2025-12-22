import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { getPapersByExaminer } from '@/lib/storage';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, FileCheck } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';

const ModeratedPapers = () => {
  const { user } = useAuth();
  const allPapers = user ? getPapersByExaminer(user.id, user.department) : [];
  const moderatedPapers = allPapers.filter(p => p.examinerId === user?.id && p.status !== 'pending_moderation');

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Moderated Papers</h1>
          <p className="text-muted-foreground mt-1">Papers you have reviewed and moderated</p>
        </div>

        {moderatedPapers.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileCheck className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium mb-2">No moderated papers yet</h3>
              <p className="text-muted-foreground">Papers you moderate will appear here</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {moderatedPapers.map((paper) => (
              <Card key={paper.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-examiner/10 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-examiner" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {paper.courseCode} - {paper.courseName}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {paper.year} • {paper.semester} • {paper.paperType === 'exam' ? 'Examination' : 'Assessment'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Lecturer: {paper.lecturerName}
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                          <StatusBadge status={paper.status} />
                          <span className="text-xs text-muted-foreground">
                            Version {paper.currentVersion}
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
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ModeratedPapers;
