import { Link } from "react-router-dom";

const BellItem = ({ text, link, linkText, date, onClose, isNew }) => {
  return (
    <div className={`bell-info__elem ${isNew ? "bell-info__elem--new" : ""}`}>
      <div className="bell-info__text">{text}</div>
      {link && !link.includes("https://betterwasya.vercel.app") && (
        <a onClick={onClose} target="_blank" rel="noreferrer" href={link} className="bell-info__link">
          <span>{linkText}</span>
        </a>
      )}
      {link && link.includes("https://betterwasya.vercel.app") && (
        <Link onClick={onClose} to={link.replace("https://betterwasya.vercel.app", "")} className="bell-info__link">
          <span>{linkText}</span>
        </Link>
      )}
      <div className="bell-info__date">{new Date(date).toLocaleDateString()}</div>
    </div>
  );
};

export default BellItem;
