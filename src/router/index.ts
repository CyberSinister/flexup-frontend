import { useAuthStore } from '@/stores/auth';
import { createRouter, createWebHistory } from 'vue-router'
import { routes as autoRoutes } from 'vue-router/auto-routes' // Import auto-generated routes
import Swal from 'sweetalert2';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: "/dashboard",
      component: () => import('@/layouts/default-layout/DefaultLayout.vue'),
      meta: { middleware: 'auth' },
      children: [ 
        ...autoRoutes,
      ]
    },
    {
      path: "/auth",
      component: () => import("@/layouts/AuthLayout.vue"),
    
      // children: [
      //   {
      //     path: "/auth",
      //     name: "auth",
      //     component: () =>
      //       import("@/views/silque/Authentication.vue"),
      //     meta: {
      //       pageTitle: "Sign In",
      //     },
      //   },
      //   {
      //     path: "/password-reset",
      //     name: "password-reset",
      //     component: () =>
      //       import("@/views/crafted/authentication/basic-flow/PasswordReset.vue"),
      //     meta: {
      //       pageTitle: "Password reset",
      //     },
      //   },
      // ],
    },
    // {
    //   path: '/legal',
    //   redirect: '/legal/T'  
    // },
    {
      path : '/Account',
      name : 'Account',
      component: import('@/layouts/AccountLayout.vue'),
    },
    {
      path: '/legal',
      name: 'legal',
      component: import('@/layouts/legal.vue'),
    },    
    {
      path: "/",
      component: () => import("@/layouts/SystemLayout.vue"),
      children: [
        {
          path: "/404",
          name: "404",
          component: () => import("@/views/crafted/authentication/Error404.vue"),
          meta: {
            pageTitle: "Error 404",
          },
        },
        {
          path: "/500",
          name: "500",
          component: () => import("@/views/crafted/authentication/Error500.vue"),
          meta: {
            pageTitle: "Error 500",
          },
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/404",
    },
  ]
})

// Add navigation guard to handle authentication
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const user = authStore.getUser();
  let profileIncomplete = true;

  console.log('Heading to: ', to.path);

  // Check if the route is /auth and has a hash
  if (to.path === '/auth' && !to.hash && window.location.hash) {
    const hash = window.location.hash.replace('#', '');
    if (['login', 'signup', 'resetPassword', 'completeProfile', 'warning'].includes(hash)) {
      console.log('Redirecting to /auth with hash:', hash);
      return next({ path: '/auth', hash: `#${hash}` });
    }
  }

  try {
    profileIncomplete = !Object.keys(user.primary_individual).length > 0;
    console.log('Profile Completeness: ', profileIncomplete);
  } catch (error) {
    console.log('Error while checking profile completeness: ', error);
  }

  if (to.path === '/auth') {
    console.log('IN AUTH');
    let hash = to.hash.replace('#', '');
    if (hash.length < 1 || !['login', 'signup', 'resetPassword', 'completeProfile', 'warning'].includes(hash)) {
      hash = 'login';
    }
    console.log('hash: ', hash);

    if (authStore.isAuthenticated) {
      if (profileIncomplete) {
        console.log('Profile is incomplete: ', profileIncomplete);
        console.log('User: ', user);
        authStore.switchAuthModule('completeProfile');
      } else {
        next({ path: '/' });
      }
    } else {
      if (hash.length < 1 || !['login', 'signup', 'resetPassword'].includes(hash)) {
        hash = 'login';
      }
      authStore.switchAuthModule(hash as 'login' | 'signup' | 'resetPassword' | 'completeProfile' | 'warning');
    }
  }

  if (to.meta.middleware === 'auth') {
    console.log('MIDDLEWARE AUTH');
    if (authStore.isAuthenticated) {
      const authVerified = authStore.verifyAuth();
      // If the route requires auth and the user is not authenticated, redirect to login
      if (authVerified) {
        try {
          authStore.fetchUserData();

          if (profileIncomplete) {
            console.log('PROFILE IS INCOMPLETE');
            next({ path: '/auth#completeProfile' });
          } else {
            next();
          }
        } catch (error) {
          next({ path: '/' });
        }
      } else {
        Swal.fire({
          title: 'You authentication session has expired!',
          text: 'Please login again to continue using the FlexUp app.',
          icon: 'error',
        });
        next({ path: '/auth' }); // nc
      }
    } else {
      Swal.fire({
        title: 'Unauthorized',
        text: 'You must be logged in to access this page',
        icon: 'warning',
      });
      next({ path: '/auth' }); // nc
    }
  } else {
    console.log('MIDDLEWARE NOT AUTH');
    next();
  }
  console.log('HEREREREREE');
});

export default router
