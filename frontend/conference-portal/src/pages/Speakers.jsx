import { useState, useMemo, useEffect } from 'react';
import SpeakerCard from '../components/SpeakerCard';
import { conferenceAPI } from '../services/api';

export default function Speakers() {
  const [search, setSearch] = useState('');
  const [themeFilter, setThemeFilter] = useState('All');
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch speakers from API
  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const speakersData = await conferenceAPI.getSpeakers();
        setSpeakers(speakersData);
      } catch (error) {
        console.error('Failed to fetch speakers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpeakers();
  }, []);

  const THEMES = useMemo(() => ['All', ...new Set(speakers.map((s) => s.scientificTheme || s.topic))], [speakers]);

  const filteredSpeakers = useMemo(() => {
    return speakers.filter((speaker) => {
      const matchesSearch =
        speaker.name.toLowerCase().includes(search.toLowerCase()) ||
        speaker.affiliation.toLowerCase().includes(search.toLowerCase()) ||
        (speaker.scientificTheme || speaker.topic).toLowerCase().includes(search.toLowerCase()) ||
        (speaker.biography || speaker.bio).toLowerCase().includes(search.toLowerCase());
      const matchesTheme = themeFilter === 'All' || (speaker.scientificTheme || speaker.topic) === themeFilter;
      return matchesSearch && matchesTheme;
    });
  }, [search, themeFilter, speakers]);

  if (loading) {
    return (
      <main className="speakers-page page">
        <div className="loading">Loading speakers...</div>
      </main>
    );
  }

  return (
    <main className="speakers-page page">
      <header className="page-header">
        <h1>Conference Speakers</h1>
        <p>Meet the distinguished experts leading our keynote sessions and panels.</p>
      </header>

      <div className="filters">
        <input
          type="search"
          placeholder="Search by name, affiliation, or theme..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select
          value={themeFilter}
          onChange={(e) => setThemeFilter(e.target.value)}
          className="theme-select"
        >
          {THEMES.map((theme) => (
            <option key={theme} value={theme}>
              {theme}
            </option>
          ))}
        </select>
      </div>

      <div className="speakers-grid full">
        {filteredSpeakers.map((speaker) => (
          <SpeakerCard 
            key={speaker._id || speaker.id} 
            speaker={speaker} 
          />
        ))}
      </div>

      {filteredSpeakers.length === 0 && (
        <p className="no-results">No speakers match your search criteria.</p>
      )}
    </main>
  );
}
