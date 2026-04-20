export default function CertificatePreview({ name, email, conferenceData }) {
  return (
    <div className="certificate-preview" data-aos="zoom-in">
      <div className="certificate-border">
        <div className="certificate-inner">
          <div className="certificate-header">
            <h1>Certificate of Attendance</h1>
            <p className="certificate-subtitle">{conferenceData?.title || 'International Scientific Conference'}</p>
          </div>
          <div className="certificate-body">
            <p>This is to certify that</p>
            <p className="certificate-name">{name}</p>
            <p>participated in the <strong>{conferenceData?.title || 'International Scientific Conference'}</strong></p>
            <p>held from June 15–17, 2026.</p>
            <p className="certificate-email">Registered: {email}</p>
          </div>
          <div className="certificate-footer">
            <div className="certificate-signature">
              <div className="signature-line"></div>
              <p>Conference Chair</p>
            </div>
            <p className="certificate-date">June 17, 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}
