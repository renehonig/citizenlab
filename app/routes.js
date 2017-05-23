// These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the code splitting business
import { getAsyncInjectors } from 'utils/asyncInjectors';

const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

export default function createRoutes(store) {
  // Create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectSagas } = getAsyncInjectors(store); // eslint-disable-line no-unused-vars

  return [
    {
      path: '/',
      name: 'home',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/HomePage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/dev/foundation',
      name: 'foundationDemoPage',
      getComponent(location, cb) {
        import('containers/FoundationDemoPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '/sign-in',
      name: 'signInPage',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/SignInPage/reducer'),
          import('containers/SignInPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, component]) => {
          injectReducer('signInPage', reducer.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/register/complete',
      name: 'registrationComplete',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/completeRegistrationPage'),
//          import('containers/completeRegistrationPage/reducers'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
//          injectReducer('usersEditPage', reducer.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/profile/edit',
      name: 'usersEditPage',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/UsersEditPage/reducer'),
          import('containers/UsersEditPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, component]) => {
          injectReducer('usersEditPage', reducer.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/ideas/new',
      name: 'IdeasNewPage',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/IdeasNewPage/reducer'),
          import('containers/IdeasNewPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, component]) => {
          injectReducer('ideasNewPageReducer', reducer.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/ideas',
      name: 'ideasPage',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/IdeasIndexPage/reducer'),
          import('containers/IdeasIndexPage'),

        ]);
        const renderRoute = loadModule(cb);

        importModules.then(([reducer, component]) => {
          injectReducer('ideasIndexPage', reducer.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
      childRoutes: [
        {
          path: ':slug',
          name: 'ideasShow',
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import('containers/IdeasShow/reducer'),
              import('containers/IdeasShow'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, component]) => {
              injectReducer('ideasShow', reducer.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          },
        },
      ],
    }, {
      path: '/register',
      name: 'usersNewPage',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/UsersNewPage/reducer'),
          import('containers/UsersNewPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, component]) => {
          injectReducer('usersNewPage', reducer.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/profile/:slug',
      name: 'usersShowPage',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/UsersShowPage/reducer'),
          import('containers/UsersShowPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, component]) => {
          injectReducer('usersShowPage', reducer.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/admin',
      name: 'adminPage',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/AdminPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
      childRoutes: [
        {
          path: '/admin/dashboard',
          name: 'dashboardPage',
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import('containers/AdminPage/DashboardPage'),
              import('containers/AdminPage/DashboardPage/reducer'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([component, reducer]) => {
              renderRoute(component);
              injectReducer('dashboardPage', reducer.default);
            });

            importModules.catch(errorLoading);
          },
        },
        {
          path: '/admin/settings',
          name: 'settingsPage',
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import('containers/AdminPage/SettingsPage/reducer'),
              import('containers/AdminPage/SettingsPage'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, component]) => {
              injectReducer('settingsPage', reducer.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          },
        },
        {
          path: '/admin/users',
          name: 'usersPage',
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import('containers/AdminPage/UsersPage/reducer'),
              import('containers/AdminPage/UsersPage'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, component]) => {
              injectReducer('usersPage', reducer.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          },
        },
        {
          path: '/admin/ideas',
          name: 'ideasPage',
          getComponent(nextState, cb) {
            const importModules = Promise.all([
              import('containers/AdminPage/IdeasPage/reducer'),
              import('containers/AdminPage/IdeasPage'),
            ]);

            const renderRoute = loadModule(cb);

            importModules.then(([reducer, component]) => {
              injectReducer('ideasPage', reducer.default);
              renderRoute(component);
            });

            importModules.catch(errorLoading);
          },
        },
      ],
    },
    {
      path: '/admin/pages',
      name: 'adminPages',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/AdminPage/AdminPages'),
          import('containers/AdminPage/AdminPages/reducer'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component, reducer]) => {
          injectReducer('adminPages', reducer.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/admin/pages/new',
      name: 'adminPagesNew',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/AdminPage/AdminPagesNew'),
          import('containers/AdminPage/AdminPagesNew/reducer'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component, reducer]) => {
          injectReducer('adminPagesNew', reducer.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    },
    {
      path: '/projects',
      name: 'projectsIndexPage',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('containers/ProjectsIndexPage/reducer'),
          import('containers/ProjectsIndexPage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, component]) => {
          injectReducer('projectsIndexPage', reducer.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '*',
      name: 'notfound',
      getComponent(nextState, cb) {
        import('containers/NotFoundPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    },
  ];
}
