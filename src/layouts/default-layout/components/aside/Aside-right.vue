<template>
  <div
    id="kt_app_aside"
    class="app-aside flex-column"
    data-kt-drawer="true"
    data-kt-drawer-name="app-aside"
    data-kt-drawer-activate="{default: true, lg: false}"
    data-kt-drawer-overlay="true"
    data-kt-drawer-width="auto"
    data-kt-drawer-direction="end"
    data-kt-drawer-toggle="#kt_app_aside_mobile_toggle"
  >
    <div
      id="kt_app_aside_wrapper"
      class="d-flex flex-column align-items-center hover-scroll-y mt-lg-n3 py-5 py-lg-0 gap-4"
      data-kt-scroll="true"
      data-kt-scroll-activate="{default: false, lg: true}"
      data-kt-scroll-height="auto"
      data-kt-scroll-dependencies="#kt_app_header"
      data-kt-scroll-wrappers="#kt_app_aside_wrapper"
      data-kt-scroll-offset="5px"
      style="height: 493px"
    >
      <a
        href="javascript:void(0)"
        class="btn btn-icon btn-color-primary bg-hover-body h-45px w-45px flex-shrink-0"
        id="account_information_drawer_toggle"
        ><i class="ki-duotone ki-user-tick fs-2x"
          ><span class="path1"></span><span class="path2"></span
          ><span class="path3"></span></i></a
      ><a
        href="/metronic8/demo39/account/overview.html"
        class="btn btn-icon btn-color-warning bg-hover-body h-45px w-45px flex-shrink-0"
        data-bs-toggle="tooltip"
        data-bs-custom-class="tooltip-inverse"
        aria-label="Profile"
        data-bs-original-title="Profile"
        data-kt-initialized="1"
        ><i class="ki-outline ki-address-book fs-2x"></i></a
      ><a
        href=""
        class="btn btn-icon btn-color-success bg-hover-body h-45px w-45px flex-shrink-0"
        data-bs-toggle="tooltip"
        data-bs-custom-class="tooltip-inverse"
        aria-label="Messages"
        data-bs-original-title="Messages"
        data-kt-initialized="1"
        ><i class="ki-outline ki-tablet-ok fs-2x"></i></a
      ><a
        href=""
        class="btn btn-icon btn-color-dark bg-hover-body h-45px w-45px flex-shrink-0"
        data-bs-toggle="tooltip"
        data-bs-custom-class="tooltip-inverse"
        aria-label="Products"
        data-bs-original-title="Products"
        data-kt-initialized="1"
        ><i class="ki-outline ki-calendar-add fs-2x"></i
      ></a>
    </div>
  </div>
</template>
