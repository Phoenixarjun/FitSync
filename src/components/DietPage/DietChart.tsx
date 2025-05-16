import React, { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import PersonalizedDiet from './PersonalizedDiet';
import AIEnhancedDiet from './AIEnhancedDiet';

const nativeOptions = [
  'India', 'China', 'USA', 'UK', 'Germany', 'France', 'Japan', 'Brazil', 'Italy', 'Canada',
  'Australia', 'Russia', 'Mexico', 'South Korea', 'Spain', 'Thailand', 'Turkey', 'Indonesia',
  'Vietnam', 'South Africa', 'Egypt', 'Argentina', 'Nigeria', 'Pakistan', 'Bangladesh',
  'Philippines', 'Malaysia', 'Colombia', 'Poland', 'Ukraine', 'Others'
];

const cuisineOptions = [
  'Home Made', 'Continental', 'Street Food', 'Vegan', 'Vegetarian', 'Keto', 'Paleo',
  'High Protein', 'Low Carb', 'Mediterranean', 'Indian', 'Chinese', 'American', 'Italian',
  'Japanese', 'Mexican', 'French', 'Korean', 'Thai', 'Middle Eastern', 'African',
  'European', 'Fusion', 'Traditional', 'Organic', 'Raw Food', 'Seafood', 'BBQ', 'Others'
];

export default function DietTabs() {
  const [activeTab, setActiveTab] = useState('personalized');
  const [aiError, setAiError] = useState(false);
  const [preferences, setPreferences] = useState({
    native: '',
    cuisine: '',
    customNative: '',
    customCuisine: ''
  });

  const handleSubmit = () => {
    setActiveTab('ai-enhanced');
    setAiError(false);
  };

  const resolvedPreferences = {
    native: preferences.native === 'Others' ? preferences.customNative : preferences.native,
    cuisine: preferences.cuisine === 'Others' ? preferences.customCuisine : preferences.cuisine,
    customNative: preferences.customNative,
    customCuisine: preferences.customCuisine,
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full bg-cover relative"
      style={{ backgroundImage: "url('/dietBg.jpg')" }}>
      <div className="absolute inset-0 bg-black opacity-60 z-0 pointer-events-none" />

      {/* FORM SECTION */}
      <div className="z-10 w-full max-w-4xl mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 text-white">
        <h2 className="text-2xl font-semibold mb-4">Customize Your Diet Plan</h2>
        <div className="flex flex-wrap gap-6">
          {/* Native Input */}
          <div className="flex flex-col flex-1 min-w-[200px]">
            <label className="mb-1 font-medium">Native</label>
            <select
              value={preferences.native}
              onChange={e => setPreferences({ ...preferences, native: e.target.value })}
              className="rounded px-3 py-2 text-white bg-white/20 border border-white/30"
            >
              <option value="">Select</option>
              {nativeOptions.map(option => (
                <option key={option} value={option} className="text-black">
                  {option}
                </option>
              ))}
            </select>
            {preferences.native === 'Others' && (
              <input
                type="text"
                placeholder="Enter your native"
                className="mt-2 px-3 py-2 rounded text-white bg-white/20 border border-white/30"
                value={preferences.customNative}
                onChange={e => setPreferences({ ...preferences, customNative: e.target.value })}
              />
            )}
          </div>

          {/* Cuisine Input */}
          <div className="flex flex-col flex-1 min-w-[200px]">
            <label className="mb-1 font-medium">Cuisine Type</label>
            <select
              value={preferences.cuisine}
              onChange={e => setPreferences({ ...preferences, cuisine: e.target.value })}
              className="rounded px-3 py-2 text-white bg-white/20 border border-white/30"
            >
              <option value="">Select</option>
              {cuisineOptions.map(option => (
                <option key={option} value={option} className="text-black">
                  {option}
                </option>
              ))}
            </select>
            {preferences.cuisine === 'Others' && (
              <input
                type="text"
                placeholder="Enter your cuisine preference"
                className="mt-2 px-3 py-2 rounded text-white bg-white/20 border border-white/30"
                value={preferences.customCuisine}
                onChange={e => setPreferences({ ...preferences, customCuisine: e.target.value })}
              />
            )}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 px-6 py-2 bg-orange-500 hover:bg-orange-600 transition-colors rounded text-white font-medium"
          disabled={!preferences.native || !preferences.cuisine}
        >
          Generate AI Diet Plan
        </button>
      </div>

      {/* TABS SECTION */}
      <div className="z-10 w-full max-w-4xl bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 text-white my-8">
        <Tabs.Root
          value={aiError ? 'personalized' : activeTab}
          onValueChange={setActiveTab}
          className="flex flex-col"
        >
          <Tabs.List className="flex border-b border-gray-600 mb-6">
            <Tabs.Trigger
              value="personalized"
              className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-orange-400 data-[state=active]:text-orange-400"
            >
              Standard Diet Plan
            </Tabs.Trigger>
            <Tabs.Trigger
              value="ai-enhanced"
              className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-orange-400 data-[state=active]:text-orange-400"
            >
              AI-Enhanced Diet
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="personalized">
            <PersonalizedDiet />
          </Tabs.Content>

          <Tabs.Content value="ai-enhanced">
            <AIEnhancedDiet
              preferences={resolvedPreferences}
              onError={() => {
                setAiError(true);
                setActiveTab('personalized');
              }}
            />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
}
