import React, { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Client, clientService } from '@/services/clientService';
import { MapPin, Phone, Mail, Building2, User, CreditCard, Briefcase, FileText, Activity } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface ClientDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
}

export function ClientDetailDrawer({ isOpen, onClose, client }: ClientDetailDrawerProps) {
  const [history, setHistory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (client && isOpen) {
      loadHistory();
    }
  }, [client, isOpen]);

  const loadHistory = async () => {
    if (!client) return;
    setIsLoading(true);
    try {
      const data = await clientService.getClientHistory(client.id);
      setHistory(data);
    } catch (error) {
      console.error('Failed to load history', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!client) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl bg-[#111827] border-l border-white/10 text-white overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold text-white flex items-center gap-2">
            {client.client_type === 'business' ? <Building2 className="h-6 w-6 text-indigo-400" /> : <User className="h-6 w-6 text-emerald-400" />}
            {client.client_type === 'business' ? client.company_name : client.contact_person}
          </SheetTitle>
          <SheetDescription className="text-gray-400 flex flex-col gap-1 mt-2">
            <span className="flex items-center gap-2">
              <Badge variant="outline" className="border-white/20 text-xs">
                {client.client_type === 'business' ? 'Business' : 'Individual'}
              </Badge>
              {client.tax_id && <span className="text-xs">TIN: {client.tax_id}</span>}
              {client.nic && <span className="text-xs">NIC: {client.nic}</span>}
            </span>
            <span className="flex items-center gap-2 mt-2">
              <MapPin className="h-4 w-4" /> 
              {client.address ? `${client.address}, ${client.city || ''} ${client.district || ''}` : 'No address provided'}
            </span>
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> {client.phone} {client.secondary_phone && ` / ${client.secondary_phone}`}
            </span>
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> {client.email || 'No email provided'}
            </span>
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-[#1f2937]">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#374151] data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="invoices" className="data-[state=active]:bg-[#374151] data-[state=active]:text-white">Invoices</TabsTrigger>
            <TabsTrigger value="installations" className="data-[state=active]:bg-[#374151] data-[state=active]:text-white">Installs</TabsTrigger>
            <TabsTrigger value="service" className="data-[state=active]:bg-[#374151] data-[state=active]:text-white">Service</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-4 space-y-4">
            {isLoading ? (
              <div className="animate-pulse flex flex-col gap-4">
                <div className="h-24 bg-white/5 rounded-md"></div>
                <div className="h-24 bg-white/5 rounded-md"></div>
              </div>
            ) : history ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#1f2937] p-4 rounded-lg border border-white/5 flex flex-col items-center justify-center text-center">
                    <span className="text-gray-400 text-sm mb-1">Total Revenue</span>
                    <span className="text-2xl font-bold text-white flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-green-400" />
                      Rs. {history.total_revenue?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="bg-[#1f2937] p-4 rounded-lg border border-white/5 flex flex-col items-center justify-center text-center">
                    <span className="text-gray-400 text-sm mb-1">Active Warranties</span>
                    <span className="text-2xl font-bold text-white flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-400" />
                      {history.active_warranties || 0}
                    </span>
                  </div>
                </div>

                {client.notes && (
                  <div className="bg-[#1f2937] p-4 rounded-lg border border-white/5">
                    <h4 className="font-semibold text-sm text-gray-300 mb-2">Notes</h4>
                    <p className="text-sm text-gray-400 whitespace-pre-wrap">{client.notes}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="bg-[#1f2937] p-3 rounded-lg text-center">
                    <div className="text-xl font-bold text-white">{history.invoices?.length || 0}</div>
                    <div className="text-xs text-gray-500">Invoices</div>
                  </div>
                  <div className="bg-[#1f2937] p-3 rounded-lg text-center">
                    <div className="text-xl font-bold text-white">{history.installations?.length || 0}</div>
                    <div className="text-xs text-gray-500">Installations</div>
                  </div>
                  <div className="bg-[#1f2937] p-3 rounded-lg text-center">
                    <div className="text-xl font-bold text-white">{history.service_logs?.length || 0}</div>
                    <div className="text-xs text-gray-500">Service Logs</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 py-8">No history available</div>
            )}
          </TabsContent>

          <TabsContent value="invoices" className="mt-4">
            {history?.invoices?.length > 0 ? (
              <div className="space-y-3">
                {history.invoices.map((inv: any) => (
                  <div key={inv.id} className="bg-[#1f2937] p-3 rounded-lg border border-white/5 flex justify-between items-center">
                    <div>
                      <div className="font-medium text-blue-400">{inv.invoice_number}</div>
                      <div className="text-xs text-gray-400">{new Date(inv.created_at).toLocaleDateString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">Rs. {Number(inv.grand_total).toLocaleString()}</div>
                      <Badge variant="outline" className={`text-[10px] uppercase tracking-wider ${inv.status === 'paid' ? 'text-green-400 border-green-400/30' : inv.status === 'confirmed' ? 'text-blue-400 border-blue-400/30' : 'text-gray-400 border-gray-400/30'}`}>
                        {inv.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">No invoices found for this client.</div>
            )}
          </TabsContent>

          <TabsContent value="installations" className="mt-4">
             {history?.installations?.length > 0 ? (
              <div className="space-y-3">
                {history.installations.map((inst: any) => (
                  <div key={inst.id} className="bg-[#1f2937] p-3 rounded-lg border border-white/5 flex justify-between items-center">
                    <div>
                      <div className="font-medium">{inst.title}</div>
                      <div className="text-xs text-gray-400">{inst.reference_number} • {new Date(inst.scheduled_date || inst.created_at).toLocaleDateString()}</div>
                    </div>
                    <Badge variant="outline" className="text-amber-400 border-amber-400/30 text-xs capitalize">
                      {inst.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">No installations found for this client.</div>
            )}
          </TabsContent>

          <TabsContent value="service" className="mt-4">
             {history?.service_logs?.length > 0 ? (
              <div className="space-y-3">
                {history.service_logs.map((log: any) => (
                  <div key={log.id} className="bg-[#1f2937] p-3 rounded-lg border border-white/5">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium">{log.title}</div>
                      <Badge variant="outline" className="text-xs">
                        {log.service_type}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-400 mb-2">{log.description}</div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{new Date(log.service_date).toLocaleDateString()}</span>
                      <span className={log.is_under_warranty ? "text-green-400" : "text-gray-400"}>
                        {log.is_under_warranty ? 'Under Warranty' : `Charge: Rs. ${log.service_charge}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">No service logs found for this client.</div>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
