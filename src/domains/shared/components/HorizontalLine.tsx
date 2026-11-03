const HorizontalLine = ({ className }: { className?: string }) => {
  // <hr> sémantique ; on neutralise le style par défaut du navigateur (marges,
  // bordure pleine) pour ne garder qu'un filet supérieur.
  return <hr className={`m-0 border-0 border-t border-gray-300 ${className || ''}`} />;
};

export default HorizontalLine;
