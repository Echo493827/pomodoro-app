import { useState } from 'react'

export default function RecipeCard({ recipe, unlocked, totalMinutes }) {
  const [open, setOpen] = useState(false)
  const remaining = Math.max(0, recipe.minutes - totalMinutes)
  const pct = Math.min(100, Math.round((totalMinutes / recipe.minutes) * 100))

  if (!unlocked) {
    return (
      <article className="recipe-card locked">
        <div className="recipe-head">
          <span className="recipe-lock" aria-hidden="true">✦</span>
          <div>
            <h3 className="recipe-name">{recipe.name}</h3>
            <p className="recipe-tag">Unlocks at {recipe.minutes} focus minutes</p>
          </div>
        </div>
        <div className="lock-progress">
          <div className="lock-bar"><span style={{ width: `${pct}%` }} /></div>
          <span className="lock-remaining">{remaining} min to go</span>
        </div>
      </article>
    )
  }

  return (
    <article className="recipe-card unlocked">
      <div className="recipe-head">
        <span className="recipe-badge" aria-hidden="true">☕</span>
        <div>
          <h3 className="recipe-name">{recipe.name}</h3>
          <p className="recipe-tag">{recipe.tagline}</p>
        </div>
      </div>

      {recipe.simple ? (
        <div className="recipe-body">
          <p className="recipe-ingredients-inline">{recipe.ingredients.join(' · ')}</p>
          <ol className="recipe-steps">
            {recipe.steps.map((step, i) => <li key={i}>{step}</li>)}
          </ol>
        </div>
      ) : (
        <>
          <button
            className="recipe-toggle"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
          >
            {open ? 'Hide recipe' : 'View recipe'}
          </button>
          {open && (
            <div className="recipe-body">
              <h4 className="recipe-subhead">Ingredients</h4>
              <ul className="recipe-ingredients">
                {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
              </ul>
              <h4 className="recipe-subhead">Method</h4>
              <ol className="recipe-steps">
                {recipe.steps.map((step, i) => <li key={i}>{step}</li>)}
              </ol>
            </div>
          )}
        </>
      )}
    </article>
  )
}
