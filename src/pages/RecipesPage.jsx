import { Link } from 'react-router-dom'
import RecipeCard from '../components/RecipeCard'
import { useAuth } from '../context/AuthContext'
import { recipes } from '../data/recipes'

export default function RecipesPage() {
  const { user, totalMinutes } = useAuth()

  const unlockedCount = recipes.filter((r) => r.minutes <= totalMinutes).length
  // show unlocked first, then the next ones to chase
  const sorted = [...recipes].sort((a, b) => a.minutes - b.minutes)

  return (
    <div className="page recipes-page">
      <div className="recipes-header">
        <h1 className="page-title">The Menu</h1>
        <p className="page-sub">
          {user
            ? `${unlockedCount} of ${recipes.length} recipes unlocked · ${totalMinutes} focus minutes`
            : 'Sign in to track which recipes you have unlocked.'}
        </p>
        {!user && (
          <Link className="btn btn-primary btn-inline" to="/auth">Sign in to start</Link>
        )}
      </div>

      <div className="recipe-grid">
        {sorted.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            unlocked={user ? recipe.minutes <= totalMinutes : false}
            totalMinutes={totalMinutes}
          />
        ))}
      </div>
    </div>
  )
}
