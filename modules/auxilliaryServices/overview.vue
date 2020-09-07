<template>
  <div class="overview-content-holder">
    <div class="date-filter-input">
      <el-date-picker
        v-model="filterdate"
        type="daterange"
        range-separator="-"
        start-placeholder="From"
        end-placeholder="To"
      >
      </el-date-picker>
    </div>
    <div class="date-filter-title">
      The data you are currently viewing is from XX date
    </div>
    <div>
      <div class="overview-tab-sections">
        <div class="overview-tabs-upper">
          <div class="icon-container green-bg">
            <img src="https://images.sendyit.com/CCredesign/money.png" alt="" />
          </div>
          <div class="filter-section-desc">Total fuel amount advanced</div>
          <div class="filter-section-amount">KES 104,500</div>
        </div>
        <div class="overview-tabs-upper">
          <div class="icon-container brown-bg">
            <img
              src="https://images.sendyit.com/CCredesign/gas_pump.png"
              alt=""
            />
          </div>
          <div class="filter-section-desc">Total litres advanced</div>
          <div class="filter-section-amount">2000 L</div>
        </div>
        <div class="overview-tabs-upper">
          <div class="icon-container orange-bg">
            <img src="https://images.sendyit.com/CCredesign/link.png" alt="" />
          </div>
          <div class="filter-section-desc">Total requests</div>
          <div class="filter-section-amount">101</div>
        </div>
      </div>
      <div class="overview-tab-sections">
        <div class="overview-tabs-lower">
          <div class="icon-container blue-bg">
            <img
              src="https://images.sendyit.com/CCredesign/contact.png"
              alt=""
            />
          </div>
          <div class="filter-section-desc">Total partners</div>
          <div class="filter-section-amount">75</div>
        </div>
        <div class="overview-tabs-lower">
          <div class="icon-container pink-bg">
            <img
              src="https://images.sendyit.com/CCredesign/success.png"
              alt=""
            />
          </div>
          <div class="filter-section-desc">Total approvals</div>
          <div class="filter-section-amount">90</div>
        </div>
        <div class="overview-tabs-lower">
          <div class="icon-container red-bg">
            <img
              src="https://images.sendyit.com/CCredesign/failed.png"
              alt=""
            />
          </div>
          <div class="filter-section-desc">Total Rejects</div>
          <div class="filter-section-amount">11</div>
        </div>
        <div class="overview-tabs-lower">
          <div class="icon-container yellow-bg">
            <img src="https://images.sendyit.com/CCredesign/graph.png" alt="" />
          </div>
          <div class="filter-section-desc">Sendy take</div>
          <div class="filter-section-amount">KES 12,000</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filterdate: '',
    };
  },
};
</script>

<style>
.overview-content-holder {
  padding: 20px;
}
.overview-tab-sections {
  display: flex;
  height: 200px;
  align-items: center;
  justify-content: center;
}
.overview-tabs-upper {
  width: 33%;
  height: 90%;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
  margin: 10px;
  border: 1px solid #f2f6fc;
}
.overview-tabs-lower {
  width: 24%;
  height: 90%;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.05);
  margin: 10px;
  border: 1px solid #f2f6fc;
}
.icon-container {
  padding: 15px;
  border-radius: 50px;
}
.green-bg {
  background: #f5fbf4;
}
.brown-bg {
  background: #fffaf5;
}
.orange-bg {
  background: #fffbf5;
}
.blue-bg {
  background: #fafdff;
}
.pink-bg {
  background: #fff9fe;
}
.red-bg {
  background: #fff8f8;
}
.yellow-bg {
  background: #fffff5;
}
.filter-section-desc {
  color: #dcdcdc;
  font-size: 14px;
}
.filter-section-amount {
  color: #909399;
  font-weight: 500;
  font-size: 36px;
}
.date-filter-title {
  color: #f28226;
  margin: 10px 0px 10px 10px;
}
.date-filter-input {
  margin: 0px 0px 0px 10px;
}
</style>
