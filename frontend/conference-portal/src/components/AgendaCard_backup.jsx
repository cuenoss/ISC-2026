import { useState } from 'react';
import SpeakerModal from './SpeakerModal';

export default function AgendaCard({ item, isCurrent }) {
  const [showSpeakerModal, setShowSpeakerModal] = useState(false);

  const handleSpeakerClick = () => {
    if (item.speaker) {
      setShowSpeakerModal(true);
    }
  };

  // Debug logging
  console.log('AgendaCard item:', item);
  console.log('Has speaker:', !!item.speaker);
  console.log('Speaker data:', item.speaker);

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
          {item.speaker && (
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
        speaker={item.speaker}
        isOpen={showSpeakerModal}
        onClose={() => setShowSpeakerModal(false)}
      />
    </>
  );
}
