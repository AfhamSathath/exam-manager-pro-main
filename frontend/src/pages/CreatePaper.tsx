import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { FileText, Send, Save, Calendar, BookOpen } from "lucide-react";
import axios from "axios";
import { COURSES, YEARS, SEMESTERS, Year, Semester, PaperType } from "@/types";

const API_URL = "http://localhost:5001/api/papers";

const CreatePaper = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth(); // token is JWT from AuthContext

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    year: "" as Year,
    semester: "" as Semester,
    courseCode: "",
    paperType: "exam" as PaperType,
  });

  const filteredCourses = COURSES.filter(
    c =>
      c.department === user?.department &&
      c.year === formData.year &&
      c.semester === formData.semester
  );

  const selectedCourse = COURSES.find(c => c.code === formData.courseCode);

  const validate = () => {
    if (!selectedCourse) {
      toast.error("Please select a course");
      return false;
    }
    if (!pdfFile) {
      toast.error("Please upload a PDF file");
      return false;
    }
    return true;
  };

  const handleSubmit = async (status: "draft" | "pending_moderation") => {
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const formPayload = new FormData();
      formPayload.append("year", formData.year);
      formPayload.append("semester", formData.semester);
      formPayload.append("courseCode", selectedCourse!.code);
      formPayload.append("courseName", selectedCourse!.name);
      formPayload.append("paperType", formData.paperType);
      formPayload.append("department", user!.department);
      formPayload.append("lecturerId", user!.id);
      formPayload.append("lecturerName", user!.fullName);
      formPayload.append("status", status);
      formPayload.append("pdf", pdfFile!);

      await axios.post(API_URL, formPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(
        status === "draft" ? "Draft saved!" : "Submitted for review!"
      );
      navigate("/dashboard/papers");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to upload paper");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" /> Create Paper (PDF Only)
            </CardTitle>
            <CardDescription>
              Upload examination or assessment paper as PDF
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Year & Semester */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Academic Year</Label>
                <Select
                  value={formData.year}
                  onValueChange={(value: Year) =>
                    setFormData({ ...formData, year: value, courseCode: "" })
                  }
                >
                  <SelectTrigger>
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEARS.map(y => (
                      <SelectItem key={y} value={y}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Semester</Label>
                <Select
                  value={formData.semester}
                  disabled={!formData.year}
                  onValueChange={(value: Semester) =>
                    setFormData({ ...formData, semester: value, courseCode: "" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEMESTERS.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Course & Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Course</Label>
                <Select
                  value={formData.courseCode}
                  disabled={!formData.year || !formData.semester}
                  onValueChange={value =>
                    setFormData({ ...formData, courseCode: value })
                  }
                >
                  <SelectTrigger>
                    <BookOpen className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCourses.map(c => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.code} - {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Paper Type</Label>
                <Select
                  value={formData.paperType}
                  onValueChange={value =>
                    setFormData({ ...formData, paperType: value as PaperType })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exam">Examination</SelectItem>
                    <SelectItem value="assessment">Assessment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* PDF Upload */}
            <div>
              <Label>Upload PDF</Label>
              <Input
                type="file"
                accept="application/pdf"
                onChange={e => e.target.files && setPdfFile(e.target.files[0])}
              />
              {pdfFile && (
                <p className="text-xs text-muted-foreground mt-1">
                  {pdfFile.name} ({(pdfFile.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                onClick={() => handleSubmit("draft")}
                className="flex-1"
                disabled={isSubmitting}
              >
                <Save className="w-4 h-4 mr-2" /> Save Draft
              </Button>

              <Button
                onClick={() => handleSubmit("pending_moderation")}
                className="flex-1"
                disabled={isSubmitting}
              >
                <Send className="w-4 h-4 mr-2" /> Submit for Review
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreatePaper;
