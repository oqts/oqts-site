import Btn from '../components/Btn';

export default function NotFound() {
  return (
    <div className="wrap">
      <div className="ground g1" aria-hidden="true" />
      <section>
        <div className="plate">
          <p className="eyebrow">404</p>
          <h1>No such page</h1>
          <p className="lede col">
            Whatever was here has been cancelled and removed from the book.
          </p>
          <div className="btn-row">
            <Btn href="/">Back to the homepage</Btn>
          </div>
        </div>
      </section>
    </div>
  );
}
