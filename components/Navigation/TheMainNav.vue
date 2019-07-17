<template>
  <!-- Header Navbar: style can be found in header.less -->
  <nav class="navbar navbar-static-top">
    <!-- Sidebar toggle button-->
    <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
      <span class="sr-only">Toggle navigation</span>
    </a>
    <!-- Navbar Right Menu -->
    <div class="navbar-custom-menu">
      <ul class="nav navbar-nav">
        <!-- Messages: style can be found in dropdown.less-->

        <!-- Notifications: style can be found in dropdown.less -->
        <li
          class="dropdown notifications-menu "
          id="notifivarion_major_contaianber"
        >
          <a href="#" class="dropdown-toggle" data-toggle="dropdown">
            <i class="fa fa-bell-o"></i>
            <span class="label label-warning" id="notification_number"></span>
          </a>

          <ul class="dropdown-menu">
            <li class="header" id="notification_number_2"></li>

            <li style="">
              <!-- inner menu: contains the actual data -->
              <ul class="menu" style="" id="notification_container">
                <li>fgrfvgdf</li>
              </ul>
            </li>
            <li class="footer">
              <a onclick="clear_all_notes();" href="#">Clear all</a>
            </li>
          </ul>
        </li>
        <!-- Tasks: style can be found in dropdown.less -->

        <!-- User Account: style can be found in dropdown.less -->
        <li class="dropdown user user-menu">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown">
            <img
              src="https://care.sendyit.com/customer/include/team/eggy.png"
              class="user-image"
              alt="User Image"
            />
            <span class="hidden-xs">Alexander Pierce</span>
          </a>
          <ul class="dropdown-menu">
            <!-- User image -->
            <li class="user-header">
              <img
                src="https://care.sendyit.com/customer/include/team/eggy.png"
                class="img-circle"
                alt="User Image"
              />

              <p>
                Alexander Pierce - Web Developer
                <small>Lets Deliver</small>
              </p>
            </li>

            <!-- Menu Footer-->
            <li class="user-footer">
              <div class="pull-right">
                <a href="#" class="btn btn-default btn-flat">Sign out</a>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'TheMainNav',
};
</script>

<style>
.navbar-nav {
  flex-direction: row;
  /* width: 190.91px; */
  /* height: 50px; */
  margin-right: 3em;
  /* float: left; */
  /* margin: 0; */
  padding: 12px 0px;
}
.navbar {
  position: relative;
  /* display: -ms-flexbox; */
  display: block;
  /* -ms-flex-wrap: wrap; */
  flex-wrap: wrap;
  /* -ms-flex-align: center; */
  align-items: center;
  /* -ms-flex-pack: justify; */
  justify-content: space-between;
  padding: 0px;
}
</style>
