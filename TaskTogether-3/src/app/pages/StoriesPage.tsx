import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, BookOpen, Star, Search, X, Calendar, Tag } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { useStories, Story } from '../context/StoriesContext';

const TAG_COLORS: Record<string, string> = {
  'Tech Help': 'bg-violet-100 text-violet-700',
  Connection: 'bg-blue-100 text-blue-700',
  Gardening: 'bg-green-100 text-green-700',
  Friendship: 'bg-pink-100 text-pink-700',
  'Grocery Help': 'bg-orange-100 text-orange-700',
  'Made Someone Smile': 'bg-yellow-100 text-yellow-700',
  Reading: 'bg-teal-100 text-teal-700',
  'Shared Stories': 'bg-indigo-100 text-indigo-700',
  Communication: 'bg-rose-100 text-rose-700',
  Healing: 'bg-lime-100 text-lime-700',
  Games: 'bg-cyan-100 text-cyan-700',
  Fun: 'bg-amber-100 text-amber-700',
};

function tagColor(tag: string) {
  return TAG_COLORS[tag] ?? 'bg-slate-100 text-slate-600';
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? 's' : ''} ago`;
}

function StoryCard({ story, onClick }: { story: Story; onClick: () => void }) {
  const isExample = story.id.startsWith('example-');
  
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.35 }}
      className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-shadow overflow-hidden cursor-pointer group"
      onClick={onClick}
    >
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-violet-100 to-pink-100">
        {story.coverImage ? (
          <img
            src={story.coverImage}
            alt={story.taskTitle}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Heart className="w-12 h-12 text-violet-300 fill-violet-200" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {isExample && (
          <div className="absolute top-3 right-3">
            <span className="bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded-full shadow-md">
              EXAMPLE
            </span>
          </div>
        )}
        <div className="absolute bottom-3 left-4 flex flex-wrap gap-1">
          {story.tags?.slice(0, 2).map(tag => (
            <span
              key={tag}
              className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/90 text-slate-700"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {story.volunteerName.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-sm text-slate-800">{story.volunteerName}</p>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar size={10} /> {timeAgo(story.submittedAt)}
            </p>
          </div>
        </div>

        <h3 className="font-bold text-slate-800 mb-2 group-hover:text-violet-700 transition-colors">
          {story.taskTitle}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
          "{story.reflection}"
        </p>

        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
          <span className="text-xs font-bold text-violet-600 flex items-center gap-1">
            <BookOpen size={12} /> Read Story
          </span>
          <Heart size={14} className="text-pink-400 fill-pink-200" />
        </div>
      </div>
    </motion.article>
  );
}

function StoryModal({ story, onClose }: { story: Story; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Hero */}
        <div className="relative h-64">
          {story.coverImage ? (
            <img
              src={story.coverImage}
              alt={story.taskTitle}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-violet-200 to-pink-200 flex items-center justify-center">
              <Heart className="w-16 h-16 text-violet-400 fill-violet-300" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-slate-600 p-2 rounded-full shadow-md hover:bg-white transition-colors"
          >
            <X size={18} />
          </button>
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex flex-wrap gap-1 mb-2">
              {story.tags?.map(tag => (
                <span
                  key={tag}
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${tagColor(tag)}`}
                >
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-white font-bold text-2xl drop-shadow">{story.taskTitle}</h2>
          </div>
        </div>

        {/* Body */}
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 flex items-center justify-center text-white font-bold text-lg">
              {story.volunteerName.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-slate-800">{story.volunteerName}</p>
              <p className="text-sm text-slate-400 flex items-center gap-1">
                <Calendar size={12} /> {timeAgo(story.submittedAt)} · TaskTogether Volunteer
              </p>
            </div>
            <div className="ml-auto">
              <Star size={20} className="text-yellow-400 fill-yellow-400" />
            </div>
          </div>

          <blockquote className="relative pl-6 border-l-4 border-violet-200">
            <p className="text-slate-700 text-lg leading-relaxed italic">
              "{story.reflection}"
            </p>
          </blockquote>

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-2 text-sm text-slate-400">
            <Heart size={14} className="fill-pink-300 text-pink-400" />
            <span>This story was shared with permission by the volunteer.</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function StoriesPage() {
  const { approvedStories } = useStories();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  // Gather all unique tags from approved stories
  const allTags = Array.from(
    new Set(approvedStories.flatMap(s => s.tags ?? []))
  );

  const filtered = approvedStories.filter(s => {
    const matchesSearch =
      !searchQuery ||
      s.taskTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.reflection.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.volunteerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || s.tags?.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar />

      {/* Hero Banner */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-violet-50 via-pink-50 to-orange-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-200/30 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Heart size={16} className="fill-pink-700" />
              Real Volunteers, Real Impact
            </div>
            <h1 className="text-5xl md:text-6xl font-fredoka font-bold text-slate-900 mb-4">
              Stories of <span className="text-violet-600">Kindness</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Heartfelt reflections from our teen volunteers — shared with their permission.
              Every story is a reminder that small acts of kindness change the world.
            </p>
          </motion.div>

          {/* Stats Strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center gap-8 mt-10"
          >
            <div className="text-center">
              <p className="text-3xl font-bold font-fredoka text-violet-700">{approvedStories.length}</p>
              <p className="text-sm text-slate-500 font-medium">Stories Published</p>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div className="text-center">
              <p className="text-3xl font-bold font-fredoka text-pink-600">{allTags.length}</p>
              <p className="text-sm text-slate-500 font-medium">Unique Experiences</p>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div className="text-center">
              <p className="text-3xl font-bold font-fredoka text-orange-500">100%</p>
              <p className="text-sm text-slate-500 font-medium">Volunteer Written</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="sticky top-24 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm py-4 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search stories..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-200 text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Tag Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-hide">
            <Tag size={14} className="text-slate-400 shrink-0" />
            <button
              onClick={() => setSelectedTag(null)}
              className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                selectedTag === null
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                  selectedTag === tag
                    ? 'bg-violet-600 text-white'
                    : `${tagColor(tag)} hover:opacity-80`
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stories Grid */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-slate-500 font-medium">No stories match your search.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedTag(null); }}
              className="mt-4 text-violet-600 font-bold text-sm hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((story, i) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
              >
                <StoryCard story={story} onClick={() => setSelectedStory(story)} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Call to Action for Volunteers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-3xl p-10 text-center text-white shadow-xl shadow-violet-200"
        >
          <div className="text-4xl mb-4">✨</div>
          <h2 className="text-3xl font-fredoka font-bold mb-3">Have a Story to Share?</h2>
          <p className="text-violet-100 max-w-xl mx-auto mb-6">
            After completing a task, you can opt in to share your reflection with the community.
            Your story might inspire the next great volunteer!
          </p>
          <a
            href="/login"
            className="inline-block bg-white text-violet-700 font-bold px-8 py-3 rounded-full shadow-md hover:shadow-lg hover:bg-violet-50 transition-all"
          >
            Share Your Story Now →
          </a>
        </motion.div>
      </main>

      {/* Story Detail Modal */}
      <AnimatePresence>
        {selectedStory && (
          <StoryModal story={selectedStory} onClose={() => setSelectedStory(null)} />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}