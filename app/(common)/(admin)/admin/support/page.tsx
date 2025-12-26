"use client"

import { useState } from "react"
import { Search, Filter, AlertCircle, CheckCircle, Clock, Info, MoreHorizontal, MessageSquare, Reply } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

// Mock Data
type TicketStatus = "New" | "Pending" | "Resolved"
type TicketCategory = "Issue" | "Question" | "Feedback" | "Refund"

interface Ticket {
    id: string
    subject: string
    user: {
        name: string
        email: string
        avatar?: string
    }
    category: TicketCategory
    status: TicketStatus
    message: string // Preview
    fullMessage: string // Full content
    date: string
    isUnread?: boolean
}

const SUPPORT_TICKETS: Ticket[] = [
    {
        id: "1",
        subject: "Cannot access video lectures",
        user: {
            name: "Alice Johnson",
            email: "alice@example.com",
        },
        category: "Issue",
        status: "New",
        message: "I purchased the video bundle but cannot access the lectures. The page shows a loading error.",
        fullMessage: "I purchased the video bundle but cannot access the lectures. The page shows a loading error. I've tried clearing my cache and using a different browser, but the issue persists. Can you please look into this?",
        date: "Mar 18, 4:00 PM",
        isUnread: true,
    },
    {
        id: "2",
        subject: "Question about exam format",
        user: {
            name: "Bob Smith",
            email: "bob@example.com",
        },
        category: "Question",
        status: "Pending",
        message: "Can you clarify the format of the Constitutional Law exam? Is it multiple choice or essay?",
        fullMessage: "Hi, I'm preparing for the Constitutional Law exam and I was wondering if you could clarify the format? Is it strictly multiple choice or will there be essay questions as well?",
        date: "Mar 17, 7:50 PM",
    },
    {
        id: "3",
        subject: "Great course content!",
        user: {
            name: "Carol Davis",
            email: "carol@example.com",
        },
        category: "Feedback",
        status: "Resolved",
        message: "Just wanted to share that the Criminal Law course is excellent. The case studies are very helpful.",
        fullMessage: "Just wanted to share that the Criminal Law course is excellent. The case studies are very helpful and the instructor explains things very clearly. Keep up the good work!",
        date: "Mar 16, 2:15 PM",
    },
    {
        id: "4",
        subject: "Refund request",
        user: {
            name: "Daniel Wilson",
            email: "daniel@example.com",
        },
        category: "Refund",
        status: "Pending",
        message: "I accidentally purchased the wrong course. Can I get a refund so I can buy the correct one?",
        fullMessage: "Hi Support, I made a mistake and purchased the Torts course when I meant to buy Contracts. I haven't started the course yet. Can I please get a refund processed so I can purchase the correct one correctly?",
        date: "Mar 15, 10:30 AM",
    },
]

export default function SupportPage() {
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
    const [replyText, setReplyText] = useState("")

    const getStatusColor = (status: TicketStatus) => {
        switch (status) {
            case "New": return "bg-red-500 hover:bg-red-600"
            case "Pending": return "bg-blue-500 hover:bg-blue-600"
            case "Resolved": return "bg-green-500 hover:bg-green-600"
            default: return "bg-gray-500"
        }
    }

    const getCategoryBadge = (category: TicketCategory) => {
        switch (category) {
            case "Issue": return <Badge variant="secondary" className="bg-red-100 text-red-600 hover:bg-red-200 border-none">Issue</Badge>
            case "Question": return <Badge variant="secondary" className="bg-blue-100 text-blue-600 hover:bg-blue-200 border-none">Question</Badge>
            case "Feedback": return <Badge variant="secondary" className="bg-green-100 text-green-600 hover:bg-green-200 border-none">Feedback</Badge>
            case "Refund": return <Badge variant="secondary" className="bg-orange-100 text-orange-600 hover:bg-orange-200 border-none">Refund</Badge>
        }
    }

    const getStatusIcon = (category: TicketCategory) => {
        switch (category) {
            case "Issue": return <AlertCircle className="w-4 h-4 text-red-500" />
            case "Question": return <Clock className="w-4 h-4 text-orange-500" />
            case "Feedback": return <CheckCircle className="w-4 h-4 text-green-500" />
            case "Refund": return <Clock className="w-4 h-4 text-orange-500" />
        }
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
                    <Badge className="bg-red-500 hover:bg-red-600">2 New</Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-600 hover:bg-blue-200">2 Pending</Badge>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search tickets..." className="pl-9 bg-white" />
                </div>
                <Select defaultValue="all">
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
                <Select defaultValue="all">
                    <SelectTrigger className="w-[180px] bg-white">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="issue">Issue</SelectItem>
                        <SelectItem value="question">Question</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Ticket List */}
            <div className="space-y-4">
                {SUPPORT_TICKETS.map((ticket) => (
                    <Card
                        key={ticket.id}
                        className="p-4 flex items-start justify-between cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setSelectedTicket(ticket)}
                    >
                        <div className="flex gap-4">
                            <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-blue-100 text-blue-600">{ticket.user.name.charAt(0)}</AvatarFallback>
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
                                <p className="text-sm text-gray-600 line-clamp-1">{ticket.message}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            {getCategoryBadge(ticket.category)}
                            <span className="text-xs text-muted-foreground">{ticket.date}</span>
                            {ticket.isUnread && (
                                <div className="w-2 h-2 rounded-full bg-red-500 mt-2" />
                            )}
                        </div>
                    </Card>
                ))}
            </div>

            {/* Ticket Detail Details Dialog */}
            <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
                <DialogContent className="max-w-2xl">
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
                                    {/* <span className="text-gray-500">{selectedTicket.user.email}</span> */}
                                </div>
                                <span className="text-gray-400 text-sm">{selectedTicket.user.email}</span>
                                <div className="ml-auto">
                                    {getCategoryBadge(selectedTicket.category)}
                                </div>
                            </div>

                            {/* Message Body */}
                            <div className="bg-blue-50/50 p-4 rounded-lg text-gray-800 text-sm leading-relaxed border border-blue-50">
                                {selectedTicket.fullMessage || selectedTicket.message}
                            </div>

                            {/* Reply Box */}
                            <div className="space-y-2">
                                <Textarea
                                    placeholder="Write a reply..."
                                    className="min-h-[120px] resize-none focus-visible:ring-blue-500 border-blue-200"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                />
                            </div>

                            <DialogFooter className="flex justify-between sm:justify-between w-full items-center">
                                <Button variant="outline" className="text-gray-600 gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    Mark Resolved
                                </Button>
                                <Button className="bg-blue-500 hover:bg-blue-600 gap-2">
                                    <Reply className="w-4 h-4" />
                                    Send Reply
                                </Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
