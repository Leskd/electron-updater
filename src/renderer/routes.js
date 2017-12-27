import React from 'react';
import { Route, Switch } from 'react-router';
import App from './components/app/app'
import Home from './components/home/home'
import Updater from './components/updater/updater'

export default function routes () {
  return (
    <App>
        <Switch>
            <Route path='/updater' component={Updater} />
            <Route path='/' component={Home} />
        </Switch>
    </App>
  )
}