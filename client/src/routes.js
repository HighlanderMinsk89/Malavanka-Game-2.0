import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { AuthPage } from './pages/AuthPage'
import { RoomPage } from './pages/RoomPage'
import { GameResultsPage } from './pages/GameResultsPage'
import { HomePage } from './pages/HomePage'
import { RoomsPage } from './pages/RoomsPage'
import { ScoresPage } from './pages/ScoresPage'

export const useRoutes = (isAuthenticated) => {
  return (
    <Switch>
      <Route path='/' exact>
        <HomePage />
      </Route>
      <Route path='/scores' exact>
        <ScoresPage />
      </Route>

      {isAuthenticated ? (
        <Switch>
          <Route path='/room/:roomid' exact>
            <RoomPage />
          </Route>
          <Route path='/results' exact>
            <GameResultsPage />
          </Route>
          <Route path='/selectroom' exact>
            <RoomsPage />
          </Route>
          <Redirect to='/' />
        </Switch>
      ) : (
        <Route path='/auth' exact>
          <AuthPage />
        </Route>
      )}
      <Redirect to='/' />
    </Switch>
  )
}
