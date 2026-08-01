import React, { useState } from 'react';
import { StorageEngine } from '../lib/storage';
import { EventItem, NewsAnnouncement } from '../types';
import { Calendar, Bell, MapPin, Clock, Plus, X } from 'lucide-react';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>(() => StorageEngine.getEvents());
  const [news, setNews] = useState<NewsAnnouncement[]>(() => StorageEngine.getNews());
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [type, setType] = useState<'event' | 'news'>('event');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [timeStr, setTimeStr] = useState('प्रातः 10:00 बजे से');
  const [locationStr, setLocationStr] = useState('शोध संस्थान सभागार, मुलताई');
  const [categoryStr, setCategoryStr] = useState('राष्ट्रीय संगोष्ठी');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    if (type === 'event') {
      const newEvt: EventItem = {
        id: `evt-${Date.now()}`,
        title,
        description,
        date: dateStr || '15 अगस्त 2026',
        time: timeStr,
        location: locationStr,
        image: imageUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
        isUpcoming: true
      };
      StorageEngine.saveEvent(newEvt);
      setEvents(StorageEngine.getEvents());
      alert('नया कार्यक्रम सफलतापूर्वक जोड़ा गया!');
    } else {
      const newNews: NewsAnnouncement = {
        id: `news-${Date.now()}`,
        title,
        summary: description.slice(0, 80) + '...',
        content: description,
        date: dateStr || new Date().toLocaleDateString('hi-IN'),
        category: (categoryStr as any) || 'Sansthan'
      };
      StorageEngine.saveNews(newNews);
      setNews(StorageEngine.getNews());
      alert('नई सूचना/प्रेस विज्ञप्ति जारी की गई!');
    }

    setShowAddModal(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="bg-stone-900 text-stone-100 p-8 sm:p-10 rounded-2xl border border-amber-500/30 flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Calendar className="w-4 h-4" />
            <span>अकादमिक गतिविधियाँ</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-amber-100">
            संगोष्ठी, कार्यक्रम एवं आधिकारिक सूचनाएँ
          </h1>
          <p className="text-sm text-stone-300 font-serif max-w-2xl">
            माँ ताप्ती शोध संस्थान द्वारा आयोजित राष्ट्रीय संगोष्ठियों, ताप्ती महोत्सव, शोध पत्र आमंत्रण एवं संस्थान की नवीनतम सूचनाएँ।
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl flex items-center gap-2 shadow-lg transition text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>नया कार्यक्रम / सूचना जोड़ें</span>
        </button>
      </div>

      {/* Events */}
      <div className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-stone-900 dark:text-amber-100 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-amber-600" />
          <span>आगामी संगोष्ठी एवं कार्यक्रम</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="bg-amber-50/50 dark:bg-stone-900 p-6 sm:p-8 rounded-2xl border border-amber-200/80 dark:border-stone-800 space-y-4 shadow-sm"
            >
              <div className="w-full h-44 rounded-xl overflow-hidden bg-stone-950 mb-3">
                <img src={evt.image} alt={evt.title} className="w-full h-full object-cover" />
              </div>

              <div className="space-y-2">
                <span className="px-2.5 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold rounded">
                  {evt.date}
                </span>

                <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-amber-100">
                  {evt.title}
                </h3>

                <p className="text-xs text-stone-600 dark:text-stone-300 font-serif leading-relaxed">
                  {evt.description}
                </p>

                <div className="pt-2 text-xs font-sans text-stone-500 space-y-1">
                  <p className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-600" /> {evt.time}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-amber-600" /> {evt.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* News & Announcements */}
      <div className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-stone-900 dark:text-amber-100 flex items-center gap-2">
          <Bell className="w-6 h-6 text-amber-600" />
          <span>प्रेस विज्ञप्ति एवं सूचनाएँ</span>
        </h2>

        <div className="space-y-4">
          {news.map((item) => (
            <div
              key={item.id}
              className="bg-amber-50/50 dark:bg-stone-900 p-6 rounded-2xl border border-amber-200/80 dark:border-stone-800 space-y-2"
            >
              <div className="flex items-center justify-between text-xs font-mono text-amber-800 dark:text-amber-400">
                <span className="px-2 py-0.5 bg-red-950 text-amber-200 rounded font-bold">
                  {item.category}
                </span>
                <span>{item.date}</span>
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-amber-100">
                {item.title}
              </h3>
              <p className="text-xs text-stone-700 dark:text-stone-300 font-serif leading-relaxed">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-lg p-6 space-y-6 text-stone-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <h3 className="text-lg font-serif font-bold text-amber-200">नया कार्यक्रम या सूचना प्रविष्टि जोड़ें</h3>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4 text-xs">
              <div>
                <label className="block text-amber-400 font-bold mb-1">प्रकार (Type)</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="evtType"
                      checked={type === 'event'}
                      onChange={() => setType('event')}
                      className="accent-amber-500"
                    />
                    <span>संगोष्ठी / कार्यक्रम (Event)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="evtType"
                      checked={type === 'news'}
                      onChange={() => setType('news')}
                      className="accent-amber-500"
                    />
                    <span>प्रेस विज्ञप्ति / सूचना (Announcement)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-amber-400 font-bold mb-1">शीर्षक (Title) *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="कार्यक्रम का नाम या सूचना शीर्षक"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-amber-400 font-bold mb-1">विवरण (Description) *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="मुख्य विवरण, मुख्य वक्ता या निर्देश..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              {type === 'event' ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-amber-400 font-bold mb-1">दिनांक (Date)</label>
                      <input
                        type="text"
                        value={dateStr}
                        onChange={(e) => setDateStr(e.target.value)}
                        placeholder="उदा. 25 सितम्बर 2026"
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-amber-400 font-bold mb-1">समय (Time)</label>
                      <input
                        type="text"
                        value={timeStr}
                        onChange={(e) => setTimeStr(e.target.value)}
                        placeholder="प्रातः 10:00 बजे से"
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-amber-400 font-bold mb-1">स्थान (Location)</label>
                    <input
                      type="text"
                      value={locationStr}
                      onChange={(e) => setLocationStr(e.target.value)}
                      placeholder="सभागार का नाम"
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-amber-400 font-bold mb-1">श्रेणी (Category)</label>
                  <input
                    type="text"
                    value={categoryStr}
                    onChange={(e) => setCategoryStr(e.target.value)}
                    placeholder="उदा. शोध पत्र आमंत्रण / प्रेस विज्ञप्ति"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl font-bold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 rounded-xl font-bold"
                >
                  सुरक्षित करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
