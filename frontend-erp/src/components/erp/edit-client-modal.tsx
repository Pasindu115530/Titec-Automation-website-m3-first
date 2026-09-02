import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { clientService, Client } from '@/services/clientService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientUpdated: (client: Client) => void;
  client: Client | null;
}

export function EditClientModal({ isOpen, onClose, onClientUpdated, client }: EditClientModalProps) {
  const [formData, setFormData] = useState<Partial<Client>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (client) {
      setFormData(client);
    }
  }, [client]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client) return;
    
    setIsSubmitting(true);
    try {
      const response = await clientService.updateClient(client.id, formData);
      toast.success('Client updated successfully');
      onClientUpdated(response.client);
      onClose();
    } catch (error) {
      console.error('Failed to update client', error);
      toast.error('Failed to update client');
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

  if (!client) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-[#111827] text-white border-white/10">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Client Type</Label>
                <Select value={formData.client_type} onValueChange={(val) => handleSelectChange('client_type', val)}>
                  <SelectTrigger className="bg-[#1f2937] border-white/10">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1f2937] text-white border-white/10">
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="individual">Individual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.client_type === 'business' ? (
                <div className="space-y-2">
                  <Label>Company Name *</Label>
                  <Input name="company_name" value={formData.company_name || ''} onChange={handleChange} required className="bg-[#1f2937] border-white/10" />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>NIC</Label>
                  <Input name="nic" value={formData.nic || ''} onChange={handleChange} className="bg-[#1f2937] border-white/10" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Contact Person *</Label>
                <Input name="contact_person" value={formData.contact_person || ''} onChange={handleChange} required className="bg-[#1f2937] border-white/10" />
              </div>
              <div className="space-y-2">
                <Label>Phone *</Label>
                <Input name="phone" value={formData.phone || ''} onChange={handleChange} required className="bg-[#1f2937] border-white/10" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input name="email" type="email" value={formData.email || ''} onChange={handleChange} className="bg-[#1f2937] border-white/10" />
              </div>
              <div className="space-y-2">
                <Label>Tax ID / TIN</Label>
                <Input name="tax_id" value={formData.tax_id || ''} onChange={handleChange} className="bg-[#1f2937] border-white/10" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Address</Label>
              <Input name="address" value={formData.address || ''} onChange={handleChange} className="bg-[#1f2937] border-white/10" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input name="city" value={formData.city || ''} onChange={handleChange} className="bg-[#1f2937] border-white/10" />
              </div>
              <div className="space-y-2">
                <Label>District</Label>
                <Input name="district" value={formData.district || ''} onChange={handleChange} className="bg-[#1f2937] border-white/10" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea name="notes" value={formData.notes || ''} onChange={handleChange} className="bg-[#1f2937] border-white/10 h-20" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="border-white/10 hover:bg-white/5">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isSubmitting ? 'Saving...' : 'Update Client'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
