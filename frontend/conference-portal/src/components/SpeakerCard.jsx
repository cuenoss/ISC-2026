export default function SpeakerCard({ speaker }) {
  // Handle both frontend and backend data structures
  const photo = speaker.photo || speaker.photo_url;
  const theme = speaker.scientificTheme || speaker.topic;
  const bio = speaker.bio || speaker.biography;

  return (
    <article className="speaker-card" data-aos="fade-up">
      <div className="speaker-card-image">
        <img src={photo} alt={speaker.name} loading="lazy" />
        <span className="speaker-topic">{theme}</span>
      </div>
      <div className="speaker-card-content">
        <h3>{speaker.name}</h3>
        {speaker.title && <p className="speaker-title">{speaker.title}</p>}
        <p className="speaker-affiliation">{speaker.affiliation}</p>
        <p className="speaker-bio">{bio}</p>
      </div>
    </article>
  );
}
