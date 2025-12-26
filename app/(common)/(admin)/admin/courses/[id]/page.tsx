"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Play,
  Video,
  FileText,
  HelpCircle,
  CheckCircle,
  ArrowLeft,
  ShoppingCart,
  Lock,
  Star,
  Download,
} from "lucide-react";
import Link from "next/link";

// ---------------- MOCK COURSE DATA ----------------
const mockCourse = {
  id: "course-1",
  title: "Canadian Constitutional Law – NCA Prep",
  description:
    "Master constitutional law principles, power divisions, Charter rights, and prepare confidently for the NCA exam.",
  instructor: "John Marshall",
  instructorAvatar: "https://placehold.co/50x50",
  category: "Law",
  level: "Intermediate",
  rating: 4.8,
  reviews: 245,
  students: 1350,
  thumbnail: "https://placehold.co/600x350",
};

// ---------------- MOCK PURCHASE DATA ----------------
const mockPurchasedRecord = {
  purchasedBundles: ["video", "pdf", "questionBank"],
  progress: {
    video: 40,
    pdf: 20,
    questionBank: 10,
  },
};

// ---------------- MOCK CONTENT DATA ----------------
const mockVideos = [
  { id: "v1", title: "Introduction to Constitution", watched: true },
  { id: "v2", title: "Charter Rights Overview", watched: false },
  { id: "v3", title: "Federal Powers Breakdown", watched: true },
];

const mockPDFs = [
  { id: "p1", title: "Charter Notes", pages: 20, size: "2.4MB", isDownloaded: true },
  { id: "p2", title: "Case Law Summary", pages: 32, size: "3.1MB", isDownloaded: false },
];

const mockQuestionBank = [
  { id: "q1", title: "Mock Exam A", questionsCount: 30, difficulty: "Easy", score: 72, isCompleted: true },
  { id: "q2", title: "Mock Exam B", questionsCount: 25, difficulty: "Hard", score: null, isCompleted: false },
];

export default function CourseDetailsUI() {
  const [isPurchased] = useState(true);

  return (
    <div className="space-y-6 animate-fade-in">
      {isPurchased ? (
        <>
          {/* Header */}
          <Link
            href="/learner/library"
            className="inline-flex items-center text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Library
          </Link>

          {/* Course Header */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <img
              src={mockCourse.thumbnail}
              className="w-full md:w-64 h-40 rounded-xl object-cover"
            />
            <div>
              <Badge className="bg-success text-success-foreground mb-2">
                Purchased
              </Badge>

              <h1 className="text-2xl font-bold">{mockCourse.title}</h1>
              <p className="text-muted-foreground mb-4">
                {mockCourse.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-warning">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{mockCourse.rating}</span>
                  <span className="text-muted-foreground">
                    ({mockCourse.reviews} reviews)
                  </span>
                </div>

                <div className="text-muted-foreground">
                  👥 {mockCourse.students} students
                </div>

                <p className="text-muted-foreground">
                  Bundles: {mockPurchasedRecord.purchasedBundles.join(", ").toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="videos">
            <TabsList className="grid grid-cols-3 max-w-md">
              <TabsTrigger value="videos">
                <Video className="w-4 h-4 mr-2" />
                Videos
              </TabsTrigger>
              <TabsTrigger value="pdfs">
                <FileText className="w-4 h-4 mr-2" />
                PDFs
              </TabsTrigger>
              <TabsTrigger value="questions">
                <HelpCircle className="w-4 h-4 mr-2" />
                Questions
              </TabsTrigger>
            </TabsList>

            {/* PDFs Tab */}
            <TabsContent value="pdfs" className="mt-6">
              {mockPurchasedRecord.purchasedBundles.includes("pdf") ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">PDF Materials</h2>
                    <span className="text-sm text-muted-foreground">
                      {mockPurchasedRecord.progress.pdf}% complete
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockPDFs.map((pdf) => (
                      <Card key={pdf.id} className="hover:shadow-lg transition">
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{pdf.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {pdf.pages} pages • {pdf.size}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {pdf.isDownloaded && (
                              <Badge variant="outline" className="text-success border-success">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Done
                              </Badge>
                            )}
                            <Button variant="ghost" size="icon">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <Card className="text-center py-12">
                  <Lock className="mx-auto w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">PDF Bundle Not Purchased</h3>
                  <p className="text-muted-foreground mb-4">
                    Purchase the PDF bundle to access study materials.
                  </p>
                  <Button className="gradient-primary">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add PDF Bundle - $99
                  </Button>
                </Card>
              )}
            </TabsContent>
            {/* Videos Tab */}
            <TabsContent value="videos" className="mt-6">
              {mockPurchasedRecord.purchasedBundles.includes("video") ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Video Lectures</h2>
                    <span className="text-sm text-muted-foreground">
                      {mockPurchasedRecord.progress.video}% complete
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockVideos.map((video) => (
                      <Card key={video.id} className="overflow-hidden hover:shadow-card-hover transition-shadow cursor-pointer">
                        <div className="relative aspect-video bg-foreground/5">
                          <img
                            src="https://placehold.co/600x350?text=Video+Thumbnail"
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />

                          {/* Hover Play Overlay */}
                          <div className="absolute inset-0 bg-foreground/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Button size="lg" className="rounded-full w-12 h-12 gradient-primary">
                              <Play className="w-5 h-5" />
                            </Button>
                          </div>

                          {/* Watched Badge */}
                          {video.watched && (
                            <Badge className="absolute top-2 right-2 bg-success text-success-foreground">
                              <CheckCircle className="w-3 h-3 mr-1" /> Watched
                            </Badge>
                          )}

                          {/* Duration Bottom Label */}
                          <div className="absolute bottom-2 right-2 bg-background/80 text-xs px-2 py-1 rounded">
                            12:40
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium text-sm line-clamp-2">{video.title}</h3>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <Card className="text-center py-12">
                  <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Video Bundle Not Purchased</h3>
                  <p className="text-muted-foreground mb-4">Purchase the video bundle to access lessons.</p>
                  <Button className="gradient-primary">
                    <ShoppingCart className="w-4 h-4 mr-2" /> Add Video Bundle - $149
                  </Button>
                </Card>
              )}
            </TabsContent>

            {/* Questions Tab */}
            <TabsContent value="questions" className="mt-6">
              {mockPurchasedRecord.purchasedBundles.includes("questionBank") ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Question Bank</h2>
                    <span className="text-sm text-muted-foreground">
                      {mockPurchasedRecord.progress.questionBank}% complete
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockQuestionBank.map((item) => (
                      <Card key={item.id} className="hover:shadow-lg transition cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <HelpCircle className="w-5 h-5 text-primary" />
                            </div>
                            <Badge variant={item.difficulty === "Easy" ? "secondary" : "destructive"}>
                              {item.difficulty}
                            </Badge>
                          </div>

                          <h3 className="font-medium mb-1">{item.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {item.questionsCount} questions
                          </p>

                          {item.isCompleted ? (
                            <Badge className="bg-success text-success-foreground">
                              Score: {item.score}%
                            </Badge>
                          ) : (
                            <Button size="sm" variant="outline">Start Practice</Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <Card className="text-center py-12">
                  <Lock className="mx-auto w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Question Bank Not Purchased</h3>
                  <p className="text-muted-foreground mb-4">
                    Purchase to unlock practice tests.
                  </p>
                  <Button className="gradient-primary">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add Question Bank - $79
                  </Button>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <>
          {/* Locked View */}
          <Link
            href="/courses"
            className="inline-flex items-center text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Courses
          </Link>

          <div className="relative aspect-video rounded-xl overflow-hidden">
            <img src={mockCourse.thumbnail} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center">
              <Button className="rounded-full w-14 h-14 gradient-primary">
                <Play className="w-6 h-6" />
              </Button>
            </div>
            <Badge className="absolute top-4 left-4 bg-background/90">
              Preview
            </Badge>
          </div>

          <h1 className="text-3xl font-bold">{mockCourse.title}</h1>
          <p className="text-muted-foreground">{mockCourse.description}</p>

          <Card className="border-2 border-primary">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-xl">Complete Bundle</h3>
              <div className="flex gap-3 items-baseline">
                <span className="text-3xl font-bold">$199</span>
                <span className="line-through text-muted-foreground">$299</span>
                <Badge className="bg-success text-success-foreground">35% OFF</Badge>
              </div>
              <Button size="lg" className="w-full gradient-primary">
                <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
