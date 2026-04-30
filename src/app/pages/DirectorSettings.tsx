import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export default function DirectorSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    announcement: '',
    phone: '',
    email: '',
    address: '',
    hours: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      console.error('Error loading settings:', error);
    }

    if (data) {
      setSettings({
        announcement: data.announcement || '',
        phone: data.phone || '',
        email: data.email || '',
        address: data.address || '',
        hours: data.hours || ''
      });
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);

    const { error } = await supabase
      .from('site_settings')
      .upsert({
        id: 1,
        announcement: settings.announcement,
        phone: settings.phone,
        email: settings.email,
        address: settings.address,
        hours: settings.hours
      });

    if (error) {
      alert('Error saving settings');
      console.error(error);
    } else {
      alert('Settings saved successfully');
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="p-6 text-[#4B4B55]">Loading settings...</div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-[#4B4B55] mb-6">
        Center Settings
      </h1>

      <div className="bg-white shadow rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#4B4B55] mb-1">
            Announcement
          </label>
          <textarea
            name="announcement"
            value={settings.announcement}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            rows={3}
            placeholder="Example: Lunch service will be closed Monday"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#4B4B55] mb-1">
            Phone
          </label>
          <input
            type="text"
            name="phone"
            value={settings.phone}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#4B4B55] mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={settings.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#4B4B55] mb-1">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={settings.address}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#4B4B55] mb-1">
            Hours
          </label>
          <input
            type="text"
            name="hours"
            value={settings.hours}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#8CC63F] hover:bg-[#5E8F25] text-white px-6 py-2 rounded-xl font-medium"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
