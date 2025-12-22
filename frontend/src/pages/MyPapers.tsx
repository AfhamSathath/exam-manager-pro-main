import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { getPapersByLecturer } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from '@/components/StatusBadge';

const MyPapers = () => {
  const { user } = useAuth();
  const papers = user ? getPapersByLecturer(user.id) : [];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Papers</h1>
            <p className="text-muted-foreground mt-1">Manage all your examination papers</p>
          </div>
          <Link to="/dashboard/create-paper">
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Create New Paper
            </Button>
          </Link>
        </div>

        {papers.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium mb-2">No papers yet</h3>
              <p className="text-muted-foreground mb-4">Create your first examination paper to get started</p>
              <Link to="/dashboard/create-paper">
                <Button>Create Paper</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {papers.map((paper) => (
              <Card key={paper.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {paper.courseCode} - {paper.courseName}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {paper.year} • {paper.semester} • {paper.paperType === 'exam' ? 'Examination' : 'Assessment'}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <StatusBadge status={paper.status} />
                          <span className="text-xs text-muted-foreground">
                            Version {paper.currentVersion}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {paper.signatures.length} signature(s)
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link to={`/dashboard/papers/${paper.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </Link>
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

export default MyPapers;
