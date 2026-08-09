import Btn from '../components/Btn';
import CloseRule from '../components/CloseRule';

export default function NotFound() {
  return (
    <div className="wrap">
      <div className="ground g1" aria-hidden="true" />
      <section>
        <p className="eyebrow">404</p>
        <h1>No such page</h1>
        <p className="lede col">
          Whatever was here has been cancelled and removed from the book.
        </p>
        <div className="btn-row">
          <Btn href="/">Back to the homepage</Btn>
        </div>
        <CloseRule />
      </section>
    </div>
  );
}
