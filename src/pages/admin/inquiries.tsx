import { useState, useEffect } from 'react';
import RootLayout from '@/layouts/RootLayout';
import AdminSidebar from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  Search,
  Mail,
  Phone,
  User,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';

interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  userType: string;
  inquiryType: string;
  subject: string;
  message: string;
  propertyReference: string | null;
  status: string;
  priority: string;
  responseMessage: string | null;
  respondedBy: string | null;
  respondedAt: string | null;
  createdAt: string;
}

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isResponseOpen, setIsResponseOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [respondedBy, setRespondedBy] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/inquiries');
      if (!response.ok) throw new Error('Failed to fetch inquiries');
      const data = await response.json();
      setInquiries(data);
    } catch (error) {
      toast.error('Failed to load inquiries');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateInquiryStatus = async (
    id: number,
    status: string,
    priority?: string
  ) => {
    try {
      setUpdating(true);
      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, priority }),
      });

      if (!response.ok) throw new Error('Failed to update inquiry');

      toast.success('Inquiry updated successfully');
      fetchInquiries();
      setIsDetailOpen(false);
    } catch (error) {
      toast.error('Failed to update inquiry');
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  const submitResponse = async () => {
    if (!selectedInquiry || !responseMessage.trim() || !respondedBy.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setUpdating(true);
      const response = await fetch(`/api/inquiries/${selectedInquiry.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'resolved',
          responseMessage,
          respondedBy,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit response');

      toast.success('Response submitted successfully');
      setResponseMessage('');
      setRespondedBy('');
      setIsResponseOpen(false);
      fetchInquiries();
    } catch (error) {
      toast.error('Failed to submit response');
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch =
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || inquiry.status === statusFilter;

    const matchesPriority =
      priorityFilter === 'all' || inquiry.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: inquiries.length,
    pending: inquiries.filter((i) => i.status === 'pending').length,
    inProgress: inquiries.filter((i) => i.status === 'in_progress').length,
    resolved: inquiries.filter((i) => i.status === 'resolved').length,
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: any }> = {
      pending: { variant: 'secondary', icon: Clock },
      in_progress: { variant: 'default', icon: AlertCircle },
      resolved: { variant: 'default', icon: CheckCircle },
      closed: { variant: 'outline', icon: XCircle },
    };

    const config = variants[status] || variants.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
    };

    return (
      <Badge className={colors[priority] || colors.low}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  return (
    <RootLayout>
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1">
          <div className="container mx-auto py-8">
            <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Inquiry Management</h1>
          <p className="text-muted-foreground mt-2">Manage and respond to customer inquiries</p>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Inquiries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.inProgress}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Resolved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.resolved}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Inquiries List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading inquiries...</p>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No inquiries found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredInquiries.map((inquiry) => (
              <Card key={inquiry.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {inquiry.subject}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusBadge(inquiry.status)}
                            {getPriorityBadge(inquiry.priority)}
                            <Badge variant="outline">{inquiry.inquiryType}</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>{inquiry.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {inquiry.userType}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span>{inquiry.email}</span>
                        </div>
                        {inquiry.phone && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span>{inquiry.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>
                            {new Date(inquiry.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {inquiry.message}
                      </p>

                      {inquiry.propertyReference && (
                        <Badge variant="secondary">
                          Property: {inquiry.propertyReference}
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedInquiry(inquiry);
                          setIsDetailOpen(true);
                        }}
                      >
                        View Details
                      </Button>
                      {inquiry.status !== 'resolved' && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedInquiry(inquiry);
                            setIsResponseOpen(true);
                          }}
                        >
                          Respond
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Inquiry Details</DialogTitle>
            <DialogDescription>
              Complete information about this inquiry
            </DialogDescription>
          </DialogHeader>

          {selectedInquiry && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {getStatusBadge(selectedInquiry.status)}
                {getPriorityBadge(selectedInquiry.priority)}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Name</Label>
                  <p className="font-medium">{selectedInquiry.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">User Type</Label>
                  <p className="font-medium">{selectedInquiry.userType}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{selectedInquiry.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Phone</Label>
                  <p className="font-medium">
                    {selectedInquiry.phone || 'Not provided'}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Inquiry Type</Label>
                  <p className="font-medium">{selectedInquiry.inquiryType}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Date</Label>
                  <p className="font-medium">
                    {new Date(selectedInquiry.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {selectedInquiry.propertyReference && (
                <div>
                  <Label className="text-muted-foreground">
                    Property Reference
                  </Label>
                  <p className="font-medium">
                    {selectedInquiry.propertyReference}
                  </p>
                </div>
              )}

              <div>
                <Label className="text-muted-foreground">Subject</Label>
                <p className="font-medium">{selectedInquiry.subject}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Message</Label>
                <p className="text-sm whitespace-pre-wrap">
                  {selectedInquiry.message}
                </p>
              </div>

              {selectedInquiry.responseMessage && (
                <div className="border-t pt-4">
                  <Label className="text-muted-foreground">Response</Label>
                  <p className="text-sm whitespace-pre-wrap mt-2">
                    {selectedInquiry.responseMessage}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Responded by {selectedInquiry.respondedBy} on{' '}
                    {selectedInquiry.respondedAt &&
                      new Date(selectedInquiry.respondedAt).toLocaleString()}
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Select
                  value={selectedInquiry.status}
                  onValueChange={(value) =>
                    updateInquiryStatus(selectedInquiry.id, value)
                  }
                  disabled={updating}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={selectedInquiry.priority}
                  onValueChange={(value) =>
                    updateInquiryStatus(
                      selectedInquiry.id,
                      selectedInquiry.status,
                      value
                    )
                  }
                  disabled={updating}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Response Dialog */}
      <Dialog open={isResponseOpen} onOpenChange={setIsResponseOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Respond to Inquiry</DialogTitle>
            <DialogDescription>
              Send a response to {selectedInquiry?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="respondedBy">Your Name *</Label>
              <Input
                id="respondedBy"
                value={respondedBy}
                onChange={(e) => setRespondedBy(e.target.value)}
                placeholder="Enter your name"
              />
            </div>

            <div>
              <Label htmlFor="response">Response Message *</Label>
              <Textarea
                id="response"
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                placeholder="Type your response here..."
                rows={6}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setIsResponseOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={submitResponse} disabled={updating}>
                {updating ? 'Submitting...' : 'Submit Response'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
