"use client"

import { useState, useEffect } from "react"
import { Plus, Search, AlertCircle, CheckCircle, Clock, MessageSquare } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  getLearnerTickets,
  createSupportTicket,
  addTicketMessage,
  type TicketWithDetails,
  type TicketCategory,
  type TicketStatus
} from "@/lib/actions/support"
import { toast } from "sonner"
import { LearnerSupportPageSkeleton } from "@/components/skeletons/support-skeleton"

export default function LearnerSupportPage() {
  const [tickets, setTickets] = useState<TicketWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState<TicketWithDetails | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newTicket, setNewTicket] = useState({
    subject: "",
    category: "",
    message: ""
  })
  const [followUpMessage, setFollowUpMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [submitting, setSubmitting] = useState(false)

  // Load tickets
  useEffect(() => {
    loadTickets()
  }, [])

  const loadTickets = async () => {
    setLoading(true)
    const result = await getLearnerTickets()
    if (result.success && result.tickets) {
      setTickets(result.tickets)
    } else {
      toast.error(result.error || "Failed to load tickets")
    }
    setLoading(false)
  }

  const getCategoryBadge = (category: TicketCategory) => {
    switch (category) {
      case "issue": return <Badge variant="secondary" className="bg-red-100 text-red-600 hover:bg-red-200 border-none">Issue</Badge>
      case "question": return <Badge variant="secondary" className="bg-blue-100 text-blue-600 hover:bg-blue-200 border-none">Question</Badge>
      case "feedback": return <Badge variant="secondary" className="bg-green-100 text-green-600 hover:bg-green-200 border-none">Feedback</Badge>
      case "refund": return <Badge variant="secondary" className="bg-orange-100 text-orange-600 hover:bg-orange-200 border-none">Refund</Badge>
    }
  }

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case "new": return <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>
      case "pending": return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-none">Pending</Badge>
      case "resolved": return <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200 border-none">Resolved</Badge>
    }
  }

  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case "new": return <Clock className="w-4 h-4 text-blue-500" />
      case "pending": return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case "resolved": return <CheckCircle className="w-4 h-4 text-green-500" />
    }
  }

  const handleCreateTicket = async () => {
    if (!newTicket.subject || !newTicket.category || !newTicket.message) {
      toast.error("Please fill in all fields")
      return
    }

    setSubmitting(true)
    const result = await createSupportTicket({
      subject: newTicket.subject,
      category: newTicket.category as TicketCategory,
      message: newTicket.message,
    })

    if (result.success) {
      toast.success("Support ticket created successfully")
      setIsCreateDialogOpen(false)
      setNewTicket({ subject: "", category: "", message: "" })
      loadTickets()
    } else {
      toast.error(result.error || "Failed to create ticket")
    }
    setSubmitting(false)
  }

  const handleSendFollowUp = async () => {
    if (!selectedTicket || !followUpMessage.trim()) {
      return
    }

    setSubmitting(true)
    const result = await addTicketMessage(selectedTicket.id, followUpMessage)

    if (result.success) {
      toast.success("Message sent successfully")
      setFollowUpMessage("")
      loadTickets()
      // Update the selected ticket
      const updatedTickets = await getLearnerTickets()
      if (updatedTickets.success && updatedTickets.tickets) {
        const updated = updatedTickets.tickets.find(t => t.id === selectedTicket.id)
        if (updated) {
          setSelectedTicket(updated)
        }
      }
    } else {
      toast.error(result.error || "Failed to send message")
    }
    setSubmitting(false)
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.messages[0]?.message.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || ticket.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    open: tickets.filter(t => t.status === "new" || t.status === "pending").length,
    pending: tickets.filter(t => t.status === "pending").length,
    resolved: tickets.filter(t => t.status === "resolved").length,
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  if (loading) {
    return <LearnerSupportPageSkeleton />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Support Tickets</h1>
          <p className="text-muted-foreground">Get help and track your support requests</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Ticket
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Open Tickets</p>
              <p className="text-2xl font-bold">{stats.open}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Response</p>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Resolved</p>
              <p className="text-2xl font-bold">{stats.resolved}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your tickets..."
            className="pl-9 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <Card className="p-12 text-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tickets found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "You haven't created any support tickets yet"}
            </p>
            {!searchQuery && statusFilter === "all" && (
              <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Create Your First Ticket
              </Button>
            )}
          </Card>
        ) : (
          filteredTickets.map((ticket) => (
            <Card
              key={ticket.id}
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedTicket(ticket)}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(ticket.status)}
                    <h3 className="font-semibold">{ticket.subject}</h3>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {ticket.messages[0]?.message}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Created: {formatDate(ticket.createdAt)}</span>
                    {ticket.createdAt.getTime() !== ticket.updatedAt.getTime() && (
                      <>
                        <span>•</span>
                        <span>Last updated: {formatDate(ticket.updatedAt)}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {getCategoryBadge(ticket.category)}
                  {getStatusBadge(ticket.status)}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create Ticket Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Support Ticket</DialogTitle>
            <DialogDescription>
              Describe your issue or question and we'll get back to you as soon as possible.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Brief description of your issue"
                value={newTicket.subject}
                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={newTicket.category}
                onValueChange={(value) => setNewTicket({ ...newTicket, category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="issue">Issue</SelectItem>
                  <SelectItem value="question">Question</SelectItem>
                  <SelectItem value="feedback">Feedback</SelectItem>
                  <SelectItem value="refund">Refund Request</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Provide details about your issue or question..."
                className="min-h-[150px] resize-none"
                value={newTicket.message}
                onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateTicket}
              disabled={!newTicket.subject || !newTicket.category || !newTicket.message || submitting}
            >
              {submitting ? "Submitting..." : "Submit Ticket"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ticket Detail Dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedTicket?.subject}</DialogTitle>
            <div className="flex items-center gap-2 pt-2">
              {selectedTicket && getCategoryBadge(selectedTicket.category)}
              {selectedTicket && getStatusBadge(selectedTicket.status)}
            </div>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-6">
              {/* Messages Thread */}
              <div className="space-y-4">
                {selectedTicket.messages
                  .slice()
                  .reverse()
                  .map((msg) => (
                    <div key={msg.id} className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {msg.isFromAdmin ? "Support Team" : "You"}
                        </span>
                        <span>•</span>
                        <span>{formatDate(msg.createdAt)}</span>
                      </div>
                      <div
                        className={`p-4 rounded-lg text-sm leading-relaxed ${
                          msg.isFromAdmin
                            ? "bg-gray-50 text-gray-800 border border-gray-200"
                            : "bg-blue-50/50 text-gray-800 border border-blue-100"
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Follow-up Message (only for non-resolved tickets) */}
              {selectedTicket.status !== "resolved" && (
                <div className="space-y-2">
                  <Label>Add a follow-up message</Label>
                  <Textarea
                    placeholder="Write a follow-up message..."
                    className="min-h-[100px] resize-none focus-visible:ring-blue-500 border-blue-200"
                    value={followUpMessage}
                    onChange={(e) => setFollowUpMessage(e.target.value)}
                  />
                </div>
              )}

              <DialogFooter>
                {selectedTicket.status === "resolved" ? (
                  <Button variant="outline" onClick={() => setSelectedTicket(null)}>
                    Close
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => setSelectedTicket(null)} disabled={submitting}>
                      Close
                    </Button>
                    <Button
                      onClick={handleSendFollowUp}
                      disabled={!followUpMessage.trim() || submitting}
                      className="gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      {submitting ? "Sending..." : "Send Message"}
                    </Button>
                  </>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
