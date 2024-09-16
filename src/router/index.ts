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

  try {
    profileIncomplete = !Object.keys(user.primary_individual).length > 0;
    console.log('Profile incomplete: ', profileIncomplete);
  } catch (error) {
    console.log('Error while checking profile completeness: ', error);
  }

  if (to.meta.middleware === 'auth') {
    console.log('MIDDLEWARE AUTH');
    if (authStore.isAuthenticated) {
      const authVerified = authStore.verifyAuth();
      // If the route requires auth and the user is not authenticated, redirect to login
      if (authVerified) {
        console.log('AUTH VERIFIED');
        try {
          authStore.fetchUserData();

          if (profileIncomplete) {
            console.log('PROFILE IS INCOMPLETE');
            next({ path: '/auth', hash: '#completeProfile' });
          } else {
            next();
          }
        } catch (error) {
          console.log('Error while fetching user data: ', error);
          next({ path: '/auth' });
        }
      } else {
        Swal.fire({
          title: 'Your authentication session has expired!',
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
  
    if (to.path === '/auth') {
      console.log('to.hash: ', to.hash);
      if ((to.hash && !['login', 'signup', 'resetPassword', 'completeProfile', 'warning'].includes(to.hash.replace('#', ''))) || !to.hash) {
        console.log('!HASH or INVALID HASH')
        next({ path: '/auth', hash: '#login' });
      } else {
        console.log('HAS IS GOOD')
        if (authStore.isAuthenticated) {
          if (profileIncomplete) {
            console.log('[auth check] Profile is incomplete: ', profileIncomplete);
            if (!(to.hash === '#completeProfile')) {next({ path: '/auth', hash: '#completeProfile' });}
          } else {
            console.log('[auth check] Profile is complete');
            next({ path: '/' });
          }
        } //else {
          //next();
        //}
      }
    } //else {
      //console.log('Moving forward')
      //next();
    //}
    
  }
  next();
});

export default router
