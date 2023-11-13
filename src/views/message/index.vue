<template>
  <Card shadow :bordered="false">
    <template #title>消息中心</template>
    <Row :gutter="16">
      <i-col span="4">
        <CellGroup>
          <Cell @click="setCurrentMesType('unread')" :title="__('未读消息')">
            <template #extra>
              <Badge
                class="message-count-badge-outer"
                class-name="message-count-badge"
                :count="unreadCount"
              />
            </template>
          </Cell>
        </CellGroup>
        <CellGroup>
          <Cell @click="setCurrentMesType('hasread')" :title="__('已读消息')">
            <template #extra>
              <Badge
                class="message-count-badge-outer"
                class-name="message-count-badge"
                :count="hasreadCount"
              />
            </template>
          </Cell>
        </CellGroup>
        <CellGroup>
          <Cell @click="setCurrentMesType('recyclebin')" :title="__('回收站')">
            <template #extra>
              <Badge
                class="message-count-badge-outer"
                class-name="message-count-badge"
                :count="recyclebinCount"
              />
            </template>
          </Cell>
        </CellGroup>
      </i-col>
      <i-col span="20">
        <transition name="view-message">
          <div v-if="showMesTitleList" class="message-title-list-con">
            <i-table
              ref="messageList"
              :columns="mesTitleColumns"
              :data="currentMesList"
              :no-data-text="noDataText"
              :show-header="false"
            ></i-table>
          </div>
        </transition>
        <transition name="back-message-list">
          <div v-if="!showMesTitleList" class="message-view-content-con2">
            <DescriptionList :title="mes.title" layout="vertical" :col="1">
              <Description :term="mes.time">
                {{ mes.content }}
              </Description>
            </DescriptionList>

            <div>
              <i-button type="default" size="small" @click="backMesTitleList">
                <Icon type="chevron-left"></Icon>
                {{ __('返回') }}
              </i-button>
            </div>
          </div>
        </transition>
      </i-col>
    </Row>
  </Card>
</template>

<style lang="less" src="./assets/index.less"></style>
<script src="./assets/index.js" lang="tsx"></script>
