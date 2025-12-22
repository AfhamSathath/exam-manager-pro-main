import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { getPaperById, savePaper } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import StatusBadge from '@/components/StatusBadge';
import SignatureDisplay from '@/components/SignatureDisplay';
import { toast } from 'sonner';
import { 
  FileText, 
  Send, 
  Save, 
  ArrowLeft, 
  MessageSquare,
  Edit3,
  CheckCircle,
  AlertCircle,
  Download,
  ExternalLink
} from 'lucide-react';

const PaperDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [paper, setPaper] = useState(() => getPaperById(id || ''));
  const [editedContent, setEditedContent] = useState(paper?.content || '');
  const [newPdfFile, setNewPdfFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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

  const canEdit = paper.lecturerId === user?.id && 
    (paper.status === 'draft' || paper.status === 'revision_required') &&
    !paper.isLocked;

  const isPdf = paper.content.toLowerCase().endsWith('.pdf');
  const pdfUrl = `/uploads/papers/${paper.content}`;

  const handleSavePdf = () => {
    if (!newPdfFile) {
      toast.error('Please select a PDF file');
      return;
    }

    const newVersion = paper.currentVersion + 1;

    const updatedPaper = {
      ...paper,
      content: newPdfFile.name,
      currentVersion: newVersion,
      revisions: [
        ...paper.revisions,
        {
          id: uuidv4(),
          content: newPdfFile.name,
          timestamp: new Date().toISOString(),
          version: newVersion,
        },
      ],
      signatures: [
        ...paper.signatures,
        {
          userId: user!.id,
          userName: user!.fullName,
          role: user!.role,
          timestamp: new Date().toISOString(),
          action: `Updated PDF to version ${newVersion}`,
        },
      ],
      updatedAt: new Date().toISOString(),
    };

    savePaper(updatedPaper);
    setPaper(updatedPaper);
    setNewPdfFile(null);
    toast.success('PDF updated successfully');
  };

  const handleSubmitForReview = () => {
    const newVersion = paper.currentVersion + 1;
    const updatedPaper = {
      ...paper,
      content: editedContent,
      status: 'pending_moderation' as const,
      currentVersion: newVersion,
      revisions: [
        ...paper.revisions,
        {
          id: uuidv4(),
          content: isPdf ? paper.content : editedContent,
          timestamp: new Date().toISOString(),
          version: newVersion,
        }
      ],
      signatures: [
        ...paper.signatures,
        {
          userId: user!.id,
          userName: user!.fullName,
          role: user!.role,
          timestamp: new Date().toISOString(),
          action: `Submitted version ${newVersion} for review`,
        }
      ],
      updatedAt: new Date().toISOString(),
    };
    savePaper(updatedPaper);
    setPaper(updatedPaper);
    setIsEditing(false);
    toast.success('Paper submitted for moderation');
  };

  const handleSendToHOD = () => {
    if (paper.status !== 'moderated') return;

    const updatedPaper = {
      ...paper,
      status: 'pending_approval' as const,
      isLocked: true,
      signatures: [
        ...paper.signatures,
        {
          userId: user!.id,
          userName: user!.fullName,
          role: user!.role,
          timestamp: new Date().toISOString(),
          action: 'Submitted to HOD for approval',
        }
      ],
      updatedAt: new Date().toISOString(),
    };
    savePaper(updatedPaper);
    setPaper(updatedPaper);
    toast.success('Paper sent to HOD for approval');
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
            </div>
            <p className="text-lg text-muted-foreground">{paper.courseName}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {paper.year} • {paper.semester} • {paper.paperType === 'exam' ? 'Examination' : 'Assessment'}
            </p>
          </div>
          {canEdit && !isEditing && !isPdf && (
            <Button onClick={() => setIsEditing(true)}>
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Paper
            </Button>
          )}
        </div>

        {/* PDF Content */}
        {isPdf && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                PDF Paper
              </CardTitle>
              <CardDescription>Version {paper.currentVersion}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 mb-2">
                <Button variant="outline" asChild>
                  <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open PDF
                  </a>
                </Button>
                <Button asChild>
                  <a href={pdfUrl} download>
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </a>
                </Button>
              </div>

              {/* Upload New PDF */}
              {canEdit && (
                <div className="space-y-2">
                  <Label>Replace PDF</Label>
                  <input 
                    type="file" 
                    accept="application/pdf" 
                    onChange={e => e.target.files && setNewPdfFile(e.target.files[0])} 
                  />
                  {newPdfFile && (
                    <Button onClick={handleSavePdf} className="mt-2">
                      <Save className="w-4 h-4 mr-2" />
                      Update PDF
                    </Button>
                  )}
                </div>
              )}

              <iframe
                src={pdfUrl}
                title="PDF Preview"
                className="w-full h-[600px] rounded-md border"
              />
            </CardContent>
          </Card>
        )}

        {/* Text Content */}
        {!isPdf && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Paper Content
              </CardTitle>
              <CardDescription>Version {paper.currentVersion}</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="min-h-[400px] font-mono text-sm"
                  />
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => {
                      setIsEditing(false);
                      setEditedContent(paper.content);
                    }}>
                      Cancel
                    </Button>
                    <Button variant="outline" onClick={handleSavePdf}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Draft
                    </Button>
                    <Button onClick={handleSubmitForReview} className="bg-gradient-primary">
                      <Send className="w-4 h-4 mr-2" />
                      Submit for Review
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-muted/50 rounded-lg p-6 font-mono text-sm whitespace-pre-wrap">
                  {paper.content}
                </div>
              )}
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
              {paper.moderationComments.map((comment) => (
                <div key={comment.id} className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{comment.userName}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm">{comment.comment}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Signatures */}
        <Card>
          <CardHeader>
            <CardTitle>Signature Trail</CardTitle>
          </CardHeader>
          <CardContent>
            <SignatureDisplay signatures={paper.signatures} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PaperDetail;
