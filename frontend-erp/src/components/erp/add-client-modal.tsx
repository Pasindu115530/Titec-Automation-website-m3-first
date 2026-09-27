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
      <DialogContent className="sm:max-w-[600px] bg-white text-neutral-900 border border-neutral-200/90 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.15)] p-6">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-neutral-900 tracking-tight">Add New Client</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-neutral-700">Client Type</Label>
                <Select value={formData.client_type} onValueChange={(val) => handleSelectChange('client_type', val)}>
                  <SelectTrigger className="bg-neutral-50 border-neutral-200 text-neutral-900 rounded-xl focus:bg-white">
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
                  <Input name="company_name" value={formData.company_name} onChange={handleChange} required className="bg-neutral-50 border-neutral-200 text-neutral-900 rounded-xl focus:bg-white" />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-neutral-700">NIC</Label>
                  <Input name="nic" value={formData.nic} onChange={handleChange} className="bg-neutral-50 border-neutral-200 text-neutral-900 rounded-xl focus:bg-white" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-neutral-700">Contact Person *</Label>
                <Input name="contact_person" value={formData.contact_person} onChange={handleChange} required className="bg-neutral-50 border-neutral-200 text-neutral-900 rounded-xl focus:bg-white" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-neutral-700">Phone *</Label>
                <Input name="phone" value={formData.phone} onChange={handleChange} required className="bg-neutral-50 border-neutral-200 text-neutral-900 rounded-xl focus:bg-white" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-neutral-700">Email</Label>
                <Input name="email" type="email" value={formData.email} onChange={handleChange} className="bg-neutral-50 border-neutral-200 text-neutral-900 rounded-xl focus:bg-white" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-neutral-700">Tax ID / TIN</Label>
                <Input name="tax_id" value={formData.tax_id} onChange={handleChange} className="bg-neutral-50 border-neutral-200 text-neutral-900 rounded-xl focus:bg-white" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-neutral-700">Address</Label>
              <Input name="address" value={formData.address} onChange={handleChange} className="bg-neutral-50 border-neutral-200 text-neutral-900 rounded-xl focus:bg-white" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-neutral-700">City</Label>
                <Input name="city" value={formData.city} onChange={handleChange} className="bg-neutral-50 border-neutral-200 text-neutral-900 rounded-xl focus:bg-white" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-neutral-700">District</Label>
                <Input name="district" value={formData.district} onChange={handleChange} className="bg-neutral-50 border-neutral-200 text-neutral-900 rounded-xl focus:bg-white" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-neutral-700">Notes</Label>
              <Textarea name="notes" value={formData.notes} onChange={handleChange} className="bg-neutral-50 border-neutral-200 text-neutral-900 rounded-xl focus:bg-white h-20" />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="border-neutral-200 text-neutral-700 hover:bg-neutral-100 rounded-xl font-medium">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-semibold shadow-xs">
              {isSubmitting ? 'Saving...' : 'Save Client'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
