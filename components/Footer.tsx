import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className="wrap cols">
        <img src="/brand/logo/oqts-lockup-stacked-reverse.svg" alt="" width={156} height={150} />
        <div>
          <div className="foot-links">
            <div>
              <h4>Society</h4>
              <ul>
                <li><Link href="/team">Team &amp; structure</Link></li>
                <li><Link href="/sponsors">Sponsors</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4>Programmes</h4>
              <ul>
                <li><Link href="/research">Research</Link></li>
                <li><Link href="/oxdaq">OXDAQ</Link></li>
                <li><Link href="/events">Events</Link></li>
              </ul>
            </div>
            <div>
              <h4>Join</h4>
              <ul>
                <li><Link href="/join">Apply</Link></li>
                <li><Link href="/join#mailing-list">Mailing list</Link></li>
              </ul>
            </div>
          </div>
          <div className="colophon">
            Oxford Quantitative Trading Society ·{' '}
            <a href="mailto:oqts@oqts.org">oqts@oqts.org</a>
            <br />
            &copy; {new Date().getFullYear()} Oxford Quantitative Trading Society.
          </div>
        </div>
      </div>
    </footer>
  );
}
