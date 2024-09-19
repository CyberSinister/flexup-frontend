import { useAuthStore } from "@/stores/auth";
import { createRouter, createWebHistory } from "vue-router";
import { routes as autoRoutes } from "vue-router/auto-routes"; // Import auto-generated routes
import Swal from "sweetalert2";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/dashboard",
      component: () => import("@/layouts/default-layout/DefaultLayout.vue"),
      meta: { middleware: "auth" },
      children: [...autoRoutes],
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
      path: "/legal",
      name: "legal",
      component: () => import("@/layouts/legal.vue"),
    },
    {
      path: "/",
      component: () => import("@/layouts/SystemLayout.vue"),
      children: [
        {
          path: "/404",
          name: "404",
          component: () =>
            import("@/views/crafted/authentication/Error404.vue"),
          meta: {
            pageTitle: "Error 404",
          },
        },
        {
          path: "/500",
          name: "500",
          component: () =>
            import("@/views/crafted/authentication/Error500.vue"),
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
  ],
});

// Add navigation guard to handle authentication
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const user = authStore.getUser();

  console.log("User: ", user);
  console.log('AuthStore:', authStore);
  let profileIncomplete = true;

  console.log("Heading to: ", to.path);

  try {
    profileIncomplete = !Object.keys(user.primary_individual).length > 0;
    console.log("Profile incomplete: ", profileIncomplete);
  } catch (error) {
    console.log("Error while checking profile completeness: ", error);
  }

  console.log("Here from: ", from);
  if (to.meta.middleware === "auth") {
    console.log("MIDDLEWARE AUTH");
    if (authStore.isAuthenticated) {
      const authVerified = authStore.verifyAuth();
      // If the route requires auth and the user is not authenticated, redirect to login
      if (authVerified) {
        console.log("AUTH VERIFIED");
        try {
          authStore.fetchUserData();

          if (profileIncomplete) {
            console.log("PROFILE IS INCOMPLETE");
            next(false); // Cancel the current navigation
            router.push({ path: "/auth", hash: "#completeProfile" });
          } else {
            console.log("PROFILE IS COMPLETE - going next()");
            next();
          }
        } catch (error) {
          console.log("Error while fetching user data: ", error);
          next(false); // Cancel the current navigation
          router.push({ path: "/auth", hash: "#login" });
        }
      } else {
        Swal.fire({
          title: "Your authentication session has expired!",
          text: "Please login again to continue using the FlexUp app.",
          icon: "error",
        });
        console.log("Session expired");
        next(false); // Cancel the current navigation
        router.push({ path: "/auth", hash: "#login" });
      }
    } else {
      Swal.fire({
        title: "Unauthorized",
        text: "You must be logged in to access this page",
        icon: "warning",
      });
      console.log("unauthorized");
      next(false); // Cancel the current navigation
      router.push({ path: "/auth", hash: "#login" });
    }
  } else {
    console.log("MIDDLEWARE NOT AUTH");

    if (to.path === "/auth") {
      console.log("to.hash: ", to.hash);
      if (
        (to.hash &&
          ![
            "login",
            "signup",
            "resetPassword",
            "completeProfile",
            "warning",
          ].includes(to.hash.replace("#", ""))) ||
        !to.hash
      ) {
        console.log("!HASH or INVALID HASH");
        next(false); // Cancel the current navigation
        router.push({ path: "/auth", hash: "#login" });
      } else {
        console.log("HASH IS GOOD");
        if (authStore.isAuthenticated) {
          if (profileIncomplete) {
            console.log(
              "[auth check] Profil  e is incomplete: ",
              profileIncomplete
            );
            if (!(to.hash === "#completeProfile")) {
              console.log('Going to complete profile');
              next(false); // Cancel the current navigation
              router.push({ path: "/auth", hash: "#completeProfile" });
            } else {
              console.log('Going to next()');
              next();
            }
          } else {
            console.log("in profile complete - going next()");
            next(false);
            router.push({ path: "/" });
          }
        } else if (to.hash === "#completeProfile") {
          console.log("SUPPOSED TO GOTO LOGIN");
          next(false);
          router.push({ path: "/auth", hash: "#login" });
        } else {
          next();
          console.log("We're good, ending here")
          return
        }
      }
    } else {
      console.log("Nothing to do with auth", to);
      next();
      console.log('Navigation should end here')
    }
  }
});

export default router;
