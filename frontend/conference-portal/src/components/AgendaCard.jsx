import { useState, useEffect } from 'react';
import SpeakerModal from './SpeakerModal';
import { speakersAPI } from '../services/api';

export default function AgendaCard({ item, isCurrent, speakers }) {
  const [showSpeakerModal, setShowSpeakerModal] = useState(false);
  const [speakerDetails, setSpeakerDetails] = useState(null);

  useEffect(() => {
    // Fetch complete speaker details when speaker ID is available
    const fetchSpeakerDetails = async () => {
      console.log('AgendaCard - item.speaker:', item.speaker);
      
      if (item.speaker && item.speaker._id) {
        console.log('Fetching speaker details for ID:', item.speaker._id);
        try {
          const speakerData = await speakersAPI.getSpeakerById(item.speaker._id);
          console.log('Fetched speaker data:', speakerData);
          setSpeakerDetails(speakerData);
        } catch (error) {
          console.error('Failed to fetch speaker details:', error);
          // Fallback to the basic speaker data from agenda
          setSpeakerDetails(item.speaker);
        }
      } else if (item.speaker) {
        console.log('No speaker ID, using agenda speaker data:', item.speaker);
        // If no ID but has speaker data, use it as fallback
        setSpeakerDetails(item.speaker);
      }
    };

    fetchSpeakerDetails();
  }, [item.speaker]);

  const handleSpeakerClick = () => {
    if (speakerDetails) {
      setShowSpeakerModal(true);
    }
  };

  return (
    <>
      <div className={`agenda-card ${isCurrent ? 'current' : ''}`} data-aos="fade-up">
        <div className="agenda-time">
          <span>{item.TimeSlot}</span>
          {isCurrent && <span className="live-badge">LIVE</span>}
        </div>
        <div className="agenda-details">
          <h3>{item.SessionTitle}</h3>
          <div className="speaker-info">
            <p className="agenda-speaker">{item.speakerNames}</p>
            {item.Description && <p className="agenda-description">{item.Description}</p>}
          </div>
          {speakerDetails && (
            <div className="speaker-action">
              <button 
                className="btn btn-small btn-outline speaker-btn"
                onClick={handleSpeakerClick}
              >
                View Speaker Details
              </button>
            </div>
          )}
        </div>
      </div>
      
      <SpeakerModal 
        speaker={speakerDetails}
        isOpen={showSpeakerModal}
        onClose={() => setShowSpeakerModal(false)}
      />
    </>
  );
}
