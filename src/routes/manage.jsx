import React, { propoTypes } from 'react'
import { Router, Route, IndexRedirect, Link } from 'react-router';
import Project from '../components/Project';
import Channel from '../components/Channel';
import Sim from '../components/Sim';
import Password from '../components/Password';
import Projects from '../components/Projects';
import Channels from '../components/Channels';
import Sims from '../components/Sims'
import CreateWx from '../components/Projects/CreateEditor';
import CreateChannel from '../components/Channels/Create';
import CreatePosition from '../components/Sims/CreatePosition';
import CreatePhone from '../components/Sims/CreatePhone';
import PhoneSuccess from '../components/Sims/PhoneSuccess';
import UploadPhone from '../components/Sims/UploadPhone';
import UploadWx from '../components/Projects/UploadWx';

const manage = () => {
  return (
    <Route path="manage">
      <IndexRedirect to="project" />
      <Route path="project" component={Project}>
        <IndexRedirect to="list" />
        <Route path="list" component={Projects} />
        <Route path="create" component={CreateWx} />
        <Route path="upload" component={UploadWx} />
        <Route path="create/:id" component={CreateWx} />
      </Route>
      <Route path="channel" component={Channel}>
        <IndexRedirect to="list" />
        <Route path="list" component={Channels} />
        <Route path="create" component={CreateChannel} />
        <Route path="create/:id" component={CreateChannel} />
      </Route>
      <Route path="card" component={Sim}>
        <IndexRedirect to="list" />
        <Route path="list" component={Sims} />
        <Route path="position" component={CreatePosition} />
        <Route path="phone" component={CreatePhone} />
        <Route path="success" component={PhoneSuccess} />
        <Route path="upload" component={UploadPhone} />
      </Route>
    </Route>
  )
}
export default manage;
