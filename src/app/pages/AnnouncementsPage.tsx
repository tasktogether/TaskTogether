import React, { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function AnnouncementsPage() {
  const navigate = useNavigate();

  const [announcement, setAnnouncement] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);

    const { error } = await supabase.from('announcements').insert({
      message: announcement,
      expires_at: selectedDate,
    });

    if (error) {
      alert('Error saving announcement');
      console.error(error);
    } else {
      alert('Announcement saved');
      navigate('/director/dashboard');
    }

    setSaving(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-[#4B4B55] mb-6">
        Announcements
      </h1>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <p className="text-sm text-[#4B4B55] font-medium">
          This message will be shown to all volunteers on the homepage.
        </p>

        <textarea
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
          rows={5}
          className="w-full border border-slate-300 rounded-lg p-3"
          placeholder="Example: Volunteers are needed this Friday for the lunch program. Please sign up if available."
        />

        <label className="text-sm text-slate-600">
          Expiration Date (announcement will disappear after this date)
        </label>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 rounded-lg"
        />

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-[#8CC63F] hover:bg-[#5E8F25] text-white px-6 py-2 rounded-xl font-medium"
        >
          {saving ? 'Saving...' : 'Save Announcement'}
        </button>
      </div>
    </div>
  );
}
