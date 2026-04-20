import { useMemo, useState, useEffect } from 'react';
import AgendaCard from '../components/AgendaCard';
import { conferenceAPI, speakersAPI } from '../services/api';

function parseTime(timeStr) {
  // Parse ISO datetime string to get hours and minutes
  const date = new Date(timeStr);
  return date.getHours() * 60 + date.getMinutes();
}

function formatTime(timeStr) {
  // Format ISO datetime string to HH:MM format
  const date = new Date(timeStr);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
}

export default function Agenda() {
  const [agenda, setAgenda] = useState([]);
  const [speakers, setSpeakers] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch agenda and speakers from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agendaData, speakersData] = await Promise.all([
          conferenceAPI.getAgenda(),
          speakersAPI.getAllSpeakers()
        ]);
        
        setAgenda(agendaData);
        
        // Convert speakers array to object with ID as key for easy lookup
        const speakersObj = {};
        speakersData.forEach(speaker => {
          speakersObj[speaker._id] = speaker;
        });
        setSpeakers(speakersObj);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processedAgenda = useMemo(() => {
    if (agenda.length === 0) return [];
    
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    let currentIndex = -1;
    for (let i = 0; i < agenda.length; i++) {
      const start = new Date(agenda[i].time_slot).getHours() * 60 + new Date(agenda[i].time_slot).getMinutes();
      const end = i < agenda.length - 1 ? new Date(agenda[i + 1].time_slot).getHours() * 60 + new Date(agenda[i + 1].time_slot).getMinutes() : start + 60;
      if (currentMinutes >= start && currentMinutes < end) {
        currentIndex = i;
        break;
      }
    }
    
    return agenda.map((item, i) => { 
      // Handle both populated speaker object and speaker ID string
      const speaker = item.speaker_id && typeof item.speaker_id === 'object' 
        ? item.speaker_id 
        : (item.speaker_id && speakers[item.speaker_id] ? speakers[item.speaker_id] : null);
      
      return { 
        ...item, 
        id: item._id,
        TimeSlot: formatTime(item.time_slot),
        SessionTitle: item.session_title,
        Description: item.description,
        isCurrent: i === currentIndex,
        speaker: speaker,
        speakerNames: speaker ? speaker.name : 'Conference Chair'
      };
    });
  }, [agenda, speakers]);

  if (loading) {
    return (
      <main className="agenda-page page">
        <div className="loading">Loading agenda...</div>
      </main>
    );
  }

  return (
    <main className="agenda-page page">
      <header className="page-header">
        <h1>Conference Agenda</h1>
        <p>Full schedule for International Scientific Conference 2026.</p>
      </header>

      <div className="agenda-list">
        {processedAgenda.map((item) => (
          <AgendaCard key={item.id} item={item} isCurrent={item.isCurrent} speakers={speakers} />
        ))}
      </div>
    </main>
  );

}
