import './poke-scenery.css'

const REGIONS = ['KANTO', 'JOHTO', 'HOENN', 'PALDEA']

export function PokeScenery() {
  return (
    <div className="poke-scenery" aria-hidden="true">
      <div className="poke-scenery__mascot"></div>
      <div className="poke-scenery__signpost">
        {REGIONS.map((region) => (
          <span key={region}>{region}</span>
        ))}
      </div>
    </div>
  )
}
