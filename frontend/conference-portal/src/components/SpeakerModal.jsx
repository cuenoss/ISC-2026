export default function SpeakerModal({ speaker, isOpen, onClose }) {
  if (!isOpen) return null;

  // Debug logging
  console.log('SpeakerModal - speaker data:', speaker);
  console.log('SpeakerModal - has biography:', !!speaker?.biography);
  console.log('SpeakerModal - biography length:', speaker?.biography?.length || 0);
  console.log('SpeakerModal - biography value:', speaker?.biography);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content speaker-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Speaker Details</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="speaker-info">
            <div className="speaker-avatar">
              <img 
                src={speaker.photo_url || speaker.photo || 'https://via.placeholder.com/150x150?text=Speaker'} 
                alt={speaker.name}
              />
            </div>
            
            <div className="speaker-details">
              <h3>{speaker.name}</h3>
              {speaker.title && speaker.title.trim() && <p className="speaker-title">{speaker.title}</p>}
              <p className="speaker-affiliation">{speaker.affiliation}</p>
              <p className="speaker-topic">
                <strong>Topic:</strong> {speaker.topic || speaker.scientificTheme || 'Not specified'}
              </p>
              
              {speaker.biography && speaker.biography.trim().length > 0 ? (
                <div className="speaker-bio">
                  <strong>Biography:</strong>
                  <p>{speaker.biography}</p>
                </div>
              ) : (
                <div className="speaker-bio">
                  <strong>Biography:</strong>
                  <p>No biography available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Set up global function for modal updates
window.updateModalSpeaker = function(speaker) {
  const modalContent = document.querySelector('.speaker-modal .modal-body');
  const speakerDetails = modalContent.querySelector('.speaker-details');
  
  if (speaker && speakerDetails) {
    const hasTitle = speaker.title && speaker.title.trim();
    const hasBio = speaker.biography && speaker.biography.trim().length > 0;
    const topic = speaker.topic || speaker.scientificTheme || 'Not specified';
    
    speakerDetails.innerHTML = `
      <div class="speaker-info">
        <div class="speaker-avatar">
          <img src="${speaker.photo_url || speaker.photo || 'https://via.placeholder.com/150x150?text=Speaker'}" alt="${speaker.name}">
        </div>
        
        <div class="speaker-details">
          <h3>${speaker.name}</h3>
          ${hasTitle ? `<p class="speaker-title">${speaker.title}</p>` : ''}
          <p class="speaker-affiliation">${speaker.affiliation}</p>
          <p class="speaker-topic">
            <strong>Topic:</strong> ${topic}
          </p>
          
          <div class="speaker-bio">
            <strong>Biography:</strong>
            <p>${hasBio ? speaker.biography : 'No biography available'}</p>
          </div>
        </div>
      </div>
    `;
  }
};
