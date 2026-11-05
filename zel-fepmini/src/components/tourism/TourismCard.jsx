import styles from './TourismCard.module.css';

const PLACEHOLDER_IMAGE = 'https://placehold.co/400x240?text=No+Image';

function TourismCard({ destination, onClick }) {
  const { id, name, category, description, image } = destination;

  function handleClick() {
    onClick(id);
  }

  function handleImageError(e) {
    e.currentTarget.src = PLACEHOLDER_IMAGE;
  }

  return (
    <article className={styles.card} onClick={handleClick} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      <div className={styles.imageWrapper}>
        <img
          src={image || PLACEHOLDER_IMAGE}
          alt={name}
          className={styles.image}
          onError={handleImageError}
        />
      </div>
      <div className={styles.body}>
        <span className={styles.badge}>{category}</span>
        <h2 className={styles.name}>{name}</h2>
        <p className={styles.description}>{description}</p>
      </div>
    </article>
  );
}

export default TourismCard;
