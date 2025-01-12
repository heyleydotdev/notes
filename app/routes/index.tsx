import { Link } from "react-router";

export default function HomePage() {
  return (
    <div>
      <p>Hello there!</p>
      <div>
        <Link to="/signin">Get Started</Link>
      </div>
    </div>
  );
}
