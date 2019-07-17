<template>
  <section class="content" style=" min-height:0px; padding-bottom:0px;">
    <div class="row" style="margin-left: 0;">
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
