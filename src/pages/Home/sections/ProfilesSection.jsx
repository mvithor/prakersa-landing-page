import { profiles, profilesSection } from '@/data/profiles';
import { ANCHORS } from '@/routes/paths';
import ProfileMarker from '@/components/common/ProfileMarker';
import Section from '@/components/common/Section';
import SectionHeading from '@/components/common/SectionHeading';
import styles from './ProfilesSection.module.css';

export default function ProfilesSection() {
  return (
    <Section id={ANCHORS.profiles} tone="paper" labelledBy="profiles-title">
      <div className={styles.grid}>
        <SectionHeading
          id="profiles-title"
          title={profilesSection.title}
          lead={profilesSection.lead}
          className={styles.heading}
        />

        <ul className={styles.list}>
          {profiles.map((profile) => (
            <li key={profile.key} className={styles.row}>
              <ProfileMarker profileKey={profile.key} size="1.5rem" className={styles.marker} />
              <div>
                <h3 className={styles.name}>{profile.name}</h3>
                <p className={styles.condition}>{profile.condition}</p>
                <p className={styles.followUp}>
                  <span className={styles.followUpLabel}>Tindak lanjut.</span> {profile.followUp}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
