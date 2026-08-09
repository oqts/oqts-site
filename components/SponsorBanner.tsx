import SponsorBelt from './SponsorBelt';
import { getAllSponsors } from '../lib/data';

// Reads the sponsor list at build time and hands it to the client-side belt,
// which owns the scrolling and the drift.
export default function SponsorBanner() {
  return <SponsorBelt sponsors={getAllSponsors()} />;
}
