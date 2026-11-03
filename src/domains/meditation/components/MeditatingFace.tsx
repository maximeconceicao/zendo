import { ReactNode } from 'react';

/**
 * Visage serein posé sur une vraie sphère 3D (écran d'accueil).
 *
 * Contrairement à une image plate qu'on fait basculer, les traits (yeux, sourire)
 * sont réellement positionnés sur la surface d'une sphère : chaque trait est
 * orienté (rotateY/rotateX) puis poussé sur le rayon (translateZ), ce qui le rend
 * tangent au volume. Quand les conteneurs `.zendo-face-spin-y` / `.zendo-face-spin-x`
 * dérivent, les traits balaient la surface, se déforment en perspective et se masquent
 * s'ils passent derrière (`backface-visibility: hidden`).
 *
 * Le disque noir sert de silhouette (une sphère se projette toujours en cercle) :
 * il reste plat et immobile, peint en arrière-plan ; les traits avant passent
 * devant. Trois animations se combinent (voir styles/index.css) :
 *  - `zendoFloat`   : respiration / lévitation verticale.
 *  - `zendoDriftY` / `zendoDriftX` : oscillations d'amplitude limitée, de périodes
 *    différentes, donnant une rotation « errante » qui garde le visage en vue.
 * Les animations se désactivent si l'utilisateur préfère réduire les mouvements.
 */
const MeditatingFace = ({ size = 170 }: { size?: number }) => {
  const radius = size / 2; // rayon de la sphère, en px
  const scale = size / 170;

  // Place un trait sur la surface de la sphère à (longitude, latitude), en degrés.
  const onSurface = (lonDeg: number, latDeg: number) =>
    `rotateY(${lonDeg}deg) rotateX(${latDeg}deg) translateZ(${radius}px)`;

  const Feature = ({
    width,
    height,
    lon,
    lat,
    children
  }: {
    width: number;
    height: number;
    lon: number;
    lat: number;
    children: ReactNode;
  }) => (
    <div
      className="zendo-face-feature"
      style={{
        width,
        height,
        left: `calc(50% - ${width / 2}px)`,
        top: `calc(50% - ${height / 2}px)`,
        transform: onSurface(lon, lat)
      }}
    >
      {children}
    </div>
  );

  // Un visage complet (deux yeux + sourire) posé sur un hémisphère.
  const faceSide = () => (
    <>
      <Feature width={24 * scale} height={13 * scale} lon={-16} lat={8}>
        <svg viewBox="0 0 30 16" width="100%" height="100%" fill="none">
          <path
            d="M3 6 Q15 13 27 6"
            stroke="#ffffff"
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Feature>

      <Feature width={24 * scale} height={13 * scale} lon={16} lat={8}>
        <svg viewBox="0 0 30 16" width="100%" height="100%" fill="none">
          <path
            d="M3 6 Q15 13 27 6"
            stroke="#ffffff"
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Feature>

      <Feature width={35 * scale} height={15 * scale} lon={0} lat={-12}>
        <svg viewBox="0 0 44 18" width="100%" height="100%" fill="none">
          <path
            d="M4 6 C12 16 32 16 40 6"
            stroke="#ffffff"
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Feature>
    </>
  );

  return (
    <div className="flex items-center justify-center" aria-hidden="true">
      <div className="zendo-face-scene" style={{ width: size, height: size }}>
        <div className="zendo-face-float">
          {/* Silhouette de la sphère : cercle noir plat, immobile */}
          <div className="zendo-face-disc" />

          {/* Traits posés sur la surface. Deux rotations imbriquées (Y puis X),
              de périodes différentes, produisent un tumbling 3D continu. */}
          <div className="zendo-face-spin-y">
            <div className="zendo-face-spin-x">
              <div className="zendo-face-side">{faceSide()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeditatingFace;
