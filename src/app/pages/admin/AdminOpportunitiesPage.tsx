import { useState } from 'react';
import {
  Plus, Edit2, Trash2, MapPin, Clock, Users, Tag,
  X, Check, AlertTriangle
} from 'lucide-react';
import { useApp, Opportunity } from '../../context/AppContext';

const CATEGORIES = ['Errands', 'Technology', 'Outdoor', 'Companionship', 'Transportation', 'Other'];

const EMPTY_FORM = {
  title: '', description: '', location: '',
  timeCommitment: '', date: '', category: 'Errands', volunteerLimit: 5,
};

function OpportunityForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<typeof EMPTY_FORM>;
  onSave: (data: typeof EMPTY_FORM) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initial });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.location.trim()) e.location = 'Location is required';
    if (!form.timeCommitment.trim()) e.timeCommitment = 'Time commitment is required';
    if (!form.date) e.date = 'Date is required';
    if (!form.volunteerLimit || form.volunteerLimit < 1) e.volunteerLimit = 'Must be at least 1';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSave(form);
  };

  return (
    <div style={{
      background: '#F5F3FF', border: '2px solid #E9D5FF',
      borderRadius: '20px', padding: '28px', marginBottom: '24px'
    }} className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '22px', fontWeight: 600, color: '#1e1b4b' }}>
          {initial?.title ? '✏️ Edit Opportunity' : '➕ New Opportunity'}
        </h3>
        <button onClick={onCancel} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Title */}
        <div style={{ gridColumn: 'span 2' }}>
          <label style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Title *</label>
          <input className="tt-input" placeholder="e.g., Grocery Shopping Helper" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
          {errors.title && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', fontFamily: "'Poppins', sans-serif" }}>{errors.title}</p>}
        </div>

        {/* Description */}
        <div style={{ gridColumn: 'span 2' }}>
          <label style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Description *</label>
          <textarea
            className="tt-input"
            style={{ resize: 'vertical', minHeight: '80px' }}
            placeholder="Describe what volunteers will do..."
            value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
          />
          {errors.description && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', fontFamily: "'Poppins', sans-serif" }}>{errors.description}</p>}
        </div>

        {/* Location */}
        <div>
          <label style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Location *</label>
          <input className="tt-input" placeholder="e.g., Sunrise Senior Center" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
          {errors.location && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', fontFamily: "'Poppins', sans-serif" }}>{errors.location}</p>}
        </div>

        {/* Time Commitment */}
        <div>
          <label style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Time Commitment *</label>
          <input className="tt-input" placeholder="e.g., 2 hrs/week" value={form.timeCommitment} onChange={e => setForm(p => ({ ...p, timeCommitment: e.target.value }))} />
          {errors.timeCommitment && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', fontFamily: "'Poppins', sans-serif" }}>{errors.timeCommitment}</p>}
        </div>

        {/* Date */}
        <div>
          <label style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Start Date *</label>
          <input className="tt-input" type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
          {errors.date && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', fontFamily: "'Poppins', sans-serif" }}>{errors.date}</p>}
        </div>

        {/* Category */}
        <div>
          <label style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Category</label>
          <select
            className="tt-input"
            value={form.category}
            onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Volunteer Limit */}
        <div>
          <label style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>Volunteer Limit *</label>
          <input
            className="tt-input"
            type="number" min={1} max={50}
            value={form.volunteerLimit}
            onChange={e => setForm(p => ({ ...p, volunteerLimit: parseInt(e.target.value) || 1 }))}
          />
          {errors.volunteerLimit && <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', fontFamily: "'Poppins', sans-serif" }}>{errors.volunteerLimit}</p>}
        </div>

        {/* Buttons */}
        <div style={{ gridColumn: 'span 2', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onCancel} className="tt-btn-secondary" style={{ fontSize: '14px', padding: '10px 20px' }}>
            Cancel
          </button>
          <button type="submit" className="tt-btn-primary" style={{ fontSize: '14px', padding: '10px 24px' }}>
            <Check size={15} />
            {initial?.title ? 'Save Changes' : 'Create Opportunity'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AdminOpportunitiesPage() {
  const { opportunities, addOpportunity, updateOpportunity, deleteOpportunity } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleAdd = (data: typeof EMPTY_FORM) => {
    addOpportunity(data);
    setShowForm(false);
  };

  const handleEdit = (id: string, data: typeof EMPTY_FORM) => {
    updateOpportunity(id, data);
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (confirmDelete !== id) { setConfirmDelete(id); return; }
    setDeletingId(id);
    await new Promise(r => setTimeout(r, 400));
    deleteOpportunity(id);
    setDeletingId(null);
    setConfirmDelete(null);
  };

  return (
    <div style={{ padding: '36px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '32px', fontWeight: 600, color: '#1e1b4b', marginBottom: '6px' }}>
            Opportunities Management 💼
          </h1>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', color: '#64748b' }}>
            Create, edit, and manage volunteer opportunities.
          </p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); }}
          className="tt-btn-primary"
          style={{ fontSize: '15px' }}
        >
          <Plus size={18} />
          Add Opportunity
        </button>
      </div>

      {/* Add form */}
      {showForm && !editingId && (
        <OpportunityForm onSave={handleAdd} onCancel={() => setShowForm(false)} />
      )}

      {/* Opportunities list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {opportunities.map(opp => (
          <div key={opp.id}>
            {/* Edit form inline */}
            {editingId === opp.id ? (
              <OpportunityForm
                initial={opp}
                onSave={(data) => handleEdit(opp.id, data)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div className="tt-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '20px', fontWeight: 600, color: '#1e1b4b' }}>
                        {opp.title}
                      </h3>
                      {opp.id.startsWith('example-') && (
                        <span style={{
                          background: '#FCD34D', color: '#78350F', borderRadius: '8px',
                          padding: '2px 10px', fontFamily: "'Poppins', sans-serif",
                          fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px'
                        }}>
                          EXAMPLE
                        </span>
                      )}
                      <span style={{
                        background: '#F3E8FF', color: '#6D28D9', borderRadius: '8px',
                        padding: '2px 8px', fontFamily: "'Poppins', sans-serif",
                        fontSize: '11px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px'
                      }}>
                        <Tag size={9} /> {opp.category}
                      </span>
                    </div>

                    <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '14px', color: '#64748b', lineHeight: 1.6, marginBottom: '14px' }}>
                      {opp.description}
                    </p>

                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#334155' }}>
                        <MapPin size={14} color="#6D28D9" /> {opp.location}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#334155' }}>
                        <Clock size={14} color="#6D28D9" /> {opp.timeCommitment}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#334155' }}>
                        <Users size={14} color="#6D28D9" /> {opp.currentVolunteers}/{opp.volunteerLimit} volunteers
                      </span>
                    </div>

                    {/* Capacity bar */}
                    <div style={{ marginTop: '12px', background: '#F1F5F9', borderRadius: '6px', height: '6px', maxWidth: '300px' }}>
                      <div style={{
                        width: `${Math.min(100, (opp.currentVolunteers / opp.volunteerLimit) * 100)}%`,
                        height: '100%', borderRadius: '6px',
                        background: opp.currentVolunteers >= opp.volunteerLimit ? '#EF4444' : 'linear-gradient(90deg, #6D28D9, #8B5CF6)',
                      }} />
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '10px', flexShrink: 0, alignItems: 'flex-start' }}>
                    <button
                      onClick={() => { setEditingId(opp.id); setShowForm(false); setConfirmDelete(null); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        background: '#F5F3FF', border: '1px solid #E9D5FF', borderRadius: '10px',
                        padding: '8px 14px', cursor: 'pointer',
                        fontFamily: "'Poppins', sans-serif", fontSize: '13px', fontWeight: 600, color: '#6D28D9',
                      }}
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
                      {confirmDelete === opp.id && (
                        <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '11px', color: '#EF4444', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <AlertTriangle size={11} /> Confirm?
                        </span>
                      )}
                      <button
                        onClick={() => handleDelete(opp.id)}
                        disabled={deletingId === opp.id}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                          background: confirmDelete === opp.id ? '#EF4444' : '#FFF5F5',
                          border: `1px solid ${confirmDelete === opp.id ? '#EF4444' : '#FED7D7'}`,
                          borderRadius: '10px', padding: '8px 14px', cursor: 'pointer',
                          fontFamily: "'Poppins', sans-serif", fontSize: '13px', fontWeight: 600,
                          color: confirmDelete === opp.id ? '#fff' : '#DC2626',
                          transition: 'all 0.2s ease', opacity: deletingId === opp.id ? 0.6 : 1,
                        }}
                      >
                        <Trash2 size={14} />
                        {deletingId === opp.id ? 'Removing...' : confirmDelete === opp.id ? 'Delete!' : 'Remove'}
                      </button>
                      {confirmDelete === opp.id && (
                        <button onClick={() => setConfirmDelete(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: "'Poppins', sans-serif", fontSize: '11px', color: '#94a3b8' }}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {opportunities.length === 0 && (
        <div className="tt-card" style={{ padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
          <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '24px', fontWeight: 600, color: '#1e1b4b', marginBottom: '8px' }}>
            No opportunities yet
          </h3>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', color: '#94a3b8', marginBottom: '24px' }}>
            Create your first opportunity to get started!
          </p>
          <button onClick={() => setShowForm(true)} className="tt-btn-primary" style={{ fontSize: '15px' }}>
            <Plus size={18} />
            Add First Opportunity
          </button>
        </div>
      )}
    </div>
  );
}