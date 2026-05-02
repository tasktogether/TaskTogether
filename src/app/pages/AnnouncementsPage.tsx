import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase.ts';
import { useNavigate } from 'react-router-dom';

export default function AnnouncementsPage() {
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAnnouncement();
  }, []);

  const fetchAnnouncement = async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('announcement')
      .eq('id', 1)
      .single();

    if (!error && data?.announcement) {
      setAnnouncement(data.announcement);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    const { error } = await supabase
      .from('site_settings')
      .upsert(
        {
          id: 1,
          announcement: announcement
        },
        {
          onConflict: 'id'
        }
      );

    if (error) {
      alert('Error saving announcement');
      console.error(error);
    } else {
      alert('Announcement saved successfully');
    }

    setSaving(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-[#4B4B55] underline"
      >
        ← Back to Opportunities
      </button>

      <h1 className="text-3xl font-bold text-[#4B4B55] mb-6">
        Announcements
      </h1>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <label className="block text-sm font-medium text-[#4B4B55]">
          Volunteer Announcement or Newsletter Message
        </label>

        <textarea
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
          rows={5}
          className="w-full border border-slate-300 rounded-lg p-3"
          placeholder="Example: Volunteers are needed this Friday for the lunch program. Please sign up if available."
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
