import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import AudiencesSection from './sections/AudiencesSection';
import ClosingCtaSection from './sections/ClosingCtaSection';
import DifferentiatorsSection from './sections/DifferentiatorsSection';
import FaqSection from './sections/FaqSection';
import FindingsSection from './sections/FindingsSection';
import HeroSection from './sections/HeroSection';
import HowItWorksSection from './sections/HowItWorksSection';
import PilotSection from './sections/PilotSection';
import ProblemSection from './sections/ProblemSection';
import ProfilesSection from './sections/ProfilesSection';
import TrackRecordSection from './sections/TrackRecordSection';

// Urutan bagian mengikuti alur keputusan kepala sekolah dan kepala jurusan:
// bukti masalah -> cara kerja -> hasil -> siapa diuntungkan -> alasan percaya -> ajakan.
export default function Home() {
  useDocumentTitle('');

  return (
    <>
      <HeroSection />
      <FindingsSection />
      <ProblemSection />
      <HowItWorksSection />
      <ProfilesSection />
      <AudiencesSection />
      <DifferentiatorsSection />
      <PilotSection />
      <TrackRecordSection />
      <FaqSection />
      <ClosingCtaSection />
    </>
  );
}
