import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { clientService, Client } from '@/services/clientService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientAdded: (client: Client) => void;
}

export function AddClientModal({ isOpen, onClose, onClientAdded }: AddClientModalProps) {
  const [formData, setFormData] = useState<Partial<Client>>({
    client_type: 'business',
    contact_person: '',
    company_name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: '',
    tax_id: '',
    nic: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await clientService.createClient(formData);
      toast.success('Client added successfully');
      onClientAdded(response as Client);
      onClose();
      // Reset form
      setFormData({
        client_type: 'business',
        contact_person: '',
        company_name: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        district: '',
        tax_id: '',
        nic: '',
        notes: '',
      });
    } catch (error) {
      console.error('Failed to create client', error);
      toast.error('Failed to create client');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white/95 backdrop-blur-xl rounded-[32px] sm:rounded-[32px] p-6 border border-white/80 shadow-[0_24px_60px_rgba(0,0,0,0.15)] text-neutral-900">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-neutral-900 tracking-tight">Add New Client</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-neutral-700">Client Type</Label>
                <Select value={formData.client_type} onValueChange={(val) => handleSelectChange('client_type', val)}>
                  <SelectTrigger className="bg-neutral-50 border-neutral-200 text-neutral-900 rounded-xl focus:bg-amber-50 focus:border-amber-200 focus:ring-2 focus:ring-amber-200 focus:ring-offset-0 focus:outline-none transition-colors">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-neutral-900 border-neutral-200 rounded-xl shadow-xl">
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="individual">Individual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.client_type === 'business' ? (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-neutral-700">Company Name *</Label>
                  <Input name="company_name" value={formData.company_name} onChange={handleChange} required className="bg-neutral-50 border-neutral-200 text-neutral-900 rounded-xl focus:bg-amber-50 focus:border-amber-200 focus-visible:border-amber-200 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-colors" />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-neutral-700">NIC</Label>
                  <Input name="nic" value={formData.nic} onChange={handleChange} className="bg-neutral-50 border-neutral-200 text-neutral-900 rounded-xl focus:bg-amber-50 focus:border-amber-200 focus-visible:border-amber-200 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-colors" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-neutral-700">Contact Person *</Label>
                <Input name="contact_person" value={formData.contact_person} onChange={handleChange} required className="bg-neutral-50 border-neutral-200 text-neutral-900 rounded-xl focus:bg-amber-50 focus:border-amber-200 focus-visible:border-amber-200 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-colors" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-neutral-700">Phone *</Label>
                <Input name="phone" value={formData.phone} onChange={handleChange} required className="bg-neutral-50 border-neutral-200 text-neutral-900 rounded-xl focus:bg-amber-50 focus:border-amber-200 focus-visible:border-amber-200 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-neutral-700">Email</Label>
                <Input name="email" type="email" value={formData.email} onChange={handleChange} className="bg-neutral-50 border-neutral-200 text-neutral-900 rounded-xl focus:bg-amber-50 focus:border-amber-200 focus-visible:border-amber-200 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-colors" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-neutral-700">Tax ID / TIN</Label>
                <Input name="tax_id" value={formData.tax_id} onChange={handleChange} className="bg-neutral-50 border-neutral-200 text-neutral-900 rounded-xl focus:bg-amber-50 focus:border-amber-200 focus-visible:border-amber-200 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-colors" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-neutral-700">Address</Label>
              <Input name="address" value={formData.address} onChange={handleChange} className="bg-neutral-50 border-neutral-200 text-neutral-900 rounded-xl focus:bg-amber-50 focus:border-amber-200 focus-visible:border-amber-200 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-colors" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-neutral-700">City</Label>
                <Input name="city" value={formData.city} onChange={handleChange} className="bg-neutral-50 border-neutral-200 text-neutral-900 rounded-xl focus:bg-amber-50 focus:border-amber-200 focus-visible:border-amber-200 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-colors" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-neutral-700">District</Label>
                <Input name="district" value={formData.district} onChange={handleChange} className="bg-neutral-50 border-neutral-200 text-neutral-900 rounded-xl focus:bg-amber-50 focus:border-amber-200 focus-visible:border-amber-200 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-colors" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-neutral-700">Notes</Label>
              <Textarea name="notes" value={formData.notes} onChange={handleChange} className="bg-neutral-50 border-neutral-200 text-neutral-900 rounded-xl focus:bg-amber-50 focus:border-amber-200 focus-visible:border-amber-200 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-0 focus:outline-none transition-colors h-20" />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="bg-rose-100 hover:bg-rose-200 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 dark:text-rose-300 dark:border-rose-900/40 rounded-xl font-medium cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-sky-300 hover:bg-sky-400 text-neutral-950 font-bold border border-sky-200 shadow-[0_8px_20px_rgba(125,211,252,0.35)] dark:bg-gradient-to-r dark:from-blue-600 dark:to-indigo-600 dark:hover:from-blue-500 dark:hover:to-indigo-500 dark:text-white dark:border-blue-400/40 rounded-xl px-5 transition-all cursor-pointer">
              {isSubmitting ? 'Saving...' : 'Save Client'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
