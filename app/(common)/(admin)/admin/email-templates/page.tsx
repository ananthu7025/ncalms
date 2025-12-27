import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Mail,
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { getEmailTemplates, getEmailTemplateStats } from '@/lib/actions/email-templates';
import { EmailTemplatesTable } from '@/components/admin/email-templates/EmailTemplatesTable';
import { EmailTemplateDialog } from '@/components/admin/email-templates/EmailTemplateDialog';

export default async function AdminEmailTemplatesPage() {
  // Fetch data in parallel
  const [templatesResult, statsResult] = await Promise.all([
    getEmailTemplates(),
    getEmailTemplateStats(),
  ]);

  const templates = templatesResult.success && templatesResult.data ? templatesResult.data : [];
  const stats = statsResult.success && statsResult.data ? statsResult.data : {
    totalTemplates: 0,
    configuredTemplates: 0,
    missingTemplates: 4,
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Email Templates</h1>
          <p className="text-muted-foreground mt-1">
            Manage dynamic email templates for automated communications
          </p>
        </div>
        <EmailTemplateDialog />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Templates</p>
                <p className="text-2xl font-bold">{stats.totalTemplates}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Configured</p>
                <p className="text-2xl font-bold">{stats.configuredTemplates}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Missing Standard</p>
                <p className="text-2xl font-bold">{stats.missingTemplates}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Email Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <EmailTemplatesTable templates={templates} />
        </CardContent>
      </Card>

    </div>
  );
}
