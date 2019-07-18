<template>
  <section class="content">
    <div class="row content-body">
      <div class="col-xs-12">
        <div id="searchOrder">
          <table width="100%;">
            <tbody>
              <tr>
                <TheSearchBar />
                <TheStatusButtonsBar />
                <TheCitiesBar />
                <TheReorganizeBar />
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import TheSearchBar from '@/components/TopBar/TheSearchBar';
import TheStatusButtonsBar from '@/components/TopBar/TheStatusButtonsBar';
import TheCitiesBar from '@/components/TopBar/TheCitiesBar';
import TheReorganizeBar from '@/components/TopBar/TheReorganizeBar';

export default {
  name: 'TheTopBar',
  components: {
    TheSearchBar,
    TheStatusButtonsBar,
    TheCitiesBar,
    TheReorganizeBar,
  },
};
</script>
