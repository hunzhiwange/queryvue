<template>
  <board_header
    ref="board_header"
    :project="project"
    active-name="overview"
  ></board_header>
  <div class="project-navigation2 m-t-15">
    <Row :gutter="16">
      <Col span="24">
        <Card :bordered="false" shadow class="version-item">
          <template #title>
            <strong>任务燃尽图</strong>
          </template>
          <ve-line
            v-if="!burnoutMap.loading"
            :data="burnoutMap.chartData"
            :settings="burnoutMap.chartSettings"
            :extend="burnoutMap.chartExtend"
            :series="burnoutMap.series"
            :legend-visible="false"
            height="200px"
          ></ve-line>
        </Card>
      </Col>
    </Row>
    <Row :gutter="16" class="m-t-15">
      <Col span="18">
        <Row :gutter="16">
          <Col span="24">
            <Card :bordered="false" shadow class="version-item">
              <template #title>
                <strong>项目信息</strong>
              </template>
            </Card>
          </Col>
        </Row>
        <Row :gutter="16" class="m-t-15">
          <Col span="24">
            <Card :bordered="false" shadow class="version-item">
              <template #title>
                <strong>项目动态</strong>
              </template>
            </Card>
          </Col>
        </Row>
      </Col>
      <Col span="6">
        <Card :bordered="false" shadow class="version-item">
          <template #title>
            <strong>项目情况</strong>
          </template>
          <p>lxm 创建于 2021年07月27日</p>
          <p>项目周期</p>
          <p>项目统计</p>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script src="./assets/overview.js" lang="tsx"></script>
<style lang="less" src="./assets/overview.less"></style>
