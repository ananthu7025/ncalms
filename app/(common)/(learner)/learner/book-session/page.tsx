import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, CheckCircle2, Video } from "lucide-react";

export default function BookSessionMock() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Video className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold">Book a Personal Session</h1>
        <p className="text-muted-foreground text-lg">Mock preview page</p>
      </div>

      {/* Mock Session Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Select Session Type</h2>
        <div className="grid gap-4">
          <Card className="border-primary bg-primary/5 ring-2 ring-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">
                      NCA Assessment Guidance
                    </h3>
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-muted-foreground mt-1">
                    Get expert guidance on assessments.
                  </p>
                </div>
                <div className="flex items-center gap-6 ml-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>30 mins</span>
                  </div>
                  <div className="flex items-center gap-1 font-semibold text-primary">
                    <span className="text-xl">10</span>
                    <span className="text-sm">CAD</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">
                      Exam Prep Guidance
                    </h3>
                  </div>
                  <p className="text-muted-foreground mt-1">
                    Personalized exam strategy.
                  </p>
                </div>
                <div className="flex items-center gap-6 ml-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>30 mins</span>
                  </div>
                  <div className="flex items-center gap-1 font-semibold text-primary">
                    <span className="text-xl">10</span>
                    <span className="text-sm">CAD</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mock Form */}
      <Card>
        <CardHeader>
          <CardTitle>Your Details (Mock)</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input value="John Doe" readOnly />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input value="john@example.com" readOnly />
              </div>
              <div className="space-y-2">
                <Label>Gmail *</Label>
                <Input value="john@gmail.com" readOnly />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp *</Label>
                <Input value="+1 234 567 8900" readOnly />
              </div>
              <div className="space-y-2">
                <Label>Province/State *</Label>
                <Select defaultValue="Ontario">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ontario">Ontario</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Country *</Label>
                <Select defaultValue="Canada">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Canada">Canada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button size="lg" className="w-full" type="button">
              Submit Booking (Mock)
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              WhatsApp confirmation — mock message
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
