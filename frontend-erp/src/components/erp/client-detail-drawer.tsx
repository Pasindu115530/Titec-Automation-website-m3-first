import React, { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Client, clientService } from '@/services/clientService';
import { MapPin, Phone, Mail, Building2, User, CreditCard, Activity } from 'lucide-react';
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
      <SheetContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl bg-white/95 backdrop-blur-xl border-l border-white/80 text-neutral-900 overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold text-neutral-900 flex items-center gap-2.5">
            <div className={`h-10 w-10 rounded-2xl flex items-center justify-center font-bold shrink-0 border border-white/80 shadow-2xs ${
              client.client_type === 'business'
                ? 'bg-[#F1EBFF] text-[#7C3AED]'
                : 'bg-[#E6F9F7] text-[#0D9488]'
            }`}>
              {client.client_type === 'business' ? <Building2 className="h-5 w-5" /> : <User className="h-5 w-5" />}
            </div>
            {client.client_type === 'business' ? (client.company_name || client.contact_person) : client.contact_person}
          </SheetTitle>
          <SheetDescription asChild>
            <div className="text-neutral-600 flex flex-col gap-1.5 mt-3 text-sm">
              <span className="flex items-center gap-2">
                {client.client_type === 'business' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#F1EBFF] text-[#7C3AED] border border-purple-200/60 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
                    Business
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#E6F9F7] text-[#0D9488] border border-teal-200/60 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488]" />
                    Individual
                  </span>
                )}
                {client.tax_id && <span className="text-xs font-semibold bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-lg">TIN: {client.tax_id}</span>}
                {client.nic && <span className="text-xs font-semibold bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-lg">NIC: {client.nic}</span>}
              </span>
              <span className="flex items-center gap-2 mt-1 text-neutral-600">
                <MapPin className="h-4 w-4 text-neutral-400 shrink-0" /> 
                {client.address ? `${client.address}, ${client.city || ''} ${client.district || ''}` : 'No address provided'}
              </span>
              <span className="flex items-center gap-2 text-neutral-600">
                <Phone className="h-4 w-4 text-neutral-400 shrink-0" /> {client.phone} {client.secondary_phone && ` / ${client.secondary_phone}`}
              </span>
              <span className="flex items-center gap-2 text-neutral-600">
                <Mail className="h-4 w-4 text-neutral-400 shrink-0" /> {client.email || 'No email provided'}
              </span>
            </div>
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-neutral-100/90 rounded-2xl p-1 border border-neutral-200/60">
            <TabsTrigger value="overview" className="rounded-xl font-bold text-xs uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-neutral-950 data-[state=active]:shadow-2xs">Overview</TabsTrigger>
            <TabsTrigger value="invoices" className="rounded-xl font-bold text-xs uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-neutral-950 data-[state=active]:shadow-2xs">Invoices</TabsTrigger>
            <TabsTrigger value="installations" className="rounded-xl font-bold text-xs uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-neutral-950 data-[state=active]:shadow-2xs">Installs</TabsTrigger>
            <TabsTrigger value="service" className="rounded-xl font-bold text-xs uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-neutral-950 data-[state=active]:shadow-2xs">Service</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-4 space-y-4">
            {isLoading ? (
              <div className="animate-pulse flex flex-col gap-4">
                <div className="h-24 bg-neutral-100 rounded-2xl"></div>
                <div className="h-24 bg-neutral-100 rounded-2xl"></div>
              </div>
            ) : history ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/80 p-4 rounded-2xl border border-neutral-200/70 shadow-2xs flex flex-col items-center justify-center text-center">
                    <span className="text-neutral-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Revenue</span>
                    <span className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-emerald-500" />
                      Rs. {history.total_revenue?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="bg-white/80 p-4 rounded-2xl border border-neutral-200/70 shadow-2xs flex flex-col items-center justify-center text-center">
                    <span className="text-neutral-500 text-xs font-semibold uppercase tracking-wider mb-1">Active Warranties</span>
                    <span className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
                      <Activity className="h-5 w-5 text-sky-500" />
                      {history.active_warranties || 0}
                    </span>
                  </div>
                </div>

                {client.notes && (
                  <div className="bg-white/80 p-4 rounded-2xl border border-neutral-200/70 shadow-2xs">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-700 mb-1.5">Notes</h4>
                    <p className="text-sm text-neutral-600 whitespace-pre-wrap">{client.notes}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="bg-white/80 p-3 rounded-2xl border border-neutral-200/70 text-center shadow-2xs">
                    <div className="text-xl font-bold text-neutral-900">{history.invoices?.length || 0}</div>
                    <div className="text-xs text-neutral-500 font-medium">Invoices</div>
                  </div>
                  <div className="bg-white/80 p-3 rounded-2xl border border-neutral-200/70 text-center shadow-2xs">
                    <div className="text-xl font-bold text-neutral-900">{history.installations?.length || 0}</div>
                    <div className="text-xs text-neutral-500 font-medium">Installations</div>
                  </div>
                  <div className="bg-white/80 p-3 rounded-2xl border border-neutral-200/70 text-center shadow-2xs">
                    <div className="text-xl font-bold text-neutral-900">{history.service_logs?.length || 0}</div>
                    <div className="text-xs text-neutral-500 font-medium">Service Logs</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-neutral-400 py-8">No history available</div>
            )}
          </TabsContent>

          <TabsContent value="invoices" className="mt-4">
            {history?.invoices?.length > 0 ? (
              <div className="space-y-2.5">
                {history.invoices.map((inv: any) => (
                  <div key={inv.id} className="bg-white/80 p-3.5 rounded-2xl border border-neutral-200/70 shadow-2xs flex justify-between items-center">
                    <div>
                      <div className="font-bold text-neutral-900 text-sm">{inv.invoice_number}</div>
                      <div className="text-xs text-neutral-500">{new Date(inv.created_at).toLocaleDateString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-neutral-900">Rs. {Number(inv.grand_total).toLocaleString()}</div>
                      <Badge variant="outline" className={`text-[10px] uppercase font-bold tracking-wider rounded-lg mt-0.5 ${inv.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : inv.status === 'confirmed' ? 'bg-sky-50 text-sky-700 border-sky-200' : 'bg-neutral-100 text-neutral-600 border-neutral-200'}`}>
                        {inv.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-neutral-400 py-8">No invoices found for this client.</div>
            )}
          </TabsContent>

          <TabsContent value="installations" className="mt-4">
             {history?.installations?.length > 0 ? (
              <div className="space-y-2.5">
                {history.installations.map((inst: any) => (
                  <div key={inst.id} className="bg-white/80 p-3.5 rounded-2xl border border-neutral-200/70 shadow-2xs flex justify-between items-center">
                    <div>
                      <div className="font-bold text-neutral-900 text-sm">{inst.title}</div>
                      <div className="text-xs text-neutral-500">{inst.reference_number} • {new Date(inst.scheduled_date || inst.created_at).toLocaleDateString()}</div>
                    </div>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs font-bold capitalize rounded-lg">
                      {inst.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-neutral-400 py-8">No installations found for this client.</div>
            )}
          </TabsContent>

          <TabsContent value="service" className="mt-4">
             {history?.service_logs?.length > 0 ? (
              <div className="space-y-2.5">
                {history.service_logs.map((log: any) => (
                  <div key={log.id} className="bg-white/80 p-3.5 rounded-2xl border border-neutral-200/70 shadow-2xs">
                    <div className="flex justify-between items-start mb-1.5">
                      <div className="font-bold text-neutral-900 text-sm">{log.title}</div>
                      <Badge variant="outline" className="text-xs rounded-lg bg-neutral-100 text-neutral-700 border-neutral-200">
                        {log.service_type}
                      </Badge>
                    </div>
                    <div className="text-xs text-neutral-600 mb-2">{log.description}</div>
                    <div className="flex justify-between items-center text-xs text-neutral-500 font-medium">
                      <span>{new Date(log.service_date).toLocaleDateString()}</span>
                      <span className={log.is_under_warranty ? "text-emerald-600 font-semibold" : "text-neutral-700"}>
                        {log.is_under_warranty ? 'Under Warranty' : `Charge: Rs. ${log.service_charge}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-neutral-400 py-8">No service logs found for this client.</div>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
