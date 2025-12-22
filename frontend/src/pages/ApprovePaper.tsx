import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { getPaperById, savePaper } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/StatusBadge';
import SignatureDisplay from '@/components/SignatureDisplay';
import { toast } from 'sonner';
import { 
  FileText, 
  ArrowLeft, 
  CheckCircle,
  XCircle,
  Printer,
  Lock,
  MessageSquare
} from 'lucide-react';

const ApprovePaper = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [paper, setPaper] = useState(() => getPaperById(id || ''));
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!paper) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Paper not found</h2>
          <Button variant="link" onClick={() => navigate(-1)}>Go back</Button>
        </div>
      </DashboardLayout>
    );
  }

  const canApprove = paper.status === 'pending_approval' && user?.role === 'hod';
  const canPrint = paper.status === 'approved' && user?.role === 'hod';

  const handleApprove = () => {
    setIsSubmitting(true);
    
    const updatedPaper = {
      ...paper,
      status: 'approved' as const,
      signatures: [
        ...paper.signatures,
        {
          userId: user!.id,
          userName: user!.fullName,
          role: user!.role,
          timestamp: new Date().toISOString(),
          action: 'Final approval granted by HOD',
        }
      ],
      updatedAt: new Date().toISOString(),
    };
    
    savePaper(updatedPaper);
    setPaper(updatedPaper);
    toast.success('Paper approved successfully');
    setIsSubmitting(false);
  };

  const handleReject = () => {
    setIsSubmitting(true);
    
    const updatedPaper = {
      ...paper,
      status: 'rejected' as const,
      isLocked: false,
      signatures: [
        ...paper.signatures,
        {
          userId: user!.id,
          userName: user!.fullName,
          role: user!.role,
          timestamp: new Date().toISOString(),
          action: 'Rejected by HOD',
        }
      ],
      updatedAt: new Date().toISOString(),
    };
    
    savePaper(updatedPaper);
    toast.error('Paper rejected');
    navigate('/dashboard/approval');
    setIsSubmitting(false);
  };

  const handleSendToPrint = () => {
    setIsSubmitting(true);
    
    const updatedPaper = {
      ...paper,
      status: 'printed' as const,
      signatures: [
        ...paper.signatures,
        {
          userId: user!.id,
          userName: user!.fullName,
          role: user!.role,
          timestamp: new Date().toISOString(),
          action: 'Sent to print',
        }
      ],
      updatedAt: new Date().toISOString(),
    };
    
    savePaper(updatedPaper);
    setPaper(updatedPaper);
    toast.success('Paper sent to print and archived');
    setIsSubmitting(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{paper.courseCode}</h1>
              <StatusBadge status={paper.status} />
              {paper.isLocked && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Lock className="w-3 h-3" />
                  Locked
                </span>
              )}
            </div>
            <p className="text-lg text-muted-foreground">{paper.courseName}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {paper.year} • {paper.semester} • By {paper.lecturerName}
            </p>
            {paper.examinerName && (
              <p className="text-sm text-muted-foreground">
                Moderated by: {paper.examinerName}
              </p>
            )}
          </div>
        </div>

        {/* Paper Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Paper Content
            </CardTitle>
            <CardDescription>
              Final version {paper.currentVersion}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 rounded-lg p-6 font-mono text-sm whitespace-pre-wrap max-h-[500px] overflow-auto">
              {paper.content}
            </div>
          </CardContent>
        </Card>

        {/* Action Section */}
        {canApprove && (
          <Card className="border-hod/30">
            <CardHeader>
              <CardTitle>Final Approval</CardTitle>
              <CardDescription>
                Review the paper and all signatures before approving
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={handleReject}
                  disabled={isSubmitting}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  className="flex-1 bg-success hover:bg-success/90"
                  onClick={handleApprove}
                  disabled={isSubmitting}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {canPrint && (
          <Card className="border-hod/30 bg-hod/5">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h4 className="font-medium">Paper Approved</h4>
                <p className="text-sm text-muted-foreground">
                  Ready to be sent for printing
                </p>
              </div>
              <Button
                onClick={handleSendToPrint}
                disabled={isSubmitting}
                className="bg-hod hover:bg-hod/90"
              >
                <Printer className="w-4 h-4 mr-2" />
                Send to Print
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Moderation Comments */}
        {paper.moderationComments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Moderation Comments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {paper.moderationComments.map((c) => (
                <div key={c.id} className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{c.userName}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(c.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm">{c.comment}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Signatures */}
        <Card>
          <CardHeader>
            <CardTitle>Complete Signature Trail</CardTitle>
          </CardHeader>
          <CardContent>
            <SignatureDisplay signatures={paper.signatures} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ApprovePaper;
