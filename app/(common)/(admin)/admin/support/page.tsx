"use client"

import { useState, useEffect } from "react"
import { Search, AlertCircle, CheckCircle, Clock, Reply } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  getAllSupportTickets,
  replyToTicket,
  updateTicketStatus,
  type TicketWithDetails,
  type TicketCategory,
  type TicketStatus
} from "@/lib/actions/support"
import { toast } from "sonner"
import { AdminSupportPageSkeleton } from "@/components/skeletons/support-skeleton"

export default function SupportPage() {
  const [tickets, setTickets] = useState<TicketWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState<TicketWithDetails | null>(null)
  const [replyText, setReplyText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all")
  const [categoryFilter, setCategoryFilter] = useState<TicketCategory | "all">("all")
  const [submitting, setSubmitting] = useState(false)

  const loadTickets = async () => {
    setLoading(true)
    const result = await getAllSupportTickets()
    if (result.success && result.tickets) {
      setTickets(result.tickets)
    } else {
      toast.error(result.error || "Failed to load tickets")
    }
    setLoading(false)
  }

  const applyFilters = async () => {
    const result = await getAllSupportTickets({
      status: statusFilter,
      category: categoryFilter,
      searchQuery,
    })
    if (result.success && result.tickets) {
      setTickets(result.tickets)
    }
  }

  useEffect(() => {
    loadTickets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    applyFilters()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, statusFilter, categoryFilter])

  const getCategoryBadge = (category: TicketCategory) => {
    switch (category) {
      case "issue": return <Badge variant="secondary" className="bg-red-100 text-red-600 hover:bg-red-200 border-none">Issue</Badge>
      case "question": return <Badge variant="secondary" className="bg-blue-100 text-blue-600 hover:bg-blue-200 border-none">Question</Badge>
      case "feedback": return <Badge variant="secondary" className="bg-green-100 text-green-600 hover:bg-green-200 border-none">Feedback</Badge>
      case "refund": return <Badge variant="secondary" className="bg-orange-100 text-orange-600 hover:bg-orange-200 border-none">Refund</Badge>
    }
  }

  const getStatusIcon = (category: TicketCategory) => {
    switch (category) {
      case "issue": return <AlertCircle className="w-4 h-4 text-red-500" />
      case "question": return <Clock className="w-4 h-4 text-orange-500" />
      case "feedback": return <CheckCircle className="w-4 h-4 text-green-500" />
      case "refund": return <Clock className="w-4 h-4 text-orange-500" />
    }
  }

  const handleSendReply = async () => {
    if (!selectedTicket || !replyText.trim()) {
      return
    }

    setSubmitting(true)
    const result = await replyToTicket(selectedTicket.id, replyText)

    if (result.success) {
      toast.success("Reply sent successfully")
      setReplyText("")
      loadTickets()
      // Update the selected ticket
      const updatedTickets = await getAllSupportTickets()
      if (updatedTickets.success && updatedTickets.tickets) {
        const updated = updatedTickets.tickets.find(t => t.id === selectedTicket.id)
        if (updated) {
          setSelectedTicket(updated)
        }
      }
    } else {
      toast.error(result.error || "Failed to send reply")
    }
    setSubmitting(false)
  }

  const handleMarkResolved = async () => {
    if (!selectedTicket) return

    setSubmitting(true)
    const result = await updateTicketStatus(selectedTicket.id, "resolved")

    if (result.success) {
      toast.success("Ticket marked as resolved")
      setSelectedTicket(null)
      loadTickets()
    } else {
      toast.error(result.error || "Failed to update ticket")
    }
    setSubmitting(false)
  }

  const stats = {
    new: tickets.filter(t => t.status === "new").length,
    pending: tickets.filter(t => t.status === "pending").length,
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
    return <AdminSupportPageSkeleton />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Support Inbox</h1>
          <p className="text-muted-foreground">Manage user support requests</p>
        </div>
        <div className="flex gap-2">
          {stats.new > 0 && <Badge className="bg-red-500 hover:bg-red-600">{stats.new} New</Badge>}
          {stats.pending > 0 && <Badge variant="secondary" className="bg-blue-100 text-blue-600 hover:bg-blue-200">{stats.pending} Pending</Badge>}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            className="pl-9 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as TicketStatus | "all")}>
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
        <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as TicketCategory | "all")}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="issue">Issue</SelectItem>
            <SelectItem value="question">Question</SelectItem>
            <SelectItem value="feedback">Feedback</SelectItem>
            <SelectItem value="refund">Refund</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Ticket List */}
      <div className="space-y-4">
        {tickets.length === 0 ? (
          <Card className="p-12 text-center">
            <h3 className="text-lg font-semibold mb-2">No support tickets</h3>
            <p className="text-muted-foreground">
              {searchQuery || statusFilter !== "all" || categoryFilter !== "all"
                ? "No tickets match your filters"
                : "There are no support tickets yet"}
            </p>
          </Card>
        ) : (
          tickets.map((ticket) => (
            <Card
              key={ticket.id}
              className="p-4 flex items-start justify-between cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedTicket(ticket)}
            >
              <div className="flex gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {ticket.user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{ticket.subject}</h3>
                    {getStatusIcon(ticket.category)}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <span>{ticket.user.name}</span>
                    <span>•</span>
                    <span>{ticket.user.email}</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-1">
                    {ticket.messages[0]?.message}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {getCategoryBadge(ticket.category)}
                <span className="text-xs text-muted-foreground">{formatDate(ticket.updatedAt)}</span>
                {ticket.isUnread && (
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-2" />
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Ticket Detail Dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center justify-between">
              <span>{selectedTicket?.subject}</span>
            </DialogTitle>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs bg-gray-100 text-gray-600">
                    {selectedTicket.user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-sm">
                  <span className="font-medium text-gray-900">{selectedTicket.user.name}</span>
                </div>
                <span className="text-gray-400 text-sm">{selectedTicket.user.email}</span>
                <div className="ml-auto">
                  {getCategoryBadge(selectedTicket.category)}
                </div>
              </div>

              {/* Messages Thread */}
              <div className="space-y-4">
                {selectedTicket.messages
                  .slice()
                  .reverse()
                  .map((msg) => (
                    <div key={msg.id} className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {msg.isFromAdmin ? "You (Admin)" : selectedTicket.user.name}
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

              {/* Reply Box (only for non-resolved tickets) */}
              {selectedTicket.status !== "resolved" && (
                <div className="space-y-2">
                  <Textarea
                    placeholder="Write a reply..."
                    className="min-h-[120px] resize-none focus-visible:ring-blue-500 border-blue-200"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                </div>
              )}

              <DialogFooter className="flex justify-between sm:justify-between w-full items-center">
                {selectedTicket.status !== "resolved" ? (
                  <>
                    <Button
                      variant="outline"
                      className="text-gray-600 gap-2"
                      onClick={handleMarkResolved}
                      disabled={submitting}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark Resolved
                    </Button>
                    <Button
                      className="bg-blue-500 hover:bg-blue-600 gap-2"
                      onClick={handleSendReply}
                      disabled={!replyText.trim() || submitting}
                    >
                      <Reply className="w-4 h-4" />
                      {submitting ? "Sending..." : "Send Reply"}
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" onClick={() => setSelectedTicket(null)}>
                    Close
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
