import React from 'react';
import { StorageEngine } from '../lib/storage';
import { Building2, Award, Users, Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';

export const SansthanPage: React.FC = () => {
  const config = StorageEngine.getSiteConfig();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="bg-stone-900 text-stone-100 p-8 sm:p-12 rounded-2xl border border-amber-500/30 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-950 text-amber-300 rounded-full text-xs font-mono border border-amber-500/30">
          <Building2 className="w-4 h-4" />
          <span>स्थापना एवं परिचय</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-amber-100">
          {config.publisherName.hi}
        </h1>
        <p className="text-sm text-amber-400 font-serif">
          {config.publisherName.en}
        </p>
      </div>

      {/* About Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center font-serif">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-stone-900 dark:text-amber-100">
            संस्थान का उद्देश्य एवं ध्येय
          </h2>
          <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
            {config.aboutSansthan.hi}
          </p>
          <ul className="space-y-2 text-xs font-sans text-stone-700 dark:text-stone-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              <span>पवारी (भोयरी) भाषा के संरक्षण हेतु प्रामाणिक शब्दकोश एवं व्याकरण निर्माण</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              <span>परमार-पवार राजवंश के इतिहास तथा सतपुड़ा अंचल का अभिलेखीय अध्ययन</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              <span>द्विवार्षिक पीयर-रिव्यूड शोध पत्रिका का उच्चस्तरीय डिजिटल संपादन</span>
            </li>
          </ul>
        </div>

        <div className="bg-amber-950/80 p-8 rounded-2xl border border-amber-500/30 text-amber-100 space-y-4 shadow-xl">
          <h3 className="text-xl font-serif font-bold text-amber-200">
            पत्रिका कार्यालय एवं संपर्क सूत्र
          </h3>
          <div className="space-y-3 text-xs font-sans">
            <p className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{config.address}</span>
            </p>
            <p className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{config.contactEmail}</span>
            </p>
            <p className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{config.contactPhone}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Editorial Board */}
      <div className="space-y-6">
        <div className="border-b border-amber-200 dark:border-stone-800 pb-3">
          <h2 className="text-2xl font-serif font-bold text-stone-900 dark:text-amber-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-600" />
            <span>संपादकीय मंडल (Editorial Board)</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {config.editorialBoard.map((member) => (
            <div
              key={member.name}
              className="bg-amber-50/50 dark:bg-stone-900 p-6 rounded-2xl border border-amber-200/80 dark:border-stone-800 space-y-2 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-amber-900 text-amber-200 flex items-center justify-center font-serif font-bold text-xl mx-auto border-2 border-amber-500/40">
                {member.name[0]}
              </div>
              <h3 className="text-base font-serif font-bold text-stone-900 dark:text-amber-100 mt-2">
                {member.name}
              </h3>
              <p className="text-xs font-bold text-amber-700 dark:text-amber-400 font-sans">
                {member.role}
              </p>
              <p className="text-xs text-stone-600 dark:text-stone-400 font-serif leading-snug">
                {member.affiliation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
